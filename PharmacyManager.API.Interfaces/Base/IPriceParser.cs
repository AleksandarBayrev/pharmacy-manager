namespace PharmacyManager.API.Interfaces.Base
{
    public interface IPriceParser
    {
        decimal Parse(string priceAsString);
    }
}
