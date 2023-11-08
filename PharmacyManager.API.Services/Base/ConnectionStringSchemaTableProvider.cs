using Npgsql;
using PharmacyManager.API.Interfaces.Base;

namespace PharmacyManager.API.Services.Base
{
	public class ConnectionStringSchemaTableProvider : IConnectionStringSchemaTableProvider
	{
		private readonly ILogger logger;
		private readonly IApplicationConfiguration applicationConfiguration;
		private readonly string connectionString;
		private readonly string schemaAndTable;

		public ConnectionStringSchemaTableProvider(
			ILogger logger,
			IApplicationConfiguration applicationConfiguration)
		{
			this.logger = logger;
			this.applicationConfiguration = applicationConfiguration;
			this.connectionString = BuildConnectionString(); 
			this.schemaAndTable = GetSchemaAndTable();
		}
		public string ConnectionString => this.connectionString;

		public string SchemaAndTable => this.schemaAndTable;

		private string BuildConnectionString()
		{
			this.logger.Log(nameof(ConnectionStringSchemaTableProvider), "Generating connection string", LogLevel.Info);
			return new NpgsqlConnectionStringBuilder()
			{
				Host = this.applicationConfiguration.DatabaseConfiguration.Host,
				Username = this.applicationConfiguration.DatabaseConfiguration.Username,
				Password = this.applicationConfiguration.DatabaseConfiguration.Password,
				Database = this.applicationConfiguration.DatabaseConfiguration.Database,
				Port = this.applicationConfiguration.DatabaseConfiguration.Port,
			}.ToString();
		}

		private string GetSchemaAndTable()
		{
			this.logger.Log(nameof(ConnectionStringSchemaTableProvider), "Fetching schema and table configuration", LogLevel.Info);
			return applicationConfiguration.DatabaseConfiguration.SchemaAndTable;
		}
	}
}
