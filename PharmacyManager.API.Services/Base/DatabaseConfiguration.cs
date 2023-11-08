using PharmacyManager.API.Interfaces.Base;

namespace PharmacyManager.API.Services.Base
{
	public class DatabaseConfiguration : IDatabaseConfiguration
	{
		public string Host { get; set; }
		public string Username { get; set; }
		public string Password { get; set ; }
		public int Port { get; set; }
		public string Database { get; set; }
		public string SchemaAndTable { get; set; }
	}
}
