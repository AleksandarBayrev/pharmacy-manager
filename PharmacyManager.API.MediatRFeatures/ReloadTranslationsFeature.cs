using MediatR;
using PharmacyManager.API.Interfaces.Base;
using PharmacyManager.API.Models.APIResponses;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PharmacyManager.API.MediatRFeatures
{
    public class ReloadTranslationsFeature
    {
        public class ReloadTranslationsQuery : IRequest<TranslationsResponse> { }
        public class ReloadTranslationsQueryHandler : IRequestHandler<ReloadTranslationsQuery, TranslationsResponse>
        {
            private readonly ITranslationManager translationManager;

            public ReloadTranslationsQueryHandler(ITranslationManager translationManager)
            {
                this.translationManager = translationManager;
            }
            public async Task<TranslationsResponse> Handle(ReloadTranslationsQuery request, CancellationToken cancellationToken)
            {
                await this.translationManager.ReloadDictionaries();
                return new TranslationsResponse
                {
                    BG = this.translationManager.BG,
                    EN = this.translationManager.EN
                };
            }
        }
    }
}
