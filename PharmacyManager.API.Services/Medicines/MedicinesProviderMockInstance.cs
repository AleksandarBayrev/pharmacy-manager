using PharmacyManager.API.Interfaces.Base;
using PharmacyManager.API.Interfaces.Medicines;
using PharmacyManager.API.Models;

namespace PharmacyManager.API.Services.Medicines
{
    public class MedicinesProviderMockInstance : IMedicinesProvider<MedicineRequest, MedicineModel>
    {
        private readonly ILogger logger;
        private readonly IIdGenerator idGenerator;
        private IList<MedicineModel> _medicines;
        private readonly string loggerContext = nameof(MedicinesProviderMockInstance);

        public MedicinesProviderMockInstance(
            ILogger logger,
            IIdGenerator idGenerator)
        {
            this.logger = logger;
            this.idGenerator = idGenerator;
            this._medicines = new List<MedicineModel>
            {
                new MedicineModel
                {
                    Id = this.idGenerator.GenerateId(),
                    Description = "Paracetamol",
                    Name = "Paracetamol",
                    Manufacturer = "Paracetamol",
                    ManufacturingDate = new DateTime(2020, 1, 1),
                    ExpirationDate = new DateTime(2022, 1, 1),
                    Price = 2.5,
                    Quantity = 100
                },
                new MedicineModel
                {
                    Id = this.idGenerator.GenerateId(),
                    Description = "Paracetamol",
                    Name = "Paracetamol",
                    Manufacturer = "Bayer",
                    ManufacturingDate = new DateTime(2020, 1, 1),
                    ExpirationDate = new DateTime(2022, 1, 1),
                    Price = 2.5,
                    Quantity = 100
                },
                new MedicineModel
                {
                    Id = this.idGenerator.GenerateId(),
                    Description = "Analgin",
                    Name = "Analgin",
                    Manufacturer = "Analgin",
                    ManufacturingDate = new DateTime(2020, 1, 1),
                    ExpirationDate = new DateTime(2100, 1, 1),
                    Price = 2.99,
                    Quantity = 50
                },
                new MedicineModel
                {
                    Id = this.idGenerator.GenerateId(),
                    Description = "Headmaster",
                    Name = "Headmaster",
                    Manufacturer = "Head",
                    ManufacturingDate = new DateTime(2020, 1, 1),
                    ExpirationDate = new DateTime(2100, 1, 1),
                    Price = 2.99,
                    Quantity = 0
                }
            };

            for (var i = 0; i < 100000; i++)
            {
                this._medicines.Add(new MedicineModel { Id = this.idGenerator.GenerateId(), Name = "Paracetamol " + i, Manufacturer = "Bayer " + i, Description = "Paracetamol", ExpirationDate = DateTime.Now, ManufacturingDate = new DateTime(2020, 1, 1), Price = 1.99, Quantity = new Random().Next(0, 500) }); 
            }
        }

        public Task<MedicineModel> AddMedicine(MedicineModel medicine)
        {
            this._medicines.Add(medicine);
            return Task.FromResult(medicine);
        }

        public async Task<IEnumerable<MedicineModel>> GetFilteredMedicines(MedicineRequest request)
        {
            return await OrderDescending(
                await ApplyFilters(
                    request
                ));
        }

        public Task<int> GetFilteredMedicinesCount(MedicineRequest request)
        {
            return GetCount(request);
        }

        private async Task<IEnumerable<MedicineModel>> OrderDescending(IEnumerable<MedicineModel> medicines)
        {
            await logger.Log(this.loggerContext, "Ordering medicines by expiration date");
            return medicines.OrderByDescending(x => x.ExpirationDate);
        }

        private async Task<IEnumerable<MedicineModel>> ApplyFilters(MedicineRequest request)
        {
            var filteredMedicines = _medicines.AsEnumerable();
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
                await logger.Log(this.loggerContext, "Filtering by Available Only");
                filteredMedicines = filteredMedicines.Where(x => x.Quantity > 0);
            }
            return filteredMedicines;
        }

        private async Task<IEnumerable<MedicineModel>> FilterByNotExpired(MedicineRequest request, IEnumerable<MedicineModel> filteredMedicines)
        {
            if (request.NotExpired)
            {
                await logger.Log(this.loggerContext, "Filtering by Not Expired");
                filteredMedicines = filteredMedicines.Where(x => x.ExpirationDate > DateTime.Now);
            }
            return filteredMedicines;
        }

        private async Task<IEnumerable<MedicineModel>> FilterByManufacturer(MedicineRequest request, IEnumerable<MedicineModel> filteredMedicines)
        {
            if (request.Manufacturer != null && request.Manufacturer.Length != 0)
            {
                await logger.Log(this.loggerContext, $"Filtering by Manufacturer containing {request.Manufacturer}");
                filteredMedicines = filteredMedicines.Where(x => x.Manufacturer.ToLower().Contains(request.Manufacturer.ToLower()));
            }
            return filteredMedicines;
        }

        private async Task<int> GetCount(MedicineRequest request)
        {
            var result = await OrderDescending(await ApplyFilters(request));
            return result.Count();
        }
    }
}
