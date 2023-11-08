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


		public async Task<MedicineModel?> AddMedicine(MedicineModel medicine)
		{
			await this.Log($"Adding medicine: {JsonSerializer.Serialize(medicine)}", LogLevel.Info);
			this.medicinesState.Medicines.TryAdd(medicine.Id, medicine);
			this.medicinesState.Medicines.TryGetValue(medicine.Id, out medicine);
			await this.medicinesOperations.AddMedicineToDB(medicine.Id);
			return medicine;
		}

		public async Task<bool> RemoveMedicine(string medicineId)
		{
			await this.Log($"Removing medicine with ID = {medicineId}", LogLevel.Info);
			this.medicinesState.Medicines.Remove(medicineId, out var _);
			await this.medicinesOperations.DeleteMedicineInDB(medicineId);
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
			return new NpgsqlConnection(connectionStringProvider.ConnectionString);
		}

		private Task Log(string message, LogLevel logLevel) => this.logger.Log(nameof(MedicinesProvider), message, logLevel);
	}
}
