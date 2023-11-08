using Npgsql;
using PharmacyManager.API.Interfaces.Base;
using PharmacyManager.API.Interfaces.Medicines;
using PharmacyManager.API.Models;
using System.Globalization;
using System.Text.Json;

namespace PharmacyManager.API.Services.Medicines
{
	public class MedicinesOperations : IMedicinesOperations<string>
	{
		private readonly ILogger logger;
		private readonly IConnectionStringSchemaTableProvider connectionStringSchemaTableProvider;
		private readonly IMedicinesState<string, MedicineModel> medicinesState;

		public MedicinesOperations(
			ILogger logger,
			IConnectionStringSchemaTableProvider connectionStringSchemaTableProvider,
			IMedicinesState<string, MedicineModel> medicinesState)
		{
			this.logger = logger;
			this.connectionStringSchemaTableProvider = connectionStringSchemaTableProvider;
			this.medicinesState = medicinesState;
		}

		public async Task AddMedicineToDB(string medicineId)
		{
			using (var dbClient = this.BuildConnection())
			{
				MedicineModel? medicine;
				this.medicinesState.Medicines.TryGetValue(medicineId, out medicine);
				await dbClient.OpenAsync();
				await this.Log($"Trying to add medicine: {JsonSerializer.Serialize(medicine)}", LogLevel.Info);

				using (var addCommand = new NpgsqlCommand($"INSERT INTO {connectionStringSchemaTableProvider.SchemaAndTable}(id, manufacturer, name, description, \"manufacturingDate\", \"expirationDate\", price, quantity) VALUES ('{medicine.Id}', '{medicine.Manufacturer}', '{medicine.Name}', '{medicine.Description}', '{this.FormatDate(medicine.ManufacturingDate)}', '{this.FormatDate(medicine.ExpirationDate)}', {medicine.Price.ToString(CultureInfo.InvariantCulture)}, {medicine.Quantity});", dbClient))
				{
					var rows = await addCommand.ExecuteScalarAsync();
					await this.Log($"Successfully added {rows} medicines", LogLevel.Info);
				}
				medicine = null;
			}
		}

		public async Task UpdateMedicineInDB(string medicineId)
		{
			using (var dbClient = this.BuildConnection())
			{
				await dbClient.OpenAsync();
				MedicineModel? medicine;
				this.medicinesState.Medicines.TryGetValue(medicineId, out medicine);

				if (medicine != null)
				{
					using (var addCommand = new NpgsqlCommand($"UPDATE {connectionStringSchemaTableProvider.SchemaAndTable} SET manufacturer='{medicine.Manufacturer}', name='{medicine.Name}', description='{medicine.Description}', \"manufacturingDate\"='{medicine.ManufacturingDate}', \"expirationDate\"='{medicine.ExpirationDate}', price={medicine.Price.ToString(CultureInfo.InvariantCulture)}, quantity={medicine.Quantity}", dbClient))
					{
						await this.Log($"Trying to update medicine ID: {medicineId}", LogLevel.Info);
						await addCommand.ExecuteNonQueryAsync();
						using (var getCommand = new NpgsqlCommand($"SELECT * FROM {connectionStringSchemaTableProvider.SchemaAndTable} WHERE id='{medicineId}'", dbClient))
						{
							var data = await getCommand.ExecuteScalarAsync() as MedicineModel;
							if (data != null)
							{
								await this.Log($"Successfully updated medicine ID: {medicineId}", LogLevel.Info);
							}
						}
					}
					medicine = null;
				}
			}
		}

		public async Task DeleteMedicineInDB(string medicineId)
		{
			using (var dbClient = this.BuildConnection())
			{
				await dbClient.OpenAsync();
				await this.Log($"Trying to delete medicine ID: {medicineId}", LogLevel.Info);
				using (var addCommand = new NpgsqlCommand($"UPDATE {connectionStringSchemaTableProvider.SchemaAndTable} SET deleted=true WHERE id='{medicineId}'", dbClient))
				{
					await addCommand.ExecuteNonQueryAsync();
					using (var getCommand = new NpgsqlCommand($"SELECT COUNT(*) FROM {connectionStringSchemaTableProvider.SchemaAndTable} WHERE id='{medicineId}' AND deleted=true", dbClient))
					{
						var data = (await getCommand.ExecuteScalarAsync()) as int?;
						if (data == 1)
						{
							await this.Log($"Successfully removed medicine ID: {medicineId}", LogLevel.Info);
						}
					}
				}
			}
		}

		private NpgsqlConnection BuildConnection()
		{
			return new NpgsqlConnection(connectionStringSchemaTableProvider.ConnectionString);
		}

		private Task Log(string message, LogLevel logLevel) => this.logger.Log(nameof(MedicinesOperations), message, logLevel);

		private string FormatDate(DateTime date) => date.ToString("yyyy-MM-ddThh:mm:ssZ");
	}
}
