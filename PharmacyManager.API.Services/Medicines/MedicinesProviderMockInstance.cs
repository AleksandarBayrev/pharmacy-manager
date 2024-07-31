using PharmacyManager.API.Interfaces.Base;
using PharmacyManager.API.Interfaces.Medicines;
using PharmacyManager.API.Models;

namespace PharmacyManager.API.Services.Medicines
{
	public class MedicinesProviderMockInstance : IMedicinesProvider<MedicineRequest, string, MedicineModel>
    {
        private readonly ILogger logger;
        private readonly IIdGenerator idGenerator;
        private readonly IMedicinesFilter<MedicineRequest, MedicineModel> medicinesFilter;
		private readonly int generatedNumberOfPharmacies;
		private IList<MedicineModel> medicines;
        private readonly string loggerContext = nameof(MedicinesProviderMockInstance);

        public MedicinesProviderMockInstance(
            ILogger logger,
            IIdGenerator idGenerator,
            IMedicinesFilter<MedicineRequest, MedicineModel> medicinesFilter,
            int generatedNumberOfPharmacies)
        {
            this.logger = logger;
            this.idGenerator = idGenerator;
            this.medicinesFilter = medicinesFilter;
            this.generatedNumberOfPharmacies = generatedNumberOfPharmacies;
            this.medicines = new List<MedicineModel>
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

            for (var i = 0; i < generatedNumberOfPharmacies; i++)
            {
                this.medicines.Add(new MedicineModel
                {
                    Id = this.idGenerator.GenerateId(),
                    Description = $"Headmaster Generated {i + 1}",
					Name = $"Headmaster Generated {i + 1}",
                    Manufacturer = "Head",
                    ManufacturingDate = new DateTime(2020, 1, 1),
                    ExpirationDate = new DateTime(2100, 1, 1),
                    Price = 2.99m,
                    Quantity = 0
                });

            }
        }

        public Task<MedicineModel> AddMedicine(MedicineModel medicine)
        {
            this.medicines.Add(medicine);
            return Task.FromResult(medicine);
        }

        public async Task<IEnumerable<MedicineModel>> GetFilteredMedicines(MedicineRequest request)
        {
            return await OrderDescending(
                await this.medicinesFilter.ApplyFilters(
                    request,
                    this.medicines
                ));
        }

        private async Task<IEnumerable<MedicineModel>> OrderDescending(IEnumerable<MedicineModel> medicines)
        {
            await logger.Log(this.loggerContext, "Ordering medicines by expiration date", LogLevel.Information);
            return medicines.OrderByDescending(x => x.ExpirationDate);
        }

        private async Task<int> GetCount(MedicineRequest request)
        {
            var result = await OrderDescending(await this.medicinesFilter.ApplyFilters(request, this.medicines));
            return result.Count();
        }

		public Task<bool> RemoveMedicine(string medicineId)
		{
            var item = this.medicines.First(x => x.Id == medicineId);
            return Task.FromResult(this.medicines.Remove(item));
		}

		public Task<int> GetTotalCount()
		{
            return Task.FromResult(this.medicines.Count);
		}

		public Task<bool> UpdateMedicine(MedicineModel medicine)
		{
            var medicineInStore = this.medicines.First(x => x.Id == medicine.Id);
            medicineInStore.Name = medicine.Name;
            medicineInStore.Description = medicine.Description;
            medicineInStore.ExpirationDate = medicine.ExpirationDate;
            medicineInStore.ManufacturingDate = medicine.ManufacturingDate;
            medicineInStore.Price = medicine.Price;
            medicineInStore.Quantity = medicine.Quantity;
            return Task.FromResult(true);
		}

		public Task<MedicineModel> GetMedicineById(string medicineId)
		{
            var medicine = this.medicines.FirstOrDefault(x => x.Id == medicineId);
            if (medicine == null)
            {
				throw new KeyNotFoundException($"Medicine for id {medicineId} not found");
            }
            return Task.FromResult(medicine);
		}
	}
}
