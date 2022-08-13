using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Text;

namespace PharmacyManager.API.Controllers
{
    [Route("/")]
    [Route("/app")]
    [ApiController]
    public class AppController : ControllerBase
    {
        public AppController()
        {

        }

        [HttpGet]
        public IActionResult GetHTML()
        {
            return new FileContentResult(Encoding.UTF8.GetBytes("<html><head><title>Index</title></head><body></body></html>"), "text/html");
        }
    }
}
