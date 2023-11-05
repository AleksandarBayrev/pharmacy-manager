using MediatR;
using PharmacyManager.API.Interfaces.Medicines;
using PharmacyManager.API.Models;
using PharmacyManager.API.Models.APIResponses;

namespace PharmacyManager.API.MediatRFeatures
{
	public class DeleteMedicineFeature
	{
		public class DeleteMedicineFeatureQuery : IRequest<DeleteMedicineResponse>
		{
			public string MedicineId { get; set; }
		}

		public class DeleteMedicineFeatureQueryHandler : IRequestHandler<DeleteMedicineFeatureQuery, DeleteMedicineResponse>
		{
			private readonly IMedicinesProvider<MedicineRequest, string, MedicineModel> medicinesProvider;

			public DeleteMedicineFeatureQueryHandler(IMedicinesProvider<MedicineRequest, string, MedicineModel> medicinesProvider)
			{
				this.medicinesProvider = medicinesProvider;
			}

			public async Task<DeleteMedicineResponse> Handle(DeleteMedicineFeatureQuery request, CancellationToken cancellationToken)
			{
				return new DeleteMedicineResponse
				{
					MedicineId = request.MedicineId,
					Deleted = await this.medicinesProvider.RemoveMedicine(request.MedicineId)
				};
			}
		}
	}
}
