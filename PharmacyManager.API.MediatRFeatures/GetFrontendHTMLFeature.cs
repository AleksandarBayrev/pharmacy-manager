using MediatR;
using PharmacyManager.API.Interfaces.Base;
using PharmacyManager.API.Interfaces.Frontend;
using System.Text;

namespace PharmacyManager.API.MediatRFeatures
{
    public class GetFrontendHTMLFeature
    {
        public class GetFrontendHTMLFeatureQuery : IRequest<byte[]>
        {
            public string Path { get; init; }
        }

        public class GetFrontendHTMLFeatureQueryHandler : IRequestHandler<GetFrontendHTMLFeatureQuery, byte[]>
        {
            private readonly ILogger logger;
            private readonly IFrontendReader reader;
            private readonly string loggerContext = nameof(GetFrontendHTMLFeature);
            public GetFrontendHTMLFeatureQueryHandler(
                ILogger logger,
                IFrontendReader reader)
            {
                this.logger = logger;
                this.reader = reader;
            }
            public async Task<byte[]> Handle(GetFrontendHTMLFeatureQuery request, CancellationToken cancellationToken)
            {
                await logger.Log(loggerContext, "Reading HTML for UI");
                return Encoding.UTF8.GetBytes(await reader.ReadHTML(request.Path));
            }
        }
    }
}
