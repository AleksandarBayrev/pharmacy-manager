using MediatR;
using Microsoft.Extensions.FileProviders;
using PharmacyManager.API.Interfaces.Base;
using PharmacyManager.API.MediatRFeatures;
using PharmacyManager.API.Middlewares;

namespace PharmacyManager.API.Extensions
{
    public static class WebApplicationExtensions
    {
        public static WebApplicationBuilder AddServices(this WebApplicationBuilder builder)
        {
            builder.Services.AddServices();
            return builder;
        }
        public static WebApplication ConfigureApplication(this WebApplication app)
        {
            app.UseMiddleware<RequestLoggerMiddleware>();
            if (app.Environment.IsDevelopment() && app.Services.GetService<IApplicationConfiguration>().EnableSwagger)
            {
                app.UseSwagger();
                app.UseSwaggerUI();
            }
            app.UseStaticFiles(new StaticFileOptions
            {
                FileProvider = new PhysicalFileProvider(Path.Combine(app.Environment.ContentRootPath, "wwwroot")),
                RequestPath = "/static"
            });
            app.UseAuthorization();
            app.AddFourOhFour();
            app.MapControllers();
            return app;
        }

        #region Handle 404 redirection
        private static WebApplication AddFourOhFour(this WebApplication app)
        {
            app.Use(async (HttpContext httpContext, RequestDelegate next) => {
                await next(httpContext);
                if (httpContext.Response.StatusCode == StatusCodes.Status404NotFound)
                {
                    httpContext.Response.Redirect("/404");
                }
            });
            return app;
        }
        #endregion
    }
}
