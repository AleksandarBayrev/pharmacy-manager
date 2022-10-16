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
            app.UseMiddleware<FourOhFourMiddleware>();
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
            app.MapControllers();
            return app;
        }
    }
}
