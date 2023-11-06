using Npgsql;
using PharmacyManager.API.Interfaces.Base;
using PharmacyManager.API.Interfaces.Medicines;
using PharmacyManager.API.Models;
using System.Collections.Concurrent;
using System.Text;
using System.Text.Json;

namespace PharmacyManager.API.Services.Medicines
{
	public class MedicinesProvider : IMedicinesProvider<MedicineRequest, string, MedicineModel>
	{
		private bool isReloadingData = false;
		private bool isReloadingInProgress = false;
		private readonly IDictionary<string, MedicineModel> medicines;
		private readonly ILogger logger;
		private readonly IApplicationConfiguration applicationConfiguration;
		private readonly IMedicinesFilter<MedicineRequest, MedicineModel> medicinesFilter;
		private readonly IList<string> idsToAdd;
		private readonly IList<string> idsToUpdate;
		private readonly IList<string> idsToRemove;
		private object lockObject = new object();

		public MedicinesProvider(
			ILogger logger,
			IApplicationConfiguration applicationConfiguration,
			IMedicinesFilter<MedicineRequest, MedicineModel> medicinesFilter)
		{
			this.logger = logger;
			this.applicationConfiguration = applicationConfiguration;
			this.medicinesFilter = medicinesFilter;
			this.medicines = new ConcurrentDictionary<string, MedicineModel>();
			lock (this.lockObject)
			{
				this.idsToAdd = new List<string>();
				this.idsToUpdate = new List<string>();
				this.idsToRemove = new List<string>();
			}
		}

		public async Task StartWorkers()
		{
			while (true)
			{
				await this.DatabaseWorker();
				await this.StartReloadInterval();
			}
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
			lock (lockObject)
			{
				this.idsToAdd.Add(medicine.Id);
			}
			return this.medicines[medicine.Id];
		}

		public async Task<bool> RemoveMedicine(string medicineId)
		{
			await this.Log($"Removing medicine with ID = {medicineId}", LogLevel.Info);
			var isRemoved = this.medicines.Remove(medicineId);
			if (isRemoved)
			{
				lock (lockObject)
				{
					this.idsToRemove.Add(medicineId);
				}
			}
			return isRemoved;
		}

		public async Task<IEnumerable<MedicineModel>> GetFilteredMedicines(MedicineRequest request)
		{
			if (this.isReloadingData)
			{
				await this.LoadMedicines();
			}
			await this.Log($"Getting medicines for request: {JsonSerializer.Serialize(request)}", LogLevel.Info);
			var filteredMedicines = await this.medicinesFilter.ApplyFilters(request, medicines.Values);
			return filteredMedicines.OrderByDescending(x => x.ExpirationDate);
		}

		public async Task<int> GetFilteredMedicinesCount(MedicineRequest request)
		{
			await this.Log($"Getting medicines count for request: {JsonSerializer.Serialize(request)}", LogLevel.Info);
			var filteredMedicines = await this.GetFilteredMedicines(request);
			return filteredMedicines.Count();
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

			await Task.Delay(1000);
		}

		private async Task AddMedicinesToDB()
		{
			lock (lockObject)
			{
				if (this.idsToAdd.Count == 0)
				{
					return;
				}
			}
			var medicinesList = new StringBuilder();
			lock (lockObject)
			{
				foreach (var medicineId in this.idsToAdd)
				{
					var id = medicineId;
					var medicine = this.medicines[medicineId];
					medicinesList.Append($"('{id}', '{medicine.Manufacturer}', '{medicine.Name}', '{medicine.Description}', '{this.FormatDate(medicine.ManufacturingDate)}', '{this.FormatDate(medicine.ExpirationDate)}', {medicine.Price}, {medicine.Quantity}) ");
				}
			}
			using (var dbClient = this.BuildConnection())
			{
				await dbClient.OpenAsync();
				using (var addCommand = new NpgsqlCommand($"INSERT INTO public.medicines(id, manufacturer, name, description, \"manufacturingDate\", \"expirationDate\", price, quantity) VALUES {medicinesList.ToString().Trim()};", dbClient))
				{
					var rows = await addCommand.ExecuteNonQueryAsync();
					if (rows != 0)
					{
						await this.Log($"Successfully added {rows} medicines", LogLevel.Info);
					}
				}
			}
			medicinesList = null;
			lock (lockObject)
			{
				this.idsToAdd.Clear();
			}
		}

		private async Task UpdateMedicinesInDB()
		{
			var idsToUpdate = new List<string>();
			lock (lockObject)
			{
				idsToUpdate.AddRange(this.idsToUpdate);
			}
			foreach (var medicineId in idsToUpdate)
			{
				using (var dbClient = this.BuildConnection())
				{
					await dbClient.OpenAsync();
					var medicine = this.medicines[medicineId];
					using (var addCommand = new NpgsqlCommand($"UPDATE public.medicines SET manufacturer='{medicine.Manufacturer}', name='{medicine.Name}', description='{medicine.Description}', \"manufacturingDate\"='{medicine.ManufacturingDate}', \"expirationDate\"='{medicine.ExpirationDate}', price={medicine.Price}, quantity={medicine.Quantity}", dbClient))
					{
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
					this.idsToUpdate.Clear();
				}
			}
		}

		private async Task DeleteMedicinesInDB()
		{
			var idsToRemove = new List<string>();
			lock (lockObject)
			{
				idsToRemove.AddRange(this.idsToRemove);
			}
			foreach (var medicineId in idsToRemove)
			{
				using (var dbClient = this.BuildConnection())
				{
					await dbClient.OpenAsync();
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
			lock (lockObject)
			{
				if (idsToAdd.Count == 0 && idsToUpdate.Count == 0 && idsToRemove.Count > 0)
				{
					return;
				}
			}
			using (var dbClient = this.BuildConnection())
			{
				await dbClient.OpenAsync();
				using (var addCommand = new NpgsqlCommand($"SELECT COUNT(id) FROM public.medicines", dbClient))
				{
					long count = Convert.ToInt64(await addCommand.ExecuteScalarAsync());

					if (count == this.medicines.Count)
					{
						lock (lockObject)
						{
							this.isReloadingData = false;
						}
						return;
					}
					lock (lockObject)
					{
						this.isReloadingData = true;
						this.isReloadingInProgress = true;
					}
				}
			}
			await Task.Delay(1000);
		}

		private string FormatDate(DateTime date) => date.ToString("yyyy-MM-ddThh:mm:ssZ");

		private Task Log(string message, LogLevel logLevel) => this.logger.Log(nameof(MedicinesProvider), message, logLevel);
	}
}
