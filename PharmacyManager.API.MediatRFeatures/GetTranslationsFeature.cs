using MediatR;
using PharmacyManager.API.Interfaces.Base;
using PharmacyManager.API.Models.APIResponses;
using System.Collections.Concurrent;

namespace PharmacyManager.API.MediatRFeatures
{
    public class GetTranslationsFeature
    {
        public class GetTranslationsFeatureQuery : IRequest<TranslationsResponse> { }

        public class GeGetTranslationsFeatureQueryHandler : IRequestHandler<GetTranslationsFeatureQuery, TranslationsResponse>
        {
            private readonly ILogger logger;
            private readonly string loggerContext = nameof(GeGetTranslationsFeatureQueryHandler);
            private readonly IDictionary<string, string> bg;
            private readonly IDictionary<string, string> en;
            private static readonly IList<string> keys = BuildKeys();

            public GeGetTranslationsFeatureQueryHandler(ILogger logger)
            {
                this.logger = logger;
                this.bg = GetBulgarianTranslations();
                this.en = GetEnglishTranslations();
            }

            private static IList<string> BuildKeys()
            {
                var keys = new List<string>();
                keys.Add("LOADING_TEXT");
                return keys;
            }

            private IDictionary<string, string> GetBulgarianTranslations()
            {
                var dictionary = new ConcurrentDictionary<string, string>();
                dictionary.TryAdd("LOADING_TEXT", "Зареждам, моля изчакайте...");
                return dictionary;
            }

            private IDictionary<string, string> GetEnglishTranslations()
            {
                var dictionary = new ConcurrentDictionary<string, string>();
                dictionary.TryAdd("LOADING_TEXT", "Loading application, please wait...");
                return dictionary;
            }

            public async Task<TranslationsResponse> Handle(GetTranslationsFeatureQuery request, CancellationToken cancellationToken)
            {
                await this.logger.Log(loggerContext, "Getting translations");
                return new TranslationsResponse
                {
                    BG = bg,
                    EN = en
                };
            }
        }
    }
}
