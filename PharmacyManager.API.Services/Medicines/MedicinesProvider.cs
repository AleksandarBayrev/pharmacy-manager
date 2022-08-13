using PharmacyManager.API.Interfaces.Medicines;
using PharmacyManager.API.Models;

namespace PharmacyManager.API.Services.Medicines
{
    public class MedicinesProvider : IMedicinesProvider<MedicineModel>
    {
        public IEnumerable<MedicineModel> Medicines => Enumerable.Empty<MedicineModel>();
    }
}
