using MediatR;
using PharmacyManager.API.Interfaces.Base;
using PharmacyManager.API.Interfaces.Frontend;

namespace PharmacyManager.API.MediatRFeatures
{
    public class GetFrontendHTMLReloadFeature
    {
        public class Query : IRequest<bool>
        {
            public string Path { get; init; }
        }

        public class QueryHandler : IRequestHandler<Query, bool>
        {
            private readonly ILogger logger;
            private readonly string loggerContext = nameof(GetFrontendHTMLReloadFeature);
            private readonly IFrontendReader reader;

            public QueryHandler(
                ILogger logger,
                IFrontendReader reader)
            {
                this.logger = logger;
                this.reader = reader;
            }
            public async Task<bool> Handle(Query request, CancellationToken cancellationToken)
            {
                await logger.Log(loggerContext, $"Reloading path {request.Path}");
                return await reader.ReloadHTML(request.Path);
            }
        }
    }
}
