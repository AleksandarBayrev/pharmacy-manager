using PharmacyManager.API.Interfaces.Base;
using PharmacyManager.API.Models;

namespace PharmacyManager.API.Services.Base
{
    public class PageCalculation : IPageCalculation<PageCalculations>
    {
        private ILogger logger;
        private readonly string loggerContext = nameof(PageCalculation);

        public PageCalculation(ILogger logger)
        {
            this.logger = logger;
        }

        public async Task<PageCalculations> GetPageCalculations(int pageSize, int itemsCount)
        {
            var calculation = (decimal)(itemsCount) / (decimal)(pageSize);
            var roundedCalculation = itemsCount > pageSize ? Math.Ceiling(calculation) : 1;
            await logger.Log(this.loggerContext, $"Calculation for items count = {itemsCount} and items per page = {pageSize} = {calculation}, rounded calculation = {roundedCalculation}", LogLevel.Info);
            return new PageCalculations
            {
                Pages = roundedCalculation,
                ItemsPerPage = pageSize
            };
        }
    }
}
