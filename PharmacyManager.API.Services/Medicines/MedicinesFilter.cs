using PharmacyManager.API.Interfaces.Base;
using PharmacyManager.API.Interfaces.Medicines;
using PharmacyManager.API.Models;

namespace PharmacyManager.API.Services.Medicines
{
    public class MedicinesFilter : IMedicinesFilter<MedicineRequest, MedicineModel>
    {
        private readonly string loggerContext = nameof(MedicinesFilter);
        private readonly ILogger logger;

        public MedicinesFilter(ILogger logger)
        {
            this.logger = logger;
        }

        public async Task<IEnumerable<MedicineModel>> ApplyFilters(MedicineRequest request, IEnumerable<MedicineModel> medicines)
        {
            var filteredMedicines = medicines.AsEnumerable();
            return await FilterByAvailableOnly(request,
                await FilterByNotExpired(request,
                    await FilterByManufacturer(request, filteredMedicines)
                )
            );
        }

        private async Task<IEnumerable<MedicineModel>> FilterByAvailableOnly(MedicineRequest request, IEnumerable<MedicineModel> filteredMedicines)
        {
            if (request.AvailableOnly)
            {
                await logger.Log(this.loggerContext, "Filtering by Available Only", LogLevel.Info);
                filteredMedicines = filteredMedicines.Where(x => x.Quantity > 0);
            }
            return filteredMedicines;
        }

        private async Task<IEnumerable<MedicineModel>> FilterByNotExpired(MedicineRequest request, IEnumerable<MedicineModel> filteredMedicines)
        {
            if (request.NotExpired)
            {
                await logger.Log(this.loggerContext, "Filtering by Not Expired", LogLevel.Info);
                filteredMedicines = filteredMedicines.Where(x => x.ExpirationDate > DateTime.Now);
            }
            return filteredMedicines;
        }

        private async Task<IEnumerable<MedicineModel>> FilterByManufacturer(MedicineRequest request, IEnumerable<MedicineModel> filteredMedicines)
        {
            if (request.Manufacturer != null && request.Manufacturer.Length != 0)
            {
                await logger.Log(this.loggerContext, $"Filtering by Manufacturer containing {request.Manufacturer}", LogLevel.Info);
                filteredMedicines = filteredMedicines.Where(x => x.Manufacturer.ToLower().Contains(request.Manufacturer.ToLower()));
            }
            return filteredMedicines;
        }
    }
}
