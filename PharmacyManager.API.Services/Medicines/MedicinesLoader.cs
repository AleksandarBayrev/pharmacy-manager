﻿using Microsoft.Extensions.Hosting;
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
        private readonly string cacheKey = "medicines";
        private readonly ILogger logger;
        private readonly IApplicationConfiguration applicationConfiguration;
		private readonly IMedicinesState<string, MedicineModel> medicinesState;

		public MedicinesLoader(
            ILogger logger,
            IApplicationConfiguration applicationConfiguration,
            IMedicinesState<string, MedicineModel> medicinesState)
        {
            this.logger = logger;
            this.applicationConfiguration = applicationConfiguration;
            this.medicinesState = medicinesState;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            while (true)
			{
				await Log($"Started loading medicines from database", LogLevel.Info);

				using (var dbClient = BuildConnection())
				{
					await dbClient.OpenAsync();
					using (var command = new NpgsqlCommand("SELECT * FROM public.medicines", dbClient))
					using (var reader = await command.ExecuteReaderAsync())
					{
						while (await reader.ReadAsync())
						{
							var medicine = await BuildMedicine(reader);
                            if (medicine.Deleted)
                            {
                                this.medicinesState.Medicines.TryRemove(medicine.Id, out var _);
                                continue;
                            }
							this.medicinesState.Medicines.AddOrUpdate(medicine.Id, medicine, (key, current) =>
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
                await Task.Delay(TimeSpan.FromSeconds(10));
			}
		}

        private async Task<MedicineModel> BuildMedicine(NpgsqlDataReader reader)
        {
            var id = await reader.GetFieldValueAsync<Guid>(0);
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
        private string FormatDate(DateTime date) => date.ToString("yyyy-MM-ddThh:mm:ssZ");

        private Task Log(string message, LogLevel logLevel) => logger.Log(nameof(MedicinesLoader), message, logLevel);

        private NpgsqlConnection BuildConnection()
        {
            var connectionStringBuilder = new NpgsqlConnectionStringBuilder()
            {
                Host = applicationConfiguration.DatabaseConfiguration.Host,
                Username = applicationConfiguration.DatabaseConfiguration.Username,
                Password = applicationConfiguration.DatabaseConfiguration.Password,
                Database = applicationConfiguration.DatabaseConfiguration.Database,
                Port = applicationConfiguration.DatabaseConfiguration.Port,
            };
            return new NpgsqlConnection(connectionStringBuilder.ToString());
        }
    }
}
