namespace PharmacyManager.API.Interfaces.Medicines
{
    public interface IMedicinesProvider<TMedicineRequestModel, TMedicineKey, TMedicineModel>
    {
		public Task<TMedicineModel> AddMedicine(TMedicineModel medicine);
		public Task<bool> RemoveMedicine(TMedicineKey medicineId);
		public Task<bool> UpdateMedicine(TMedicineModel medicine);
		public Task<IEnumerable<TMedicineModel>> GetFilteredMedicines(TMedicineRequestModel request);
		public Task<int> GetTotalCount();
		public Task<TMedicineModel> GetMedicineById(TMedicineKey medicineId);
	}
}
