using Microsoft.Extensions.Hosting;
using Npgsql;
using PharmacyManager.API.Interfaces.Base;

namespace PharmacyManager.API.Services.Medicines
{
	public class MedicinesDeleter : BackgroundService
	{
		private readonly ILogger logger;
		private readonly IApplicationConfiguration applicationConfiguration;

		public MedicinesDeleter(
			ILogger logger,
			IApplicationConfiguration applicationConfiguration)
		{
			this.logger = logger;
			this.applicationConfiguration = applicationConfiguration;
		}
		protected override async Task ExecuteAsync(CancellationToken stoppingToken)
		{
			while (true)
			{
				await Log($"Started deleting medicines marked for deletion from database", LogLevel.Info);

				using (var dbClient = BuildConnection())
				{
					await dbClient.OpenAsync();
					using (var command = new NpgsqlCommand("DELETE FROM public.medicines WHERE deleted=true", dbClient))
					{
						var rowsAffected = await command.ExecuteNonQueryAsync();
						await Log($"Deleted {rowsAffected} medicines from database", LogLevel.Info);
					}
				}
				await Task.Delay(TimeSpan.FromSeconds(2));
			}
		}

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

		private Task Log(string message, LogLevel logLevel) => this.logger.Log(nameof(MedicinesDeleter), message, logLevel);
	}
}
