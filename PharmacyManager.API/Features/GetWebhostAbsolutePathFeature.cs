using MediatR;
using PharmacyManager.API.Interfaces.Base;

namespace PharmacyManager.API.Features
{
    public class GetWebhostAbsolutePathFeature
    {
        public class Query : IRequest<string> { }
        public class QueryHandler : IRequestHandler<Query, string>
        {
            private readonly IWebHostEnvironment webHostEnvironment;
            private readonly IApplicationConfiguration applicationConfiguration;

            public QueryHandler(
                IWebHostEnvironment webHostEnvironment,
                IApplicationConfiguration applicationConfiguration)
            {
                this.webHostEnvironment = webHostEnvironment;
                this.applicationConfiguration = applicationConfiguration;
            }
            public Task<string> Handle(Query request, CancellationToken cancellationToken)
            {
                var result = Path.Combine(this.webHostEnvironment.ContentRootPath, this.applicationConfiguration.RelativeHtmlPath);
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
