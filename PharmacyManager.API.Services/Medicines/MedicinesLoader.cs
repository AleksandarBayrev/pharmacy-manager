using Microsoft.Extensions.Hosting;
using Npgsql;
using PharmacyManager.API.Interfaces.Base;
using PharmacyManager.API.Interfaces.Medicines;
using PharmacyManager.API.Models;
using ILogger = PharmacyManager.API.Interfaces.Base.ILogger;
using LogLevel = PharmacyManager.API.Interfaces.Base.LogLevel;

namespace PharmacyManager.API.Services.Medicines
{
	public class MedicinesLoader : BackgroundService
    {
        private readonly ILogger logger;
		private readonly IApplicationConfiguration applicationConfiguration;
		private readonly IConnectionStringSchemaTableProvider connectionStringSchemaTableProvider;
		private readonly IMedicinesState<string, MedicineModel> medicinesState;
		private readonly IDateFormatter dateFormatter;

		public MedicinesLoader(
            ILogger logger,
            IApplicationConfiguration applicationConfiguration,
            IConnectionStringSchemaTableProvider connectionStringSchemaTableProvider,
            IMedicinesState<string, MedicineModel> medicinesState,
            IDateFormatter dateFormatter)
        {
            this.logger = logger;
			this.applicationConfiguration = applicationConfiguration;
            this.connectionStringSchemaTableProvider = connectionStringSchemaTableProvider;
            this.medicinesState = medicinesState;
			this.dateFormatter = dateFormatter;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            if (this.applicationConfiguration.Mocks.Use)
			{
				await Log($"{nameof(MedicinesLoader)} is not used when mocks are enabled", LogLevel.Info);
				return;
            }
            while (true)
			{
				await Log($"Started loading medicines from database", LogLevel.Info);

				using (var dbClient = BuildConnection())
				{
					await dbClient.OpenAsync();
					using (var command = new NpgsqlCommand($"SELECT * FROM {connectionStringSchemaTableProvider.SchemaAndTable}", dbClient))
					using (var reader = await command.ExecuteReaderAsync())
					{
						while (await reader.ReadAsync())
						{
							var medicine = await BuildMedicine(reader);
                            if (medicine.Deleted)
                            {
                                this.medicinesState.RemoveMedicine(medicine.Id, out var _);
                                continue;
                            }
							this.medicinesState.AddOrUpdate(medicine.Id, medicine, (key, current) =>
							{
								current.Id = medicine.Id;
								current.Name = medicine.Name;
								current.Manufacturer = medicine.Manufacturer;
								current.Description = medicine.Description;
								current.ExpirationDate = medicine.ExpirationDate;
								current.ManufacturingDate = medicine.ManufacturingDate;
								current.Price = medicine.Price;
								current.Quantity = medicine.Quantity;
								return current;
							});
						}
					}
				}
				await Log($"Finished loading medicines from database", LogLevel.Info);
				await Task.Delay(TimeSpan.FromSeconds(10));
			}
		}

        private async Task<MedicineModel> BuildMedicine(NpgsqlDataReader reader)
        {
            var id = await reader.GetFieldValueAsync<string>(0);
            var manufacturer = await reader.GetFieldValueAsync<string>(1);
            var name = await reader.GetFieldValueAsync<string>(2);
            var description = await reader.GetFieldValueAsync<string>(3);
            var manufacturingDate = await reader.GetFieldValueAsync<DateTime>(4);
            var expirationDate = await reader.GetFieldValueAsync<DateTime>(5);
            var price = await reader.GetFieldValueAsync<decimal>(6);
			var quantity = await reader.GetFieldValueAsync<long>(7);
			var deleted = await reader.GetFieldValueAsync<bool>(8);

			return new MedicineModel
            {
                Id = id.ToString(),
                Manufacturer = manufacturer,
                Name = name,
                Description = description,
                ManufacturingDate = manufacturingDate,
                ExpirationDate = expirationDate,
                Price = price,
                Quantity = quantity,
                Deleted = deleted
            };
        }

        private Task Log(string message, LogLevel logLevel) => logger.Log(nameof(MedicinesLoader), message, logLevel);

        private NpgsqlConnection BuildConnection()
        {
            return new NpgsqlConnection(connectionStringSchemaTableProvider.ConnectionString);
        }
    }
}
