using PharmacyManager.API.Interfaces.Base;
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

            app.UseAuthorization();


            app.MapControllers();
            return app;
        }
    }
}
