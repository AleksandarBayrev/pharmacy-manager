namespace PharmacyManager.API.Interfaces.Medicines
{
    public interface IMedicinesProvider<TMedicineRequestModel, TMedicineModel>
    {
        public Task<IEnumerable<TMedicineModel>> GetFilteredMedicines(TMedicineRequestModel request);
        public Task<int> GetFilteredMedicinesCount(TMedicineRequestModel request);
    }
}
