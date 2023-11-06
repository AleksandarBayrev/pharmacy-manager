using Microsoft.Extensions.Caching.Memory;
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
		private readonly string cacheKey = "medicines";
		private readonly ILogger logger;
		private readonly IApplicationConfiguration applicationConfiguration;
		private readonly IMemoryCache memoryCache;
		private readonly IMedicinesFilter<MedicineRequest, MedicineModel> medicinesFilter;

		public MedicinesProvider(
			ILogger logger,
			IApplicationConfiguration applicationConfiguration,
			IMemoryCache memoryCache,
			IMedicinesFilter<MedicineRequest, MedicineModel> medicinesFilter)
		{
			this.logger = logger;
			this.applicationConfiguration = applicationConfiguration;
			this.memoryCache = memoryCache;
			this.medicinesFilter = medicinesFilter;
		}

		public async Task LoadMedicines()
		{
			if (this.memoryCache.TryGetValue(cacheKey, out _)) { return; }
			await this.Log($"Started loading medicines from database", LogLevel.Info);
			if (!this.memoryCache.TryGetValue(cacheKey, out _))
			{
				this.memoryCache.Set(cacheKey, new ConcurrentDictionary<string, MedicineModel>());
			}
			using (var dbClient = this.BuildConnection())
			{
				await dbClient.OpenAsync();
				using (var command = new NpgsqlCommand("SELECT * FROM public.medicines", dbClient))
				using (var reader = await command.ExecuteReaderAsync())
				{
					while (await reader.ReadAsync())
					{
						var medicine = await this.BuildMedicine(reader);
						medicines.AddOrUpdate(medicine.Id, medicine, (key, current) =>
						{
							current.Id = medicine.Id;
							current.Name = medicine.Name;
							current.Manufacturer = medicine.Manufacturer;
							current.Description = medicine.Description;
							current.ExpirationDate = medicine.ExpirationDate;
							current.ManufacturingDate = medicine.ManufacturingDate;
							current.Price = medicine.Price;
							current.Quantity = medicine.Quantity;
							return current;
						});
					}
				}
			}
			this.memoryCache.Set<ConcurrentDictionary<string, MedicineModel>>(cacheKey, medicines, TimeSpan.FromMinutes(1));
			await this.Log($"Finished loading medicines from database", LogLevel.Info);
		}

		public async Task<MedicineModel?> AddMedicine(MedicineModel medicine)
		{
			if (this.medicines == null)
			{
				await this.LoadMedicines();
			}
			await this.Log($"Adding medicine: {JsonSerializer.Serialize(medicine)}", LogLevel.Info);
			this.medicines.TryAdd(medicine.Id, medicine);
			this.medicines.TryGetValue(medicine.Id, out medicine);
			await this.AddMedicineToDB(medicine.Id);
			return medicine;
		}

		public async Task<bool> RemoveMedicine(string medicineId)
		{
			if (this.medicines == null)
			{
				await this.LoadMedicines();
			}
			await this.Log($"Removing medicine with ID = {medicineId}", LogLevel.Info);
			this.memoryCache.Remove(medicineId);
			await this.DeleteMedicineInDB(medicineId);
			return this.memoryCache.Get<IDictionary<string, MedicineModel>>(cacheKey) == null;
		}

		public async Task<IEnumerable<MedicineModel>> GetFilteredMedicines(MedicineRequest request)
		{
			if (this.medicines == null)
			{
				await this.LoadMedicines();
			}
			await this.Log($"Getting medicines for request: {JsonSerializer.Serialize(request)}", LogLevel.Info);
			var filteredMedicines = await this.medicinesFilter.ApplyFilters(request, this.medicines.Values);
			return filteredMedicines.OrderByDescending(x => x.ExpirationDate);
		}

		public async Task<int> GetTotalCount()
		{
			if (this.medicines == null)
			{
				await this.LoadMedicines();
			}
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

		private async Task AddMedicineToDB(string medicineId)
		{
			using (var dbClient = this.BuildConnection())
			{
				MedicineModel? medicine;
				this.medicines.TryGetValue(medicineId, out medicine);
				await dbClient.OpenAsync();
				await this.Log($"Trying to add medicine: {JsonSerializer.Serialize(medicine)}", LogLevel.Info);

				using (var addCommand = new NpgsqlCommand($"INSERT INTO public.medicines(id, manufacturer, name, description, \"manufacturingDate\", \"expirationDate\", price, quantity) VALUES ('{medicine.Id}', '{medicine.Manufacturer}', '{medicine.Name}', '{medicine.Description}', '{this.FormatDate(medicine.ManufacturingDate)}', '{this.FormatDate(medicine.ExpirationDate)}', {medicine.Price}, {medicine.Quantity});", dbClient))
				{
					var rows = await addCommand.ExecuteScalarAsync();
					await this.Log($"Successfully added {rows} medicines", LogLevel.Info);
				}
			}
		}

		private async Task UpdateMedicineInDB(string medicineId)
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
				}
			}
		}

		private async Task DeleteMedicineInDB(string medicineId)
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
			}
		}

		private string FormatDate(DateTime date) => date.ToString("yyyy-MM-ddThh:mm:ssZ");

		private Task Log(string message, LogLevel logLevel) => this.logger.Log(nameof(MedicinesProvider), message, logLevel);

		private ConcurrentDictionary<string, MedicineModel> medicines => this.memoryCache.Get<ConcurrentDictionary<string, MedicineModel>>(cacheKey);
	}
}
