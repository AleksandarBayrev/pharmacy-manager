using PharmacyManager.API.Interfaces.Base;
using PharmacyManager.API.Services.Base;
using MediatR;
using PharmacyManager.API.MediatRFeatures;
using PharmacyManager.API.Interfaces.Medicines;
using PharmacyManager.API.Models;
using PharmacyManager.API.Services.Medicines;
using PharmacyManager.API.Interfaces.Frontend;
using PharmacyManager.API.Services.Frontend;
using PharmacyManager.API.Features;
using Microsoft.Extensions.DependencyInjection;

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
                    new MocksConfiguration(
                        Use: configuration.GetSection("Mocks").GetSection("Use").Get<bool>(),
                        GeneratedNumberOfPharmacies: configuration.GetSection("Mocks").GetSection("GeneratedNumberOfPharmacies").Get<int>()
                    ),
                    configuration.GetSection("LogErrorsOnly").Get<bool>(),
                    configuration.GetSection("RelativeHtmlPath").Get<string>(),
                    configuration.GetSection("Dictionaries").Get<IEnumerable<string>>(),
                    configuration.GetSection("DictionaryValidationKeys").Get<IEnumerable<string>>()
                );
            });
            #endregion

            #region Instantiate ID Generator
            services.AddSingleton<IIdGenerator, IdGenerator>();
            services.AddSingleton<IPriceParser, PriceParser>();
            #endregion

            #region Instantiate Medicines filter
            services.AddSingleton<IMedicinesFilter<MedicineRequest, MedicineModel>, MedicinesFilter>();
            #endregion

            #region Instantiate translationManager
            services.AddSingleton<ITranslationManager, TranslationManager>();
            #endregion
        }

        private static void ConfigureServices(IServiceCollection services)
        {
            services.AddSingleton<Interfaces.Base.ILogger, Logger>();

            #region Setup Page calculation service
            services.AddSingleton<IPageCalculation<PageCalculations>, PageCalculation>();
            #endregion

            #region Setup Medicines Provider
            services.AddSingleton<IMedicinesProvider<MedicineRequest, MedicineModel>>((sp) =>
            {
                var appConfig = sp.GetService<IApplicationConfiguration>();
                var idGenerator = sp.GetService<IIdGenerator>();
                var logger = sp.GetService<PharmacyManager.API.Interfaces.Base.ILogger>();
                var medicinesFilter = sp.GetService<PharmacyManager.API.Interfaces.Medicines.IMedicinesFilter<MedicineRequest, MedicineModel>>();

                if (appConfig == null)
                {
                    throw new NullReferenceException("Application configuration not available!");
                }
                
                if (logger == null)
                {
                    throw new NullReferenceException("Application logger not available!");
                }

                if (idGenerator == null)
                {
                    throw new NullReferenceException("IdGenerator not available!");
                }
                
                if (medicinesFilter == null)
                {
                    throw new NullReferenceException("MedicinesFilter not available!");
                }

                if (appConfig.Mocks.Use)
                {
                    return new MedicinesProviderMockInstance(logger, idGenerator, medicinesFilter, appConfig.Mocks.GeneratedNumberOfPharmacies);
                }
                return new MedicinesProvider();
            });
            #endregion

            #region Setup Frontend File Reader
            services.AddSingleton<IFrontendReader, FrontendReader>();
            #endregion
        }

        private static void AddMediatR(IServiceCollection services)
        {
            services.AddMediatR((configuration) =>
            {
                configuration.RegisterServicesFromAssemblyContaining<GetWebhostAbsolutePathFeature>();
                configuration.RegisterServicesFromAssemblyContaining<AddMedicineFeature>();
            });
        }
    }
}
