using MediatR;
using PharmacyManager.API.Interfaces.Base;

namespace PharmacyManager.API.Features
{
    public class GetWebhostAbsolutePathFeature
    {
        public class GetWebhostAbsolutePathFeatureQuery : IRequest<string> { }
        public class GetWebhostAbsolutePathFeatureQueryHandler : IRequestHandler<GetWebhostAbsolutePathFeatureQuery, string>
        {
            private readonly IWebHostEnvironment webHostEnvironment;
            private readonly IApplicationConfiguration applicationConfiguration;

            public GetWebhostAbsolutePathFeatureQueryHandler(
                IWebHostEnvironment webHostEnvironment,
                IApplicationConfiguration applicationConfiguration)
            {
                this.webHostEnvironment = webHostEnvironment;
                this.applicationConfiguration = applicationConfiguration;
            }
            public Task<string> Handle(GetWebhostAbsolutePathFeatureQuery request, CancellationToken cancellationToken)
            {
                return Task.FromResult(
                    Path.Combine(
                        this.webHostEnvironment.ContentRootPath,
                        this.applicationConfiguration.RelativeHtmlPath
                    )
                );
            }
        }
    }
}
