namespace PharmacyManager.API.Middlewares
{
    public class RequestLoggerMiddleware
    {
        private readonly RequestDelegate next;
        private readonly Interfaces.Base.ILogger logger;
        private readonly IWebHostEnvironment environment;

        public RequestLoggerMiddleware(
            RequestDelegate next,
            Interfaces.Base.ILogger logger,
            IWebHostEnvironment environment)
        {
            this.next = next;
            this.logger = logger;
            this.environment = environment;
        }
        public async Task Invoke(HttpContext httpContext)
        {
            try
            {
                await LogStartOfRequest(httpContext);
                await next(httpContext);
                await LogEndOfRequest(httpContext);
            }
            catch (Exception ex)
            {
                httpContext.Response.StatusCode = StatusCodes.Status500InternalServerError;
                await LogEndOfRequest(httpContext, ex);
                if (this.environment.IsDevelopment())
                {
                    throw;
                }
            }
        }
        private async Task LogStartOfRequest(HttpContext httpContext)
        {
            await logger.Log(nameof(RequestLoggerMiddleware), $"({httpContext.Request.Method}) Requesting {httpContext.Request.Path}");
        }
        private async Task LogEndOfRequest(HttpContext httpContext)
        {
            await logger.Log(nameof(RequestLoggerMiddleware), $"({httpContext.Request.Method} HTTP Status {httpContext.Response.StatusCode}) Finished request to {httpContext.Request.Path}");
        }
        private async Task LogEndOfRequest(HttpContext httpContext, Exception ex)
        {
            await logger.Log(nameof(RequestLoggerMiddleware), $"({httpContext.Request.Method} HTTP Status {httpContext.Response.StatusCode}) Failed request to {httpContext.Request.Path}, Exception: {ex}");
        }
    }
}
