using MediatR;
using PharmacyManager.API.Interfaces.Base;
using PharmacyManager.API.Interfaces.Medicines;
using PharmacyManager.API.Models;

namespace PharmacyManager.API.MediatRFeatures
{
    public class GetPageCalculations
    {
        public class GetPageCalculationsQuery : IRequest<PageCalculations>
        {
            public bool AvailableOnly { get; init; }
            public bool NotExpired { get; init; }
            public string Manufacturer { get; init; }
            public int Page { get; init; }
            public int ItemsPerPage { get; init; }
        }

        public class GetPageCalculationsQueryHandler : IRequestHandler<GetPageCalculationsQuery, PageCalculations>
        {
            private readonly ILogger logger;
            private readonly IMedicinesProvider<MedicineRequest, string, MedicineModel> medicinesProvider;
            private readonly IPageCalculation<PageCalculations> pageCalculation;

            public GetPageCalculationsQueryHandler(
                ILogger logger,
                IMedicinesProvider<MedicineRequest, string, MedicineModel> medicinesProvider,
                IPageCalculation<PageCalculations> pageCalculation)
            {
                this.logger = logger;
                this.medicinesProvider = medicinesProvider;
                this.pageCalculation = pageCalculation;
            }
            public async Task<PageCalculations> Handle(GetPageCalculationsQuery request, CancellationToken cancellationToken)
            {
                var medicines = await this.medicinesProvider.GetFilteredMedicines(new MedicineRequest
                {
                    AvailableOnly = request.AvailableOnly,
                    ItemsPerPage = request.ItemsPerPage,
                    Manufacturer = request.Manufacturer,
                    NotExpired = request.NotExpired,
                    Page = request.Page
                });
                var itemsPerPage = request.ItemsPerPage;
                var pageCalculations = await pageCalculation.GetPageCalculations(itemsPerPage, medicines.Count());
                return pageCalculations;
            }
        }
    }
}
