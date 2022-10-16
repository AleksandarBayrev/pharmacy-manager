namespace PharmacyManager.API.Middlewares
{
    public class FourOhFourMiddleware
    {
        private readonly RequestDelegate next;

        public FourOhFourMiddleware(RequestDelegate next)
        {
            this.next = next;
        }

        public async Task Invoke(HttpContext httpContext)
        {
            await next(httpContext);
            if (httpContext.Response.StatusCode == StatusCodes.Status404NotFound)
            {
                httpContext.Response.Redirect("/404");
            }
        }
    }
}
