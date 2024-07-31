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
        public async Task ReloadDictionaries()
        {
            this.BG.Clear();
            this.EN.Clear();
            await this.LoadDictionaries();
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
            using var bulgarianDictionaryContent = File.OpenRead(bulgarianDictionaryFilePath);
            if (bulgarianDictionaryContent == null)
            {
                throw new Exception($"Failed reading english dictionary for path = {bulgarianDictionaryFilePath}");
            }
            return await JsonSerializer.DeserializeAsync<ConcurrentDictionary<string, string>>(bulgarianDictionaryContent) ?? new ConcurrentDictionary<string, string>();
        }
        private async Task<IDictionary<string, string>> LoadEnglishDictionary()
        {
            var englishDictionaryFilePath = this.applicationConfiguration.Dictionaries.First(x => x.Contains("English.json"));
            using var englishDictionaryContent = File.OpenRead(englishDictionaryFilePath);
            if (englishDictionaryContent == null)
            {
                throw new Exception($"Failed reading english dictionary for path = {englishDictionaryFilePath}");
            }
            return await JsonSerializer.DeserializeAsync<ConcurrentDictionary<string, string>>(englishDictionaryContent) ?? new ConcurrentDictionary<string, string>();
        }
    }
}
