using MediatR;
using PharmacyManager.API.Interfaces.Base;
using PharmacyManager.API.Interfaces.Medicines;
using PharmacyManager.API.Models;
using System.Text.Json;

namespace PharmacyManager.API.MediatRFeatures
{
	public class GetMedicineFeature
	{
		public class GetMedicineFeatureQuery : IRequest<MedicineFrontendModel>
		{
			public string Id { get; set; }
		}
		public class GetMedicineFeatureQueryHandler : IRequestHandler<GetMedicineFeatureQuery, MedicineFrontendModel>
		{
			private readonly ILogger logger;
			private readonly IPriceParser priceParser;
			private readonly IMedicinesProvider<MedicineRequest, string, MedicineModel> medicinesProvider;
			private readonly string loggerContext = nameof(GetMedicinesFeature);

			public GetMedicineFeatureQueryHandler(
				ILogger logger,
				IPriceParser priceParser,
				IMedicinesProvider<MedicineRequest, string, MedicineModel> medicinesProvider)
			{
				this.logger = logger;
				this.priceParser = priceParser;
				this.medicinesProvider = medicinesProvider;
			}
			public async Task<MedicineFrontendModel> Handle(GetMedicineFeatureQuery request, CancellationToken cancellationToken)
			{
				await logger.Log(this.loggerContext, $"Requesting single medicine for query: {JsonSerializer.Serialize(request)}", LogLevel.Information, cancellationToken);
				var medicine = await this.medicinesProvider.GetMedicineById(request.Id);
				return new MedicineFrontendModel
				{
					Id = medicine.Id,
					Name = medicine.Name,
					Manufacturer = medicine.Manufacturer,
					ExpirationDate = medicine.ExpirationDate,
					ManufacturingDate = medicine.ManufacturingDate,
					Description = medicine.Description,
					Price = await this.priceParser.Parse(medicine.Price),
					Quantity = medicine.Quantity
				};
			}
		}
	}
}