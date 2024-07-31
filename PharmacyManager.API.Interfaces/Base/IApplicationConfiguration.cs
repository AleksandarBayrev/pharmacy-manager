namespace PharmacyManager.API.Interfaces.Base
{
    public interface IApplicationConfiguration
    {
        public bool EnableSwagger { get; }
        public IMocksConfiguration Mocks { get; }
        public IDatabaseConfiguration DatabaseConfiguration { get; }
        public string MinLogLevel { get; }
        public string RelativeHtmlPath { get; }
        public IEnumerable<string> Dictionaries { get; }
        public IEnumerable<string> DictionaryValidationKeys { get; }
        public string PreferredDateFormatForRecords { get; }
    }
}