using PharmacyManager.API.Interfaces.Base;

namespace PharmacyManager.API.Services.Base
{
    public class ApplicationConfiguration : IApplicationConfiguration
    {
        public ApplicationConfiguration(
            bool EnableSwagger
            )
        {
            this.EnableSwagger = EnableSwagger;
        }
        public bool EnableSwagger { get; private set; }
    }
}