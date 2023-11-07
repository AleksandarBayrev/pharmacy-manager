using Microsoft.Extensions.Caching.Memory;
using Npgsql;
using PharmacyManager.API.Interfaces.Base;
using PharmacyManager.API.Interfaces.Medicines;
using PharmacyManager.API.Models;
using System.Collections.Concurrent;
using System.Globalization;
using System.Text.Json;

namespace PharmacyManager.API.Services.Medicines
{
	public class MedicinesProvider : IMedicinesProvider<MedicineRequest, string, MedicineModel>
	{
		private readonly ILogger logger;
		private readonly IApplicationConfiguration applicationConfiguration;
		private readonly IMedicinesState<string, MedicineModel> medicinesState;
		private readonly IMedicinesFilter<MedicineRequest, MedicineModel> medicinesFilter;

		public MedicinesProvider(
			ILogger logger,
			IApplicationConfiguration applicationConfiguration,
			IMedicinesState<string, MedicineModel> medicinesState,
			IMedicinesFilter<MedicineRequest, MedicineModel> medicinesFilter)
		{
			this.logger = logger;
			this.applicationConfiguration = applicationConfiguration;
			this.medicinesState = medicinesState;
			this.medicinesFilter = medicinesFilter;
		}


		public async Task<MedicineModel?> AddMedicine(MedicineModel medicine)
		{
			await this.Log($"Adding medicine: {JsonSerializer.Serialize(medicine)}", LogLevel.Info);
			this.medicinesState.Medicines.TryAdd(medicine.Id, medicine);
			this.medicinesState.Medicines.TryGetValue(medicine.Id, out medicine);
			await this.AddMedicineToDB(medicine.Id);
			return medicine;
		}

		public async Task<bool> RemoveMedicine(string medicineId)
		{
			await this.Log($"Removing medicine with ID = {medicineId}", LogLevel.Info);
			this.medicinesState.Medicines.Remove(medicineId, out var _);
			await this.DeleteMedicineInDB(medicineId);
			return this.medicinesState.Medicines.TryGetValue(medicineId, out var _);
		}

		public async Task<IEnumerable<MedicineModel>> GetFilteredMedicines(MedicineRequest request)
		{
			await this.Log($"Getting medicines for request: {JsonSerializer.Serialize(request)}", LogLevel.Info);
			var filteredMedicines = await this.medicinesFilter.ApplyFilters(request, this.medicinesState.Medicines.Values);
			return filteredMedicines.OrderByDescending(x => x.ExpirationDate);
		}

		public async Task<int> GetTotalCount()
		{
			await this.Log($"Getting total medicines count", LogLevel.Info);
			return this.medicinesState.Medicines.Count;
		}

		private NpgsqlConnection BuildConnection()
		{
			var connectionStringBuilder = new NpgsqlConnectionStringBuilder()
			{
				Host = this.applicationConfiguration.DatabaseConfiguration.Host,
				Username = this.applicationConfiguration.DatabaseConfiguration.Username,
				Password = this.applicationConfiguration.DatabaseConfiguration.Password,
				Database = this.applicationConfiguration.DatabaseConfiguration.Database,
				Port = this.applicationConfiguration.DatabaseConfiguration.Port,
			};
			return new NpgsqlConnection(connectionStringBuilder.ToString());
		}

		private async Task AddMedicineToDB(string medicineId)
		{
			using (var dbClient = this.BuildConnection())
			{
				MedicineModel? medicine;
				this.medicinesState.Medicines.TryGetValue(medicineId, out medicine);
				await dbClient.OpenAsync();
				await this.Log($"Trying to add medicine: {JsonSerializer.Serialize(medicine)}", LogLevel.Info);

				using (var addCommand = new NpgsqlCommand($"INSERT INTO public.medicines(id, manufacturer, name, description, \"manufacturingDate\", \"expirationDate\", price, quantity) VALUES ('{medicine.Id}', '{medicine.Manufacturer}', '{medicine.Name}', '{medicine.Description}', '{this.FormatDate(medicine.ManufacturingDate)}', '{this.FormatDate(medicine.ExpirationDate)}', {medicine.Price.ToString(CultureInfo.InvariantCulture)}, {medicine.Quantity});", dbClient))
				{
					var rows = await addCommand.ExecuteScalarAsync();
					await this.Log($"Successfully added {rows} medicines", LogLevel.Info);
				}
				medicine = null;
			}
		}

		private async Task UpdateMedicineInDB(string medicineId)
		{
			using (var dbClient = this.BuildConnection())
			{
				await dbClient.OpenAsync();
				MedicineModel? medicine;
				this.medicinesState.Medicines.TryGetValue(medicineId, out medicine);

				if (medicine != null)
				{
					using (var addCommand = new NpgsqlCommand($"UPDATE public.medicines SET manufacturer='{medicine.Manufacturer}', name='{medicine.Name}', description='{medicine.Description}', \"manufacturingDate\"='{medicine.ManufacturingDate}', \"expirationDate\"='{medicine.ExpirationDate}', price={medicine.Price.ToString(CultureInfo.InvariantCulture)}, quantity={medicine.Quantity}", dbClient))
					{
						await this.Log($"Trying to update medicine ID: {medicineId}", LogLevel.Info);
						await addCommand.ExecuteNonQueryAsync();
						using (var getCommand = new NpgsqlCommand($"SELECT * FROM public.medicines WHERE id='{medicineId}'", dbClient))
						{
							var data = await getCommand.ExecuteScalarAsync() as MedicineModel;
							if (data != null)
							{
								await this.Log($"Successfully updated medicine ID: {medicineId}", LogLevel.Info);
							}
						}
					}
					medicine = null;
				}
			}
		}

		private async Task DeleteMedicineInDB(string medicineId)
		{
			using (var dbClient = this.BuildConnection())
			{
				await dbClient.OpenAsync();
				await this.Log($"Trying to delete medicine ID: {medicineId}", LogLevel.Info);
				using (var addCommand = new NpgsqlCommand($"UPDATE public.medicines SET deleted=true WHERE id='{medicineId}'", dbClient))
				{
					await addCommand.ExecuteNonQueryAsync();
					using (var getCommand = new NpgsqlCommand($"SELECT COUNT(*) FROM public.medicines WHERE id='{medicineId}' AND deleted=true", dbClient))
					{
						var data = (await getCommand.ExecuteScalarAsync()) as int?;
						if (data == 1)
						{
							await this.Log($"Successfully removed medicine ID: {medicineId}", LogLevel.Info);
						}
					}
				}
			}
		}

		private string FormatDate(DateTime date) => date.ToString("yyyy-MM-ddThh:mm:ssZ");

		private Task Log(string message, LogLevel logLevel) => this.logger.Log(nameof(MedicinesProvider), message, logLevel);
	}
}
