using PharmacyManager.API.Interfaces.Base;
using PharmacyManager.API.Interfaces.Medicines;
using PharmacyManager.API.Models;
using PharmacyManager.API.Extensions;

namespace PharmacyManager.API.Services.Medicines
{
    public class MedicinesFilter : IMedicinesFilter<MedicineRequest, MedicineModel>
    {
        private readonly string loggerContext = nameof(MedicinesFilter);
        private readonly ILogger logger;

        public MedicinesFilter(ILogger logger)
        {
            this.logger = logger;
        }

        public Task<IEnumerable<MedicineModel>> ApplyFilters(MedicineRequest request, IEnumerable<MedicineModel> medicines)
		{
			return Task.FromResult(medicines
                .WhereWhen(x =>
				{
					return x.Quantity > 0;
                }, request.AvailableOnly,
                () => logger.Log(this.loggerContext, "Filtering by Available Only", LogLevel.Info, new CancellationToken()))
                .WhereWhen(x =>
				{
					return x.ExpirationDate > DateTime.Now;
                },
                request.NotExpired,
                () => logger.Log(this.loggerContext, "Filtering by Not Expired", LogLevel.Info, new CancellationToken()))
                .WhereWhen(x =>
				{
					return x.Manufacturer.ToLower().Contains(request.Manufacturer.ToLower());
                },
                request.Manufacturer != null && request.Manufacturer.Length != 0,
                () => logger.Log(this.loggerContext, "Filtering by Manufacturer Name", LogLevel.Info, new CancellationToken())));
        }
    }
}
