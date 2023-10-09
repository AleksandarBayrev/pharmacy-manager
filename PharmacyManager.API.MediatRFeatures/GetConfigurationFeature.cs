using MediatR;
using PharmacyManager.API.Interfaces.Base;

namespace PharmacyManager.API.MediatRFeatures
{
    public class GetConfigurationFeature
    {
        public class GetConfigurationFeatureQuery : IRequest<IApplicationConfiguration> { }

        public class GetConfigurationFeatureQueryHandler : IRequestHandler<GetConfigurationFeatureQuery, IApplicationConfiguration>
        {
            private readonly ILogger logger;
            private readonly IApplicationConfiguration configuration;

            public GetConfigurationFeatureQueryHandler(
                ILogger logger,
                IApplicationConfiguration configuration)
            {
                this.logger = logger;
                this.configuration = configuration;
            }

            public async Task<IApplicationConfiguration> Handle(GetConfigurationFeatureQuery request, CancellationToken cancellationToken)
            {
                await logger.Log(nameof(GetConfigurationFeature), $"Received request for fetching {nameof(IApplicationConfiguration)}", LogLevel.Info, cancellationToken);
                return configuration;
            }
        }
    }
}