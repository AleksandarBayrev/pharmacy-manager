using PharmacyManager.API.Interfaces.Base;

namespace PharmacyManager.API.Services.Base
{
    public class ApplicationConfiguration : IApplicationConfiguration
    {
        public ApplicationConfiguration(
            bool EnableSwagger,
            IMocksConfiguration Mocks,
            string MinLogLevel,
            string RelativeHtmlPath,
            IEnumerable<string> Dictionaries,
            IEnumerable<string> DictionaryValidationKeys,
            IDatabaseConfiguration DatabaseConfiguration,
            string PreferredDateFormatForRecords
			)
        {
            this.EnableSwagger = EnableSwagger;
            this.Mocks = Mocks;
            this.MinLogLevel = MinLogLevel;
            this.RelativeHtmlPath = RelativeHtmlPath;
            this.Dictionaries = Dictionaries;
            this.DictionaryValidationKeys = DictionaryValidationKeys;
			this.DatabaseConfiguration = DatabaseConfiguration;
            this.PreferredDateFormatForRecords = PreferredDateFormatForRecords;
        }
        public bool EnableSwagger { get; private set; }
        public IMocksConfiguration Mocks{ get; private set; }
		public string MinLogLevel { get; private set; }
		public string RelativeHtmlPath { get; private set; }
        public IEnumerable<string> Dictionaries { get; private set; }
        public IEnumerable<string> DictionaryValidationKeys { get; private set; }
		public IDatabaseConfiguration DatabaseConfiguration { get; private set; }
		public string PreferredDateFormatForRecords { get; private set; }
	}
}