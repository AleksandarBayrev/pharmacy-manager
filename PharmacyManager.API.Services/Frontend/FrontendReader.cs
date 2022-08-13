using PharmacyManager.API.Interfaces.Base;
using PharmacyManager.API.Interfaces.Frontend;
using System.Collections.Concurrent;

namespace PharmacyManager.API.Services.Frontend
{
    public class FrontendReader : IFrontendReader
    {
        private readonly ILogger logger;
        private readonly string loggerContext = nameof(FrontendReader);
        private IDictionary<string, string> htmlCache;

        public FrontendReader(ILogger logger)
        {
            this.logger = logger;
            this.htmlCache = new ConcurrentDictionary<string, string>();
        }

        public async Task<string> ReadHTML(string path)
        {
            await logger.Log(this.loggerContext, $"Reading path {path}");
            if (this.htmlCache.ContainsKey(path))
            {
                await logger.Log(this.loggerContext, $"Path {path} found in cache, returning content");
                return this.htmlCache[path];
            }
            var content = File.ReadAllText(path);
            this.htmlCache.TryAdd(path, content);
            return this.htmlCache[path];
        }

        public async Task<bool> ReloadHTML(string path)
        {
            await logger.Log(this.loggerContext, $"Reloading path {path}");
            if (this.htmlCache.ContainsKey(path))
            {
                var content = File.ReadAllText(path);
                this.htmlCache[path] = content;
            }
            return this.htmlCache.ContainsKey(path);
        }
    }
}
