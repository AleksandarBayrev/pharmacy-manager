using PharmacyManager.API.Interfaces.Base;
using System.Collections.Concurrent;
using System.Text.Json;

namespace PharmacyManager.API.Services.Base
{
    public class TranslationManager : ITranslationManager
    {
        private readonly IApplicationConfiguration applicationConfiguration;

        public TranslationManager(IApplicationConfiguration applicationConfiguration)
        {
            this.applicationConfiguration = applicationConfiguration;
            this.BG = new ConcurrentDictionary<string, string>();
            this.EN = new ConcurrentDictionary<string, string>();
        }

        public async Task LoadDictionaries()
        {
            var bulgarianDictionary = await LoadBulgarianDictionary();
            var englishDictionary = await LoadEnglishDictionary();

            MapToDictionary(bulgarianDictionary, BG);
            MapToDictionary(englishDictionary, EN);
        }

        public IDictionary<string, string> BG { get; }

        public IDictionary<string, string> EN { get; }

        private void MapToDictionary(IDictionary<string, string> baseDictionary, IDictionary<string, string> targetDictionary)
        {
            foreach (var (key, value) in baseDictionary)
            {
                targetDictionary.TryAdd(key, value);
            }
        }

        private async Task<IDictionary<string, string>> LoadBulgarianDictionary()
        {
            var bulgarianDictionaryFilePath = this.applicationConfiguration.Dictionaries.First(x => x.Contains("Bulgarian.json"));
            var bulgarianDictionaryContent = await File.ReadAllTextAsync(bulgarianDictionaryFilePath);
            return JsonSerializer.Deserialize<ConcurrentDictionary<string, string>>(bulgarianDictionaryContent);
        }
        private async Task<IDictionary<string, string>> LoadEnglishDictionary()
        {
            var englishDictionaryFilePath = this.applicationConfiguration.Dictionaries.First(x => x.Contains("English.json"));
            var englishDictionaryContent = await File.ReadAllTextAsync(englishDictionaryFilePath);
            return JsonSerializer.Deserialize<ConcurrentDictionary<string, string>>(englishDictionaryContent);
        }
    }
}
