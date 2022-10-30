using Microsoft.AspNetCore.Mvc;
using ILogger = PharmacyManager.API.Interfaces.Base.ILogger;
using MediatR;
using PharmacyManager.API.MediatRFeatures;
using PharmacyManager.API.Features;
using PharmacyManager.API.Models;

namespace PharmacyManager.API.Controllers
{
    [Route("/")]
    [ApiController]
    public class AppController : ControllerBase
    {
        private readonly string contentType = "text/html";
        private readonly ILogger logger;
        private readonly IMediator mediator;
        private readonly string loggerContext = nameof(AppController);

        public AppController(
            ILogger logger,
            IMediator mediator)
        {
            this.logger = logger;
            this.mediator = mediator;
        }

        [HttpGet]
        [HttpGet("medicines/get")]
        [HttpGet("medicines/add")]
        [HttpGet("medicines/update")]
        [HttpGet("settings")]
        [HttpGet("404")]
        public async Task<IActionResult> GetHTML()
        {
            await logger.Log(this.loggerContext, "Rendering App UI");
            return new FileContentResult(await mediator.Send(new GetFrontendHTMLFeature.GetFrontendHTMLFeatureQuery
            {
                Path = await this.mediator.Send(new GetWebhostAbsolutePathFeature.GetWebhostAbsolutePathFeatureQuery())
            }), this.contentType);
        }

        [HttpGet("reload")]
        public async Task<bool> ReloadHTML()
        {
            await logger.Log(this.loggerContext, "Reloading App UI");
            return await mediator.Send(new GetFrontendHTMLReloadFeature.GetFrontendHTMLReloadFeatureQuery
            {
                Path = await this.mediator.Send(new GetWebhostAbsolutePathFeature.GetWebhostAbsolutePathFeatureQuery())
            });
        }
    }
}
