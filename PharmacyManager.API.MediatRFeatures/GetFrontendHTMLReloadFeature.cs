using MediatR;
using PharmacyManager.API.Interfaces.Base;
using PharmacyManager.API.Interfaces.Frontend;

namespace PharmacyManager.API.MediatRFeatures
{
    public class GetFrontendHTMLReloadFeature
    {
        public class GetFrontendHTMLReloadFeatureQuery : IRequest<bool>
        {
            public string Path { get; init; }
        }

        public class GetFrontendHTMLReloadFeatureQueryHandler : IRequestHandler<GetFrontendHTMLReloadFeatureQuery, bool>
        {
            private readonly ILogger logger;
            private readonly string loggerContext = nameof(GetFrontendHTMLReloadFeature);
            private readonly IFrontendReader reader;

            public GetFrontendHTMLReloadFeatureQueryHandler(
                ILogger logger,
                IFrontendReader reader)
            {
                this.logger = logger;
                this.reader = reader;
            }
            public async Task<bool> Handle(GetFrontendHTMLReloadFeatureQuery request, CancellationToken cancellationToken)
            {
                await logger.Log(loggerContext, $"Reloading path {request.Path}", LogLevel.Information, cancellationToken);
                return await reader.ReloadHTML(request.Path);
            }
        }
    }
}
