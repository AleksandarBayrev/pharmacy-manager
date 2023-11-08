using MediatR;
using PharmacyManager.API.Interfaces.Base;
using PharmacyManager.API.Interfaces.Medicines;
using PharmacyManager.API.Models;

namespace PharmacyManager.API.MediatRFeatures
{
	public class UpdateMedicineFeature
	{
		public class UpdateMedicineFeatureQuery : IRequest<MedicineFrontendModel>
		{
			public string Id { get; set; }
			public string Name { get; set; }
			public string Manufacturer { get; set; }
			public string Description { get; set; }
			public DateTime ManufacturingDate { get; set; }
			public DateTime ExpirationDate { get; set; }
			public string Price { get; set; }
			public int Quantity { get; set; }
		}

		public class UpdateMedicineFeatureQueryHandler : IRequestHandler<UpdateMedicineFeatureQuery, MedicineFrontendModel>
		{
			private readonly IMedicinesProvider<MedicineRequest, string, MedicineModel> medicinesProvider;
			private readonly IIdGenerator idGenerator;
			private readonly IPriceParser priceParser;

			public UpdateMedicineFeatureQueryHandler(
				IMedicinesProvider<MedicineRequest, string, MedicineModel> medicinesProvider,
				IPriceParser priceParser)
			{
				this.medicinesProvider = medicinesProvider;
				this.idGenerator = idGenerator;
				this.priceParser = priceParser;
			}

			public async Task<MedicineFrontendModel> Handle(UpdateMedicineFeatureQuery request, CancellationToken cancellationToken)
			{
				var medicine = new MedicineModel
				{
					Id = request.Id,
					Name = request.Name,
					Manufacturer = request.Manufacturer,
					Description = request.Description,
					ManufacturingDate = request.ManufacturingDate,
					ExpirationDate = request.ExpirationDate,
					Price = await this.priceParser.Parse(request.Price),
					Quantity = request.Quantity
				};
				var updateResult = await this.medicinesProvider.UpdateMedicine(medicine);
				if (!updateResult)
				{
					return null;
				}
				var updatedMedicine = await this.medicinesProvider.GetMedicineById(request.Id);
				return new MedicineFrontendModel()
				{
					Id = updatedMedicine.Id,
					Name = updatedMedicine.Name,
					Manufacturer = updatedMedicine.Manufacturer,
					Description = updatedMedicine.Description,
					ManufacturingDate = updatedMedicine.ManufacturingDate,
					ExpirationDate= updatedMedicine.ExpirationDate,
					Price = await this.priceParser.Parse(updatedMedicine.Price),
					Quantity = updatedMedicine.Quantity
				};
			}
		}
	}
}
