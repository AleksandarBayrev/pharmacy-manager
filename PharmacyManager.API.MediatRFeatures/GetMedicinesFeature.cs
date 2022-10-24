using MediatR;
using PharmacyManager.API.Interfaces.Base;
using PharmacyManager.API.Interfaces.Medicines;
using PharmacyManager.API.Models;
using PharmacyManager.API.Models.APIResponses;
using System.Text.Json;

namespace PharmacyManager.API.MediatRFeatures
{
    public class GetMedicinesFeature
    {
        public class GetMedicinesQuery : IRequest<MedicinesResponse>
        {
            public bool AvailableOnly { get; init; }
            public bool NotExpired { get; init; }
            public string Manufacturer { get; init; }
            public int Page { get; init; }
            public int ItemsPerPage { get; init; }
        }
        public class GetMedicinesQueryHandler : IRequestHandler<GetMedicinesQuery, MedicinesResponse>
        {
            private readonly ILogger logger;
            private readonly IMedicinesProvider<MedicineRequest, MedicineModel> medicinesProvider;
            private readonly IPageCalculation<PageCalculations> pageCalculation;
            private readonly string loggerContext = nameof(GetMedicinesFeature);

            public GetMedicinesQueryHandler(
                ILogger logger,
                IMedicinesProvider<MedicineRequest, MedicineModel> medicinesProvider,
                IPageCalculation<PageCalculations> pageCalculation)
            {
                this.logger = logger;
                this.medicinesProvider = medicinesProvider;
                this.pageCalculation = pageCalculation;
            }
            public async Task<MedicinesResponse> Handle(GetMedicinesQuery request, CancellationToken cancellationToken)
            {
                await logger.Log(this.loggerContext, $"Requesting medicines for query: {JsonSerializer.Serialize(request)}", cancellationToken);
                var filteredMedicines = await this.medicinesProvider.GetFilteredMedicines(new MedicineRequest
                {
                    AvailableOnly = request.AvailableOnly,
                    ItemsPerPage = request.ItemsPerPage,
                    Manufacturer = request.Manufacturer,
                    NotExpired = request.NotExpired,
                    Page = request.Page
                });

                return new MedicinesResponse
                {
                    Medicines = await GetPageItems(filteredMedicines, request, cancellationToken),
                    Pages = await CalculatePages(request, filteredMedicines, cancellationToken)
                };
            }

            private async Task<decimal> CalculatePages(GetMedicinesQuery request, IEnumerable<MedicineModel> filteredMedicines, CancellationToken cancellationToken)
            {
                var medicinesCount = filteredMedicines.Count();
                var itemsPerPage = request.ItemsPerPage;
                var pageCalculations = await pageCalculation.GetPageCalculations(itemsPerPage, medicinesCount);
                return pageCalculations.Pages;
            }

            private async Task<IEnumerable<MedicineModel>> GetPageItems(IEnumerable<MedicineModel> medicines, GetMedicinesQuery request, CancellationToken cancellationToken)
            {
                await logger.Log(this.loggerContext, $"Getting page {request.Page}, items per page {request.ItemsPerPage}", cancellationToken);
                return medicines.Skip(request.ItemsPerPage * (request.Page - 1)).Take(request.ItemsPerPage);
            }
        }
    }
}