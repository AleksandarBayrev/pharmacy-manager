using MediatR;
using PharmacyManager.API.Interfaces.Medicines;
using PharmacyManager.API.Models;

namespace PharmacyManager.API.MediatRFeatures
{
    public class AddMedicineFeature
    {
        public class AddMedicineFeatureQuery : IRequest<MedicineModel>
        {
            public string Name { get; set; }
            public string Manufacturer { get; set; }
            public string Description { get; set; }
        }

        public class AddMedicineFeatureQueryHandler : IRequestHandler<AddMedicineFeatureQuery, MedicineModel>
        {
            private readonly IMedicinesProvider<MedicineRequest, MedicineModel> medicinesProvider;

            public AddMedicineFeatureQueryHandler(IMedicinesProvider<MedicineRequest, MedicineModel> medicinesProvider)
            {
                this.medicinesProvider = medicinesProvider;
            }

            public async Task<MedicineModel> Handle(AddMedicineFeatureQuery request, CancellationToken cancellationToken)
            {
                var medicine = new MedicineModel
                {
                    Name = request.Name,
                    Manufacturer = request.Manufacturer,
                    Description = request.Description
                };
                await this.medicinesProvider.AddMedicine(medicine);
                return medicine;
            }
        }
    }
}
