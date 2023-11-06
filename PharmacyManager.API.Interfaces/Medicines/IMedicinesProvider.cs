namespace PharmacyManager.API.Interfaces.Medicines
{
    public interface IMedicinesProvider<TMedicineRequestModel, TMedicineKey, TMedicineModel>
    {
        public Task LoadMedicines();
		public Task<TMedicineModel> AddMedicine(TMedicineModel medicine);
		public Task<bool> RemoveMedicine(TMedicineKey medicineId);
		public Task<IEnumerable<TMedicineModel>> GetFilteredMedicines(TMedicineRequestModel request);
		public Task<int> GetTotalCount();
	}
}
