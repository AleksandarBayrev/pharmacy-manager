using MediatR;
using PharmacyManager.API.Interfaces.Base;

namespace PharmacyManager.API.MediatRFeatures
{
    public class GetConfigurationFeature
    {
        public class Query : IRequest<IApplicationConfiguration> { }

        public class QueryHandler : IRequestHandler<Query, IApplicationConfiguration>
        {
            private readonly ILogger logger;
            private readonly IApplicationConfiguration configuration;

            public QueryHandler(
                ILogger logger,
                IApplicationConfiguration configuration)
            {
                this.logger = logger;
                this.configuration = configuration;
            }

            public async Task<IApplicationConfiguration> Handle(Query request, CancellationToken cancellationToken)
            {
                throw new Exception();
                await logger.Log(nameof(GetConfigurationFeature), $"Received request for fetching {nameof(IApplicationConfiguration)}");
                return configuration;
            }
        }
    }
}