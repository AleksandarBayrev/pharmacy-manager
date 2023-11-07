using Microsoft.AspNetCore.HttpOverrides;
using Microsoft.Extensions.FileProviders;
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
        public static async Task<WebApplication> ConfigureApplication(this WebApplication app)
        {
            app
                .ConfigureProxySupport()
                .ConfigureMiddlewares();
            var configuration = app.Services.GetRequiredService<IApplicationConfiguration>();
            app.ConfigureSwaggerAndStaticFiles(configuration);
            var translationManager = app.Services.GetRequiredService<ITranslationManager>();
            await translationManager.LoadDictionaries();
            app.UseAuthorization();
            app.MapControllers();
			return app;
        }

        private static WebApplication ConfigureProxySupport(this WebApplication app)
        {
			app.UseForwardedHeaders(new ForwardedHeadersOptions
			{
				ForwardedHeaders = ForwardedHeaders.XForwardedFor | ForwardedHeaders.XForwardedProto
			});

            return app;
		}

        private static WebApplication ConfigureMiddlewares(this WebApplication app)
        {
            app.UseMiddleware<RequestLoggerMiddleware>();
            app.UseMiddleware<FourOhFourMiddleware>();
            return app;
        }

        private static WebApplication ConfigureSwaggerAndStaticFiles(this WebApplication app, IApplicationConfiguration configuration)
        {
            if (app.Environment.IsDevelopment() && configuration.EnableSwagger)
            {
                app.UseSwagger();
                app.UseSwaggerUI();
            }
            app.UseStaticFiles(new StaticFileOptions
            {
                FileProvider = new PhysicalFileProvider(Path.Combine(app.Environment.ContentRootPath, "wwwroot")),
                RequestPath = "/static"
            });
            return app;
        }
    }
}
