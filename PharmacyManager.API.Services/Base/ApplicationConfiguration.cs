using PharmacyManager.API.Interfaces.Base;

namespace PharmacyManager.API.Services.Base
{
    public class ApplicationConfiguration : IApplicationConfiguration
    {
        public ApplicationConfiguration(
            bool EnableSwagger,
            bool UseMocks,
            string RelativeHtmlPath
            )
        {
            this.EnableSwagger = EnableSwagger;
            this.UseMocks = UseMocks;
            this.RelativeHtmlPath = RelativeHtmlPath;
        }
        public bool EnableSwagger { get; private set; }
        public bool UseMocks { get; private set; }
        public string RelativeHtmlPath { get; private set; }
    }
}