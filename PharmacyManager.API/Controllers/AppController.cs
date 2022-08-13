using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Text;
using PharmacyManager.API.Interfaces.Base;
using ILogger = PharmacyManager.API.Interfaces.Base.ILogger;

namespace PharmacyManager.API.Controllers
{
    [Route("/")]
    [Route("/app")]
    [ApiController]
    public class AppController : ControllerBase
    {
        private readonly string contentType = "text/html";
        private readonly Interfaces.Base.ILogger logger;
        private readonly string loggerContext = nameof(AppController);

        public AppController(ILogger logger)
        {
            this.logger = logger;
        }

        [HttpGet]
        public async Task<IActionResult> GetHTML()
        {
            await logger.Log(this.loggerContext, "Rendering App UI");
            return new FileContentResult(Encoding.UTF8.GetBytes("<html><head><title>Index</title></head><body></body></html>"), this.contentType);
        }
    }
}
