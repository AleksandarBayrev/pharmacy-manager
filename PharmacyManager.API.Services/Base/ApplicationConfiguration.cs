using PharmacyManager.API.Interfaces.Base;

namespace PharmacyManager.API.Services.Base
{
    public class ApplicationConfiguration : IApplicationConfiguration
    {
        public ApplicationConfiguration(
            bool EnableSwagger,
            bool UseMocks
            )
        {
            this.EnableSwagger = EnableSwagger;
            this.UseMocks = UseMocks;
        }
        public bool EnableSwagger { get; private set; }
        public bool UseMocks { get; private set; }
    }
}