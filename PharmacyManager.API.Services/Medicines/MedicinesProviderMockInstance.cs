using PharmacyManager.API.Interfaces.Base;
using PharmacyManager.API.Interfaces.Medicines;
using PharmacyManager.API.Models;

namespace PharmacyManager.API.Services.Medicines
{
    public class MedicinesProviderMockInstance : IMedicinesProvider<MedicineRequest, MedicineModel>
    {
        private readonly ILogger logger;
        private readonly IIdGenerator idGenerator;
        private readonly IMedicinesFilter<MedicineRequest, MedicineModel> medicinesFilter;
        private IList<MedicineModel> _medicines;
        private readonly string loggerContext = nameof(MedicinesProviderMockInstance);

        public MedicinesProviderMockInstance(
            ILogger logger,
            IIdGenerator idGenerator,
            IMedicinesFilter<MedicineRequest, MedicineModel> medicinesFilter)
        {
            this.logger = logger;
            this.idGenerator = idGenerator;
            this.medicinesFilter = medicinesFilter;
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
                    Price = 2.5m,
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
                    Price = 2.5m,
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
                    Price = 2.99m,
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
                    Price = 2.99m,
                    Quantity = 0
                }
            };

            for (var i = 0; i < 100000; i++)
            {
                this._medicines.Add(new MedicineModel { Id = this.idGenerator.GenerateId(), Name = "Paracetamol " + i, Manufacturer = "Bayer " + i, Description = "Paracetamol", ExpirationDate = DateTime.Now, ManufacturingDate = new DateTime(2020, 1, 1), Price = 1.99m, Quantity = new Random().Next(0, 500) }); 
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
                await this.medicinesFilter.ApplyFilters(
                    request,
                    this._medicines
                ));
        }

        public Task<int> GetFilteredMedicinesCount(MedicineRequest request)
        {
            return GetCount(request);
        }

        private async Task<IEnumerable<MedicineModel>> OrderDescending(IEnumerable<MedicineModel> medicines)
        {
            await logger.Log(this.loggerContext, "Ordering medicines by expiration date", LogLevel.Info);
            return medicines.OrderByDescending(x => x.ExpirationDate);
        }

        private async Task<int> GetCount(MedicineRequest request)
        {
            var result = await OrderDescending(await this.medicinesFilter.ApplyFilters(request, this._medicines));
            return result.Count();
        }
    }
}
