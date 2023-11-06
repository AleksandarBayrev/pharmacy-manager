using Npgsql;
using PharmacyManager.API.Interfaces.Base;
using PharmacyManager.API.Interfaces.Medicines;
using PharmacyManager.API.Models;
using System.Collections.Concurrent;
using System.Text;
using System.Text.Json;
using Timer = System.Timers.Timer;

namespace PharmacyManager.API.Services.Medicines
{
	public class MedicinesProvider : IMedicinesProvider<MedicineRequest, string, MedicineModel>
	{
		private bool shouldReloadDataFromDB = false;
		private bool isReloadingInProgress = false;
		private readonly IDictionary<string, MedicineModel> medicines;
		private readonly ILogger logger;
		private readonly IApplicationConfiguration applicationConfiguration;
		private readonly IMedicinesFilter<MedicineRequest, MedicineModel> medicinesFilter;
		private readonly IDictionary<string, string> idsToAdd;
		private readonly IDictionary<string, string> idsToUpdate;
		private readonly IDictionary<string, string> idsToRemove;

		public MedicinesProvider(
			ILogger logger,
			IApplicationConfiguration applicationConfiguration,
			IMedicinesFilter<MedicineRequest, MedicineModel> medicinesFilter)
		{
			this.logger = logger;
			this.applicationConfiguration = applicationConfiguration;
			this.medicinesFilter = medicinesFilter;
			this.medicines = new ConcurrentDictionary<string, MedicineModel>();
			this.idsToAdd = new ConcurrentDictionary<string, string>();
			this.idsToUpdate = new ConcurrentDictionary<string, string>();
			this.idsToRemove = new ConcurrentDictionary<string, string>();
		}

		public async Task StartWorkers()
		{
			Timer databaseTimer = new Timer(1000);
			databaseTimer.Elapsed += async (o, e) => await this.DatabaseWorker();
			databaseTimer.Start();
			Timer reloadTimer = new Timer(1000);
			reloadTimer.Elapsed += async (o, e) => await this.StartReloadInterval();
			reloadTimer.Start();
		}

		public async Task LoadMedicines()
		{
			if (this.isReloadingInProgress) { return; }
			this.medicines.Clear();
			await this.Log($"Started loading medicines from database", LogLevel.Info);
			using (var dbClient = this.BuildConnection())
			{
				await dbClient.OpenAsync();
				using (var command = new NpgsqlCommand("SELECT * FROM public.medicines", dbClient))
				using (var reader = await command.ExecuteReaderAsync())
				{
					this.isReloadingInProgress = true;
					while (await reader.ReadAsync())
					{
						var medicine = await this.BuildMedicine(reader);
						this.medicines.Add(medicine.Id, medicine);
					}
				}
			}
			this.isReloadingInProgress = false;
			await this.Log($"Finished reloading medicines from database", LogLevel.Info);
		}

		public async Task<MedicineModel?> AddMedicine(MedicineModel medicine)
		{
			await this.Log($"Adding medicine: {JsonSerializer.Serialize(medicine)}", LogLevel.Info);
			this.medicines.Add(medicine.Id, medicine);
			this.idsToAdd.TryAdd(medicine.Id, medicine.Id);
			return this.medicines[medicine.Id];
		}

		public async Task<bool> RemoveMedicine(string medicineId)
		{
			await this.Log($"Removing medicine with ID = {medicineId}", LogLevel.Info);
			var isRemoved = this.medicines.Remove(medicineId);
			if (isRemoved)
			{
				this.idsToRemove.TryAdd(medicineId, medicineId);
			}
			return isRemoved;
		}

		public async Task<IEnumerable<MedicineModel>> GetFilteredMedicines(MedicineRequest request)
		{
			if (this.shouldReloadDataFromDB)
			{
				await this.LoadMedicines();
			}
			await this.Log($"Getting medicines for request: {JsonSerializer.Serialize(request)}", LogLevel.Info);
			var filteredMedicines = await this.medicinesFilter.ApplyFilters(request, medicines.Values);
			return filteredMedicines.OrderByDescending(x => x.ExpirationDate);
		}

		public async Task<int> GetTotalCount()
		{
			await this.Log($"Getting total medicines count", LogLevel.Info);
			return this.medicines.Count;
		}

