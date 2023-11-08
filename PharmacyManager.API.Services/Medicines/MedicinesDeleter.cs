﻿using Microsoft.Extensions.Hosting;
using Npgsql;
using PharmacyManager.API.Interfaces.Base;
using PharmacyManager.API.Interfaces.Medicines;
using PharmacyManager.API.Models;

namespace PharmacyManager.API.Services.Medicines
{
	public class MedicinesDeleter : BackgroundService
	{
		private readonly ILogger logger;
		private readonly IMedicinesState<string, MedicineModel> medicinesState;
		private readonly IConnectionStringSchemaTableProvider connectionStringSchemaTableProvider;

		public MedicinesDeleter(
			ILogger logger,
			IMedicinesState<string, MedicineModel> mediicinesState,
			IConnectionStringSchemaTableProvider connectionStringSchemaTableProvider)
		{
			this.logger = logger;
			this.medicinesState = mediicinesState;
			this.connectionStringSchemaTableProvider = connectionStringSchemaTableProvider;
		}
		protected override async Task ExecuteAsync(CancellationToken stoppingToken)
		{
			while (true)
			{
				await Log($"Started deleting medicines marked for deletion from database", LogLevel.Info);

				using (var dbClient = BuildConnection())
				{
					await dbClient.OpenAsync();
					using (var command = new NpgsqlCommand($"DELETE FROM {connectionStringSchemaTableProvider.SchemaAndTable} WHERE deleted=true", dbClient))
					{
						var rowsAffected = await command.ExecuteNonQueryAsync();
						await Log($"Deleted {rowsAffected} medicines from database", LogLevel.Info);
					}
				}
				foreach (var key in this.medicinesState.DeletedMedicines.Keys)
				{
					this.medicinesState.RemoveMedicine(key, out var medicine);
					if (medicine != null)
					{
						await Log($"Failed to delete {medicine.Id} from state", LogLevel.Info);
					}
				}
				await Task.Delay(TimeSpan.FromSeconds(2));
			}
		}

		private NpgsqlConnection BuildConnection()
		{
			return new NpgsqlConnection(connectionStringSchemaTableProvider.ConnectionString);
		}

		private Task Log(string message, LogLevel logLevel) => this.logger.Log(nameof(MedicinesDeleter), message, logLevel);
	}
}
