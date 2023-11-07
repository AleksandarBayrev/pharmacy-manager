namespace PharmacyManager.API.Interfaces.Base
{
    public interface IPriceParser
    {
        Task<decimal> Parse(string priceAsString);
        Task<string> Parse(decimal priceAsDecimal);
	}
}
