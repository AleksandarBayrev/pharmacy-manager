using PharmacyManager.API.Interfaces.Base;

namespace PharmacyManager.API.Services.Base
{
    public class ApplicationConfiguration : IApplicationConfiguration
    {
        public ApplicationConfiguration(
            bool EnableSwagger,
            bool UseMocks,
            bool LogErrorsOnly,
            string RelativeHtmlPath,
            IEnumerable<string> Dictionaries,
            IEnumerable<string> DictionaryValidationKeys
            )
        {
            this.EnableSwagger = EnableSwagger;
            this.UseMocks = UseMocks;
            this.LogErrorsOnly = LogErrorsOnly;
            this.RelativeHtmlPath = RelativeHtmlPath;
            this.Dictionaries = Dictionaries;
            this.DictionaryValidationKeys = DictionaryValidationKeys;
        }
        public bool EnableSwagger { get; private set; }
        public bool UseMocks { get; private set; }
		public bool LogErrorsOnly { get; private set; }
		public string RelativeHtmlPath { get; private set; }
        public IEnumerable<string> Dictionaries { get; private set; }
        public IEnumerable<string> DictionaryValidationKeys { get; private set; }
	}
}