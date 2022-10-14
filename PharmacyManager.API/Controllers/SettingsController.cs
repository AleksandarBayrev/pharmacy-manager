using MediatR;
using Microsoft.AspNetCore.Mvc;
using PharmacyManager.API.Interfaces.Base;
using PharmacyManager.API.MediatRFeatures;

namespace PharmacyManager.API.Controllers
{
    [Route("api/settings")]
    [ApiController]
    public class SettingsController : ControllerBase
    {
        private readonly IMediator mediator;

        public SettingsController(IMediator mediator)
        {
            this.mediator = mediator;
        }

        [HttpGet("configuration")]
        public Task<IApplicationConfiguration> GetConfiguration()
        {
            return this.mediator.Send(new GetConfigurationFeature.GetConfigurationFeatureQuery());
        }
    }
}
