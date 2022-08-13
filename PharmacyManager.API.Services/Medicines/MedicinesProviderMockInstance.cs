using PharmacyManager.API.Interfaces.Medicines;
using PharmacyManager.API.Models;

namespace PharmacyManager.API.Services.Medicines
{
    public class MedicinesProviderMockInstance : IMedicinesProvider<MedicineModel>
    {
        private IEnumerable<MedicineModel> _medicines;

        public MedicinesProviderMockInstance()
        {
            this._medicines = new List<MedicineModel>
            {
                new MedicineModel
                {
                    Id = 1,
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
                    Id = 1,
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
                    Id = 2,
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
                    Id = 3,
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
                (this._medicines as IList<MedicineModel>).Add(new MedicineModel { Id = i + 100, Name = "Paracetamol " + i, Manufacturer = "Bayer " + i, Description = "Paracetamol", ExpirationDate = DateTime.Now, ManufacturingDate = new DateTime(2020, 1, 1), Price = 1.99, Quantity = new Random().Next(0, 500) }); 
            }
        }
        public IEnumerable<MedicineModel> Medicines => _medicines;
    }
}
