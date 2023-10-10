namespace PharmacyManager.API.Interfaces.Base
{
    public interface IApplicationConfiguration
    {
        public bool EnableSwagger { get; }
        public IMocksConfiguration Mocks { get; }
        public bool LogErrorsOnly { get; }
        public string RelativeHtmlPath { get; }
        public IEnumerable<string> Dictionaries { get; }
        public IEnumerable<string> DictionaryValidationKeys { get; }
    }
}