namespace PharmacyManager.API.Interfaces.Base
{
    public interface IApplicationConfiguration
    {
        public bool EnableSwagger { get; }
        public bool UseMocks { get; }
    }
}