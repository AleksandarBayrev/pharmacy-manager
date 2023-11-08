﻿using PharmacyManager.API.Interfaces.Base;
using PharmacyManager.API.Services.Base;
using PharmacyManager.API.MediatRFeatures;
using PharmacyManager.API.Interfaces.Medicines;
using PharmacyManager.API.Models;
using PharmacyManager.API.Services.Medicines;
using PharmacyManager.API.Interfaces.Frontend;
using PharmacyManager.API.Services.Frontend;
using PharmacyManager.API.Features;

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

			services.AddSingleton<Interfaces.Base.ILogger, Logger>();

			#region Instantiate Application Configuration
			services.AddSingleton<IApplicationConfiguration>((sp) =>
            {
                var configuration = sp.GetRequiredService<IConfiguration>();

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
                    configuration.GetSection("DictionaryValidationKeys").Get<IEnumerable<string>>(),
                    new DatabaseConfiguration
                    {
                        Host = configuration.GetSection("DatabaseConfiguration").GetSection("Host").Get<string>(),
						Username = configuration.GetSection("DatabaseConfiguration").GetSection("Username").Get<string>(),
						Password = configuration.GetSection("DatabaseConfiguration").GetSection("Password").Get<string>(),
						Database = configuration.GetSection("DatabaseConfiguration").GetSection("Database").Get<string>(),
						Port = configuration.GetSection("DatabaseConfiguration").GetSection("Port").Get<int>(),
					}
                );
            });
			#endregion

			#region Instantiate connection string provider
			services.AddSingleton<IConnectionStringProvider, ConnectionStringProvider>();
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
			services.AddSingleton<IMedicinesState<string, MedicineModel>, MedicinesState>();
            services.AddSingleton<IMedicinesOperations<string>, MedicinesOperations>();
            services.AddHostedService<MedicinesLoader>();
            services.AddHostedService<MedicinesDeleter>();

            #region Setup Page calculation service
            services.AddSingleton<IPageCalculation<PageCalculations>, PageCalculation>();
            #endregion

            #region Setup Medicines Provider
            services.AddSingleton<IMedicinesProvider<MedicineRequest, string, MedicineModel>>((sp) =>
            {
                var appConfig = sp.GetRequiredService<IApplicationConfiguration>();
                var connectionStringProvider = sp.GetRequiredService<IConnectionStringProvider>();
				var medicinesState = sp.GetRequiredService<IMedicinesState<string, MedicineModel>>();
				var medicinesOperations = sp.GetRequiredService<IMedicinesOperations<string>>();
				var idGenerator = sp.GetRequiredService<IIdGenerator>();
				var logger = sp.GetRequiredService<Interfaces.Base.ILogger>();
				var medicinesFilter = sp.GetRequiredService<IMedicinesFilter<MedicineRequest, MedicineModel>>();

                if (appConfig.Mocks.Use)
                {
                    var mockInstance = new MedicinesProviderMockInstance(logger, idGenerator, medicinesFilter, appConfig.Mocks.GeneratedNumberOfPharmacies);
                    return mockInstance;
                }
                var instance = new MedicinesProvider(logger, connectionStringProvider, medicinesState, medicinesOperations, medicinesFilter);
				return instance;
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
