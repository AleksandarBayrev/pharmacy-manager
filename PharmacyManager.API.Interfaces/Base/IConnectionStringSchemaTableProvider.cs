namespace PharmacyManager.API.Interfaces.Base
{
	public interface IConnectionStringSchemaTableProvider
	{
		string ConnectionString { get; }
		string SchemaAndTable { get; }
	}
}
