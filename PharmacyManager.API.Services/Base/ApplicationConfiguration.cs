using PharmacyManager.API.Interfaces.Base;

namespace PharmacyManager.API.Services.Base
{
    public class ApplicationConfiguration : IApplicationConfiguration
    {
        public ApplicationConfiguration(
            bool EnableSwagger,
            IMocksConfiguration Mocks,
            bool LogErrorsOnly,
            string RelativeHtmlPath,
            IEnumerable<string> Dictionaries,
            IEnumerable<string> DictionaryValidationKeys,
            IDatabaseConfiguration DatabaseConfiguration
            )
        {
            this.EnableSwagger = EnableSwagger;
            this.Mocks = Mocks;
            this.LogErrorsOnly = LogErrorsOnly;
            this.RelativeHtmlPath = RelativeHtmlPath;
            this.Dictionaries = Dictionaries;
            this.DictionaryValidationKeys = DictionaryValidationKeys;
			this.DatabaseConfiguration = DatabaseConfiguration;
        }
        public bool EnableSwagger { get; private set; }
        public IMocksConfiguration Mocks{ get; private set; }
		public bool LogErrorsOnly { get; private set; }
		public string RelativeHtmlPath { get; private set; }
        public IEnumerable<string> Dictionaries { get; private set; }
        public IEnumerable<string> DictionaryValidationKeys { get; private set; }
		public IDatabaseConfiguration DatabaseConfiguration { get; }
	}
}