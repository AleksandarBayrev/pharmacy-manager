using Npgsql;
using PharmacyManager.API.Interfaces.Base;
using PharmacyManager.API.Interfaces.Medicines;
using PharmacyManager.API.Models;
using System.Globalization;
using System.Text.Json;

namespace PharmacyManager.API.Services.Medicines
{
	public class MedicinesProvider : IMedicinesProvider<MedicineRequest, string, MedicineModel>
	{
		private readonly ILogger logger;
		private readonly IConnectionStringSchemaTableProvider connectionStringProvider;
		private readonly IMedicinesState<string, MedicineModel> medicinesState;
		private readonly IMedicinesOperations<string> medicinesOperations;
		private readonly IMedicinesFilter<MedicineRequest, MedicineModel> medicinesFilter;

		public MedicinesProvider(
			ILogger logger,
			IConnectionStringSchemaTableProvider connectionStringProvider,
			IMedicinesState<string, MedicineModel> medicinesState,
			IMedicinesOperations<string> medicinesOperations,
			IMedicinesFilter<MedicineRequest, MedicineModel> medicinesFilter)
		{
			this.logger = logger;
			this.connectionStringProvider = connectionStringProvider;
			this.medicinesState = medicinesState;
			this.medicinesOperations = medicinesOperations;
			this.medicinesFilter = medicinesFilter;
		}


		public async Task<MedicineModel> AddMedicine(MedicineModel medicine)
		{
			await this.Log($"Adding medicine: {JsonSerializer.Serialize(medicine)}", LogLevel.Info);
			this.medicinesState.TryAdd(medicine.Id, medicine);
			this.medicinesState.Medicines.TryGetValue(medicine.Id, out var storedMedicine);
			if (storedMedicine != null)
			{
				throw new KeyNotFoundException($"Medicine already exists for id = {medicine.Id}");
			}
			await this.medicinesOperations.AddMedicineToDB(medicine.Id);
			return medicine;
		}

		public async Task<bool> RemoveMedicine(string medicineId)
		{
			await this.Log($"Removing medicine with ID = {medicineId}", LogLevel.Info);
			this.medicinesState.DeleteMedicine(medicineId);
			await this.medicinesOperations.DeleteMedicineInDB(medicineId);
			return this.medicinesState.Medicines.TryGetValue(medicineId, out var _);
		}

		public async Task<bool> UpdateMedicine(MedicineModel medicine)
		{
			var oldMedicine = this.medicinesState.Medicines[medicine.Id];
			if (oldMedicine == null)
			{
				await this.Log($"Failed updating medicine with ID = {medicine.Id}, medicine not found!", LogLevel.Error);
				return false;
			}
			await this.Log($"Updating medicine with ID = {medicine.Id}", LogLevel.Info);
			this.medicinesState.AddOrUpdate(medicine.Id, medicine, (key, value) =>
			{
				value.Name = medicine.Name;
				value.Manufacturer = medicine.Manufacturer;
				value.Description = medicine.Description;
				value.ExpirationDate = medicine.ExpirationDate;
				value.ManufacturingDate = medicine.ManufacturingDate;
				value.Price = medicine.Price;
				value.Quantity = medicine.Quantity;
				return value;
			});
			await this.medicinesOperations.UpdateMedicineInDB(medicine.Id);
			return this.medicinesState.Medicines.TryGetValue(medicine.Id, out var _);
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

		public Task<MedicineModel> GetMedicineById(string medicineId)
		{
			var medicine = this.medicinesState.Medicines[medicineId];
			if (medicine == null)
			{
				throw new KeyNotFoundException($"Medicine for id {medicineId} not found");
			}
			return Task.FromResult(medicine);
		}

		private NpgsqlConnection BuildConnection()
		{
			return new NpgsqlConnection(connectionStringProvider.ConnectionString);
		}

		private Task Log(string message, LogLevel logLevel) => this.logger.Log(nameof(MedicinesProvider), message, logLevel);
	}
}
