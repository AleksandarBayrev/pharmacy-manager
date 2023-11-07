using Microsoft.Extensions.Hosting;
using Npgsql;
using PharmacyManager.API.Interfaces.Base;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PharmacyManager.API.Services.Base
{
	public class ConnectionStringProvider : IConnectionStringProvider
	{
		private readonly ILogger logger;
		private readonly IApplicationConfiguration applicationConfiguration;
		private readonly string _connectionString;

		public ConnectionStringProvider(
			ILogger logger,
			IApplicationConfiguration applicationConfiguration)
		{
			this.logger = logger;
			this.applicationConfiguration = applicationConfiguration;
			this._connectionString = BuildConnectionString(); 
		}
		public string ConnectionString => _connectionString;

		private string BuildConnectionString()
		{
			this.logger.Log(nameof(ConnectionStringProvider), "Generating connection string", LogLevel.Info);
			return new NpgsqlConnectionStringBuilder()
			{
				Host = this.applicationConfiguration.DatabaseConfiguration.Host,
				Username = this.applicationConfiguration.DatabaseConfiguration.Username,
				Password = this.applicationConfiguration.DatabaseConfiguration.Password,
				Database = this.applicationConfiguration.DatabaseConfiguration.Database,
				Port = this.applicationConfiguration.DatabaseConfiguration.Port,
			}.ToString();
		}
	}
}
