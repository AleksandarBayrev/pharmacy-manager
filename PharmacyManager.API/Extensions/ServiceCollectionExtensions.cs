using PharmacyManager.API.Interfaces.Base;
using PharmacyManager.API.Services.Base;
using MediatR;
using PharmacyManager.API.MediatRFeatures;

namespace PharmacyManager.API.Extensions
{
    public static class ServiceCollectionExtensions
    {
        public static IServiceCollection AddServices(this IServiceCollection services)
        {
            ConfigureBaseServices(services);
            ConfigureServices(services);
            AddMediatR(services);
            return services;
        }

        private static void ConfigureBaseServices(IServiceCollection services)
        {
            services.AddControllers();
            services.AddEndpointsApiExplorer();
            services.AddSwaggerGen();
            services.AddSingleton<IApplicationConfiguration>((sp) =>
            {
                var configuration = sp.GetService<IConfiguration>();

                if (configuration == null)
                {
                    throw new NullReferenceException("Missing .NET application configuration!");
                }

                return new ApplicationConfiguration(
                    configuration.GetSection("EnableSwagger").Get<bool>());
            });
        }

        private static void ConfigureServices(IServiceCollection services)
        {
            services.AddSingleton<Interfaces.Base.ILogger, Logger>();
        }

        private static void AddMediatR(IServiceCollection services)
        {
            services.AddMediatR(typeof(GetConfigurationFeature));
        }
    }
}
