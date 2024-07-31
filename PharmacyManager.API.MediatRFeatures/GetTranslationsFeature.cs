using MediatR;
using PharmacyManager.API.Interfaces.Base;
using PharmacyManager.API.Models.APIResponses;

namespace PharmacyManager.API.MediatRFeatures
{
    public class GetTranslationsFeature
    {
        public class GetTranslationsFeatureQuery : IRequest<TranslationsResponse> { }

        public class GeGetTranslationsFeatureQueryHandler : IRequestHandler<GetTranslationsFeatureQuery, TranslationsResponse>
        {
            private readonly IApplicationConfiguration applicationConfiguration;
            private readonly ILogger logger;
            private readonly ITranslationManager translationManager;
            private readonly string loggerContext = nameof(GeGetTranslationsFeatureQueryHandler);

            public GeGetTranslationsFeatureQueryHandler(
                IApplicationConfiguration applicationConfiguration,
                ILogger logger,
                ITranslationManager translationManager)
            {
                this.applicationConfiguration = applicationConfiguration;
                this.logger = logger;
                this.translationManager = translationManager;
            }

            private bool ValidateTranslations()
            {
                return this.applicationConfiguration.DictionaryValidationKeys.All(x => this.translationManager.EN.ContainsKey(x) && this.translationManager.BG.ContainsKey(x));
            }

            public async Task<TranslationsResponse> Handle(GetTranslationsFeatureQuery request, CancellationToken cancellationToken)
            {
                await this.logger.Log(loggerContext, "Getting translations", LogLevel.Information);
                if (!ValidateTranslations())
                {
                    throw new KeyNotFoundException("Not all keys are present in the dictionaries");
                }
                return new TranslationsResponse
                {
                    BG = this.translationManager.BG,
                    EN = this.translationManager.EN
                };
            }
        }
    }
}