		private async Task<MedicineModel> BuildMedicine(NpgsqlDataReader reader)
		{
			var id = await reader.GetFieldValueAsync<Guid>(0);
			var manufacturer = await reader.GetFieldValueAsync<string>(1);
			var name = await reader.GetFieldValueAsync<string>(2);
			var description = await reader.GetFieldValueAsync<string>(3);
			var manufacturingDate = await reader.GetFieldValueAsync<DateTime>(4);
			var expirationDate = await reader.GetFieldValueAsync<DateTime>(5);
			var price = await reader.GetFieldValueAsync<decimal>(6);
			var quantity = await reader.GetFieldValueAsync<long>(7);

			return new MedicineModel
			{
				Id = id.ToString(),
				Manufacturer = manufacturer,
				Name = name,
				Description = description,
				ManufacturingDate = manufacturingDate,
				ExpirationDate = expirationDate,
				Price = price,
				Quantity = quantity
			};
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

		private async Task DatabaseWorker()
		{
			await Task.WhenAll(new[]
			{
				this.AddMedicinesToDB(),
				this.UpdateMedicinesInDB(),
				this.DeleteMedicinesInDB()
			});
		}

		private async Task AddMedicinesToDB()
		{
			if (this.idsToAdd.Count == 0)
			{
				return;
			}
			var medicinesList = new StringBuilder();
			foreach (var medicineId in this.idsToAdd.Keys)
			{
				var id = medicineId;
				MedicineModel? medicine;
				this.medicines.TryGetValue(medicineId, out medicine);
				if (medicine != null)
				{
					medicinesList.Append($"('{id}', '{medicine.Manufacturer}', '{medicine.Name}', '{medicine.Description}', '{this.FormatDate(medicine.ManufacturingDate)}', '{this.FormatDate(medicine.ExpirationDate)}', {medicine.Price}, {medicine.Quantity}), ");
				}
			}
			using (var dbClient = this.BuildConnection())
			{
				var trimmedList = medicinesList.ToString().Trim();
				if (trimmedList.Length < 0) { return; }
				var listToAdd = trimmedList.Substring(0, trimmedList.Length - 1);
				await dbClient.OpenAsync();
				await this.Log($"Trying to add medicines: {listToAdd}", LogLevel.Info);

				using (var addCommand = new NpgsqlCommand($"INSERT INTO public.medicines(id, manufacturer, name, description, \"manufacturingDate\", \"expirationDate\", price, quantity) VALUES {listToAdd};", dbClient))
				{
					var rows = await addCommand.ExecuteScalarAsync();
					await this.Log($"Successfully added {rows} medicines", LogLevel.Info);
				}
			}
			medicinesList = null;
			this.idsToAdd.Clear();
		}

		private async Task UpdateMedicinesInDB()
		{
			foreach (var medicineId in this.idsToUpdate.Keys)
			{
				using (var dbClient = this.BuildConnection())
				{
					await dbClient.OpenAsync();
					MedicineModel? medicine;
					this.medicines.TryGetValue(medicineId, out medicine);

					if (medicine != null)
					{
						using (var addCommand = new NpgsqlCommand($"UPDATE public.medicines SET manufacturer='{medicine.Manufacturer}', name='{medicine.Name}', description='{medicine.Description}', \"manufacturingDate\"='{medicine.ManufacturingDate}', \"expirationDate\"='{medicine.ExpirationDate}', price={medicine.Price}, quantity={medicine.Quantity}", dbClient))
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
						this.idsToUpdate.Clear();
					}
				}
			}
		}

		private async Task DeleteMedicinesInDB()
		{
			foreach (var medicineId in this.idsToRemove.Keys)
			{
				using (var dbClient = this.BuildConnection())
				{
					await dbClient.OpenAsync();
					await this.Log($"Trying to delete medicine ID: {medicineId}", LogLevel.Info);
					using (var addCommand = new NpgsqlCommand($"DELETE FROM public.medicines WHERE id='{medicineId}'", dbClient))
					{
						await addCommand.ExecuteNonQueryAsync();
						using (var getCommand = new NpgsqlCommand($"SELECT * FROM public.medicines WHERE id='{medicineId}'", dbClient))
						{
							var data = await getCommand.ExecuteScalarAsync() as MedicineModel;
							if (data == null)
							{
								await this.Log($"Successfully removed medicine ID: {medicineId}", LogLevel.Info);
							}
						}
					}
					this.idsToRemove.Clear();
				}
			}
		}

		private async Task StartReloadInterval()
		{
			using (var dbClient = this.BuildConnection())
			{
				await dbClient.OpenAsync();
				using (var addCommand = new NpgsqlCommand($"SELECT COUNT(id) FROM public.medicines", dbClient))
				{
					long count = Convert.ToInt64(await addCommand.ExecuteScalarAsync());
					this.shouldReloadDataFromDB = count != this.medicines.Count;
					await this.Log($"isReloadingData: {this.shouldReloadDataFromDB}", LogLevel.Info);
				}
			}
		}

		private string FormatDate(DateTime date) => date.ToString("yyyy-MM-ddThh:mm:ssZ");

		private Task Log(string message, LogLevel logLevel) => this.logger.Log(nameof(MedicinesProvider), message, logLevel);
	}
}
