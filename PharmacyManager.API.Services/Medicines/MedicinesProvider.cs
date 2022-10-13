using PharmacyManager.API.Interfaces.Medicines;
using PharmacyManager.API.Models;

namespace PharmacyManager.API.Services.Medicines
{
    public class MedicinesProvider : IMedicinesProvider<MedicineRequest, MedicineModel>
    {
        public Task<MedicineModel> AddMedicine(MedicineModel medicine)
        {
            throw new NotImplementedException();
        }

        public Task<IEnumerable<MedicineModel>> GetFilteredMedicines(MedicineRequest request)
        {
            throw new NotImplementedException();
        }

        public Task<int> GetFilteredMedicinesCount(MedicineRequest request)
        {
            throw new NotImplementedException();
        }
    }
}
