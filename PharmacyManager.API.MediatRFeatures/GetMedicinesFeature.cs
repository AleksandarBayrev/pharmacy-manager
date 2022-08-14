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
        public class Query : IRequest<MedicinesResponse>
        {
            public bool AvailableOnly { get; init; }
            public bool NotExpired { get; init; }
            public string Manufacturer { get; init; }
            public int Page { get; init; }
            public int ItemsPerPage { get; init; }
        }
        public class QueryHandler : IRequestHandler<Query, MedicinesResponse>
        {
            private readonly ILogger logger;
            private readonly IMedicinesProvider<MedicineModel> medicinesProvider;
            private readonly string loggerContext = nameof(GetMedicinesFeature);

            public QueryHandler(
                ILogger logger,
                IMedicinesProvider<MedicineModel> medicinesProvider)
            {
                this.logger = logger;
                this.medicinesProvider = medicinesProvider;
            }
            public async Task<MedicinesResponse> Handle(Query request, CancellationToken cancellationToken)
            {
                await logger.Log(this.loggerContext, $"Requesting medicines for query: {JsonSerializer.Serialize(request)}");
                var filteredMedicines = await OrderDescending(
                await ApplyFilters(
                    this.medicinesProvider.Medicines,
                    request
                ));

                return new MedicinesResponse
                {
                    Medicines = await GetPageItems(filteredMedicines, request),
                    Pages = await CalculatePages(request, filteredMedicines)
                };
            }

            private async Task<decimal> CalculatePages(Query request, IEnumerable<MedicineModel> filteredMedicines)
            {
                var medicinesCount = filteredMedicines.Count();
                var itemsPerPage = request.ItemsPerPage;
                var calculation = (decimal)(medicinesCount) / (decimal)(itemsPerPage);
                var roundedCalculation = medicinesCount > itemsPerPage ? Math.Ceiling(calculation) : 1;
                await logger.Log(this.loggerContext, $"Calculation for medicines count = {medicinesCount} and items per page = {itemsPerPage} = {calculation}, rounded calculation = {roundedCalculation}");
                return roundedCalculation;
            }

            private async Task<IEnumerable<MedicineModel>> GetPageItems(IEnumerable<MedicineModel> medicines, Query request)
            {
                await logger.Log(this.loggerContext, $"Getting page {request.Page}, items per page {request.ItemsPerPage}");
                return medicines.Skip(request.ItemsPerPage * (request.Page - 1)).Take(request.ItemsPerPage);
            }

            private async Task<IEnumerable<MedicineModel>> OrderDescending(IEnumerable<MedicineModel> medicines)
            {
                await logger.Log(this.loggerContext, "Ordering medicines by expiration date");
                return medicines.OrderByDescending(x => x.ExpirationDate);
            }

            private async Task<IEnumerable<MedicineModel>> ApplyFilters(IEnumerable<MedicineModel> medicines, Query request)
            {
                var filteredMedicines = medicines.AsEnumerable();
                if (request.AvailableOnly)
                {
                    await logger.Log(this.loggerContext, "Filtering by Available Only");
                    filteredMedicines = filteredMedicines.Where(x => x.Quantity > 0);
                }
                if (request.NotExpired)
                {
                    await logger.Log(this.loggerContext, "Filtering by Not Expired");
                    filteredMedicines = filteredMedicines.Where(x => x.ExpirationDate > DateTime.Now);
                }
                if (request.Manufacturer != null && request.Manufacturer.Length != 0)
                {
                    await logger.Log(this.loggerContext, $"Filtering by Manufacturer containing {request.Manufacturer}");
                    filteredMedicines = filteredMedicines.Where(x => x.Manufacturer.ToLower().Contains(request.Manufacturer.ToLower()));
                }
                return filteredMedicines;
            }
        }
    }
}