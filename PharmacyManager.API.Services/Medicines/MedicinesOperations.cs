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
		private readonly IDateFormatter dateFormatter;

		public MedicinesOperations(
			ILogger logger,
			IConnectionStringSchemaTableProvider connectionStringSchemaTableProvider,
			IMedicinesState<string, MedicineModel> medicinesState,
			IDateFormatter dateFormatter)
		{
			this.logger = logger;
			this.connectionStringSchemaTableProvider = connectionStringSchemaTableProvider;
			this.medicinesState = medicinesState;
			this.dateFormatter = dateFormatter;
		}

		public async Task AddMedicineToDB(string medicineId)
		{
			MedicineModel? medicine;
			this.medicinesState.Medicines.TryGetValue(medicineId, out medicine);
			if (medicine == null)
			{
				throw new KeyNotFoundException($"Medicine with id = {medicineId} not found.");
			}
			using (var dbClient = this.BuildConnection())
			{
				await dbClient.OpenAsync();
				await this.Log($"Trying to add medicine: {JsonSerializer.Serialize(medicine)}", LogLevel.Information);
				using (var addCommand = new NpgsqlCommand(InsertQuery, dbClient))
				{
					addCommand.Parameters.Add(new NpgsqlParameter("@id", medicine.Id));
					addCommand.Parameters.Add(new NpgsqlParameter("@manufacturer", medicine.Manufacturer));
					addCommand.Parameters.Add(new NpgsqlParameter("@name", medicine.Name));
					addCommand.Parameters.Add(new NpgsqlParameter("@description", medicine.Description));
					addCommand.Parameters.Add(new NpgsqlParameter("@manufacturingDate", this.dateFormatter.FormatDate(medicine.ManufacturingDate)));
					addCommand.Parameters.Add(new NpgsqlParameter("@expirationDate", this.dateFormatter.FormatDate(medicine.ExpirationDate)));
					addCommand.Parameters.Add(new NpgsqlParameter("@price", medicine.Price.ToString(CultureInfo.InvariantCulture)));
					addCommand.Parameters.Add(new NpgsqlParameter("@quantity", medicine.Quantity));
					var rows = await addCommand.ExecuteScalarAsync();
					await this.Log($"Successfully added {rows} medicines", LogLevel.Information);
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
					using (var updateCommand = new NpgsqlCommand(UpdateQuery, dbClient))
					{
						await this.Log($"Trying to update medicine ID: {medicineId}", LogLevel.Information);
						updateCommand.Parameters.Add(new NpgsqlParameter("@id", medicine.Id));
						updateCommand.Parameters.Add(new NpgsqlParameter("@manufacturer", medicine.Manufacturer));
						updateCommand.Parameters.Add(new NpgsqlParameter("@name", medicine.Name));
						updateCommand.Parameters.Add(new NpgsqlParameter("@description", medicine.Description));
						updateCommand.Parameters.Add(new NpgsqlParameter("@manufacturingDate", this.dateFormatter.FormatDate(medicine.ManufacturingDate)));
						updateCommand.Parameters.Add(new NpgsqlParameter("@expirationDate", this.dateFormatter.FormatDate(medicine.ExpirationDate)));
						updateCommand.Parameters.Add(new NpgsqlParameter("@price", medicine.Price.ToString(CultureInfo.InvariantCulture)));
						updateCommand.Parameters.Add(new NpgsqlParameter("@quantity", medicine.Quantity));
						await updateCommand.ExecuteNonQueryAsync();
						using (var getCommand = new NpgsqlCommand(SelectQuery, dbClient))
						{
							getCommand.Parameters.Add(new NpgsqlParameter("@id", medicine.Id));
							var data = await getCommand.ExecuteScalarAsync() as MedicineModel;
							if (data != null)
							{
								await this.Log($"Successfully updated medicine ID: {medicineId}", LogLevel.Information);
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
				await this.Log($"Trying to delete medicine ID: {medicineId}", LogLevel.Information);
				using (var deleteCommand = new NpgsqlCommand(DeleteQuery, dbClient))
				{
					deleteCommand.Parameters.Add(new NpgsqlParameter("@id", medicineId));
					await deleteCommand.ExecuteNonQueryAsync();
					using (var getCommand = new NpgsqlCommand($"SELECT * FROM {connectionStringSchemaTableProvider.SchemaAndTable} WHERE id='{medicineId}' AND deleted=true", dbClient))
					{
						var data = await getCommand.ExecuteNonQueryAsync();
						if (data == 1)
						{
							await this.Log($"Successfully removed medicine ID: {medicineId}", LogLevel.Information);
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

		private string InsertQuery => $"INSERT INTO {connectionStringSchemaTableProvider.SchemaAndTable} (id, manufacturer, name, description, \"manufacturingDate\", \"expirationDate\", price, quantity) VALUES(@id, @manufacturer, @name, @description, @manufacturingDate, @expirationDate, @price, @quantity)";
		private string UpdateQuery => $"UPDATE {connectionStringSchemaTableProvider.SchemaAndTable} SET manufacturer='@manufacturer', name='@name', description='@description', \"manufacturingDate\"='@manufacturingDate', \"expirationDate\"='@expirationDate', price=@price, quantity=@quantity WHERE id='@id'";
		private string SelectQuery => $"SELECT * FROM {connectionStringSchemaTableProvider.SchemaAndTable} WHERE id='@id'";
		private string DeleteQuery => $"UPDATE {connectionStringSchemaTableProvider.SchemaAndTable} SET deleted=true WHERE id='@id'";
	}
}
