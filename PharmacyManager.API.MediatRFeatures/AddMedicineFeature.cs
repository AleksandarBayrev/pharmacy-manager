using MediatR;
using PharmacyManager.API.Interfaces.Base;
using PharmacyManager.API.Interfaces.Medicines;
using PharmacyManager.API.Models;
using System.Globalization;

namespace PharmacyManager.API.MediatRFeatures
{
    public class AddMedicineFeature
    {
        public class AddMedicineFeatureQuery : IRequest<MedicineModel>
        {
            public string Name { get; set; }
            public string Manufacturer { get; set; }
            public string Description { get; set; }
            public DateTime ManufacturingDate { get; set; }
            public DateTime ExpirationDate { get; set; }
            public string Price { get; set; }
            public int Quantity { get; set; }
        }

        public class AddMedicineFeatureQueryHandler : IRequestHandler<AddMedicineFeatureQuery, MedicineModel>
        {
            private readonly IMedicinesProvider<MedicineRequest, string, MedicineModel> medicinesProvider;
            private readonly IIdGenerator idGenerator;
            private readonly IPriceParser priceParser;

            public AddMedicineFeatureQueryHandler(
                IMedicinesProvider<MedicineRequest, string, MedicineModel> medicinesProvider,
                IIdGenerator idGenerator,
                IPriceParser priceParser)
            {
                this.medicinesProvider = medicinesProvider;
                this.idGenerator = idGenerator;
                this.priceParser = priceParser;
            }

            public async Task<MedicineModel> Handle(AddMedicineFeatureQuery request, CancellationToken cancellationToken)
            {
                var medicine = new MedicineModel
                {
                    Id = this.idGenerator.GenerateId(),
                    Name = request.Name,
                    Manufacturer = request.Manufacturer,
                    Description = request.Description,
                    ManufacturingDate = request.ManufacturingDate,
                    ExpirationDate = request.ExpirationDate,
                    Price = await this.priceParser.Parse(request.Price),
                    Quantity = request.Quantity
                };
                await this.medicinesProvider.AddMedicine(medicine);
                return medicine;
            }
        }
    }
}
