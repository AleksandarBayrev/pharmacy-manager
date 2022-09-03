namespace PharmacyManager.API.Interfaces.Base
{
    public interface IPageCalculation<TPageCalculations>
    {
        Task<TPageCalculations> GetPageCalculations(int pageSize, int itemsCount);
    }
}
