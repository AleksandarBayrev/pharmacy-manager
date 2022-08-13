using PharmacyManager.API.Interfaces.Base;
using PharmacyManager.API.Services.Base;
using MediatR;
using PharmacyManager.API.MediatRFeatures;
using PharmacyManager.API.Interfaces.Medicines;
using PharmacyManager.API.Models;
using PharmacyManager.API.Services.Medicines;

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
            #region Instantiate Application Configuration
            services.AddSingleton<IApplicationConfiguration>((sp) =>
            {
                var configuration = sp.GetService<IConfiguration>();

                if (configuration == null)
                {
                    throw new NullReferenceException("Missing .NET application configuration!");
                }

                return new ApplicationConfiguration(
                    configuration.GetSection("EnableSwagger").Get<bool>(),
                    configuration.GetSection("UseMocks").Get<bool>()
                );
            });
            #endregion
        }

        private static void ConfigureServices(IServiceCollection services)
        {
            services.AddSingleton<Interfaces.Base.ILogger, Logger>();
            #region Setup Medicines Provider
            services.AddSingleton<IMedicinesProvider<MedicineModel>>((sp) =>
            {
                var appConfig = sp.GetService<IApplicationConfiguration>();

                if (appConfig == null)
                {
                    throw new NullReferenceException("Application configuration not available!");
                }

                if (appConfig.UseMocks)
                {
                    return new MedicinesProviderMockInstance();
                }
                return new MedicinesProvider();
            });
            #endregion
        }

        private static void AddMediatR(IServiceCollection services)
        {
            services.AddMediatR(typeof(GetConfigurationFeature));
        }
    }
}
