using Npgsql;
using PharmacyManager.API.Interfaces.Base;
using PharmacyManager.API.Interfaces.Medicines;
using PharmacyManager.API.Models;
using System.Collections.Concurrent;
using System.Numerics;

namespace PharmacyManager.API.Services.Medicines
{
	public class MedicinesProvider : IMedicinesProvider<MedicineRequest, MedicineModel>
	{
		private readonly IDictionary<string, MedicineModel> medicines;
		private readonly IApplicationConfiguration applicationConfiguration;
		private readonly IMedicinesFilter<MedicineRequest, MedicineModel> medicinesFilter;

		public MedicinesProvider(
			IApplicationConfiguration applicationConfiguration,
			IMedicinesFilter<MedicineRequest, MedicineModel> medicinesFilter)
		{
			this.applicationConfiguration = applicationConfiguration;
			this.medicinesFilter = medicinesFilter;
			this.medicines = new ConcurrentDictionary<string, MedicineModel>();
			this.LoadMedicines();
		}
		public async Task<MedicineModel?> AddMedicine(MedicineModel medicine)
		{
			using (var dbClient = this.BuildConnection())
			{
				await dbClient.OpenAsync();
				var id = Guid.NewGuid();
				using (var addCommand = new NpgsqlCommand($"INSERT INTO public.medicines(id, manufacturer, name, description, \"manufacturingDate\", \"expirationDate\", price, quantity) VALUES ('{id}', '{medicine.Manufacturer}', '{medicine.Name}', '{medicine.Description}', '{this.FormatDate(medicine.ManufacturingDate)}', '{this.FormatDate(medicine.ExpirationDate)}', {medicine.Price}, {medicine.Quantity});", dbClient))
				{
					await addCommand.ExecuteNonQueryAsync();
					using (var getCommand = new NpgsqlCommand($"SELECT * FROM public.medicines WHERE id='{id}'", dbClient))
					{
						var data = await getCommand.ExecuteScalarAsync() as MedicineModel;
						return data;
					}
				}
			}
		}

		public async Task<IEnumerable<MedicineModel>> GetFilteredMedicines(MedicineRequest request)
		{
			var filteredMedicines = await this.medicinesFilter.ApplyFilters(request, medicines.Values);
			return filteredMedicines.OrderByDescending(x => x.ExpirationDate);
		}

		public async Task<int> GetFilteredMedicinesCount(MedicineRequest request)
		{
			var filteredMedicines = await this.GetFilteredMedicines(request);
			return filteredMedicines.Count();
		}

		private async Task LoadMedicines()
		{
			this.medicines.Clear();
			using (var dbClient = this.BuildConnection())
			{
				await dbClient.OpenAsync();
				using (var command = new NpgsqlCommand("SELECT * FROM public.medicines", dbClient))
				using (var reader = await command.ExecuteReaderAsync())
				{
					while (await reader.ReadAsync())
					{
						var medicine = await this.BuildMedicine(reader);
						this.medicines.Add(medicine.Id, medicine);
					}
				}
			}
			await Task.Delay(1000);
			await LoadMedicines();
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

			return new MedicineModel
			{
				Id = id.ToString(),
				Manufacturer = manufacturer,
				Name = name,
				Description = description,
				ManufacturingDate = manufacturingDate,
				ExpirationDate = expirationDate,
				Price = price,
				Quantity = quantity
			};
		}

		private NpgsqlConnection BuildConnection()
		{
			var connectionStringBuilder = new NpgsqlConnectionStringBuilder()
			{
				Host = this.applicationConfiguration.DatabaseConfiguration.Host,
				Username = this.applicationConfiguration.DatabaseConfiguration.Username,
				Password = this.applicationConfiguration.DatabaseConfiguration.Password,
				Database = this.applicationConfiguration.DatabaseConfiguration.Database,
				Port = this.applicationConfiguration.DatabaseConfiguration.Port,
			};
			return new NpgsqlConnection(connectionStringBuilder.ToString());
		}

		private string FormatDate(DateTime date) => date.ToString("yyyy-MM-ddThh:mm:ssZ");
	}
}
