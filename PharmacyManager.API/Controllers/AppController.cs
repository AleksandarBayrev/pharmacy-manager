using Microsoft.AspNetCore.Mvc;
using ILogger = PharmacyManager.API.Interfaces.Base.ILogger;
using MediatR;
using PharmacyManager.API.MediatRFeatures;
using PharmacyManager.API.Interfaces.Base;

namespace PharmacyManager.API.Controllers
{
    [Route("/")]
    [Route("/medicines/get")]
    [Route("/medicines/add")]
    [Route("/medicines/update")]
    [Route("/404")]
    [ApiController]
    public class AppController : ControllerBase
    {
        private readonly string contentType = "text/html";
        private readonly ILogger logger;
        private readonly IWebHostEnvironment env;
        private readonly IMediator mediator;
        private readonly IApplicationConfiguration applicationConfiguration;
        private readonly string loggerContext = nameof(AppController);

        public AppController(
            ILogger logger,
            IWebHostEnvironment env,
            IMediator mediator,
            IApplicationConfiguration applicationConfiguration)
        {
            this.logger = logger;
            this.env = env;
            this.mediator = mediator;
            this.applicationConfiguration = applicationConfiguration;
        }

        [HttpGet]
        public async Task<IActionResult> GetHTML()
        {
            await logger.Log(this.loggerContext, "Rendering App UI");
            return new FileContentResult(await mediator.Send(new GetFrontendHTMLFeature.Query
            {
                Path = this.BuildAbsolutePath()
            }), this.contentType);
        }

        [HttpGet("reload")]
        public async Task<bool> ReloadHTML()
        {
            await logger.Log(this.loggerContext, "Reloading App UI");
            return await mediator.Send(new GetFrontendHTMLReloadFeature.Query
            {
                Path = this.BuildAbsolutePath()
            });
        }

        private string BuildAbsolutePath() => Path.Combine(env.ContentRootPath, this.applicationConfiguration.RelativeHtmlPath);
    }
}
