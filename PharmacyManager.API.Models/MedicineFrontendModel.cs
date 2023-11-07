namespace PharmacyManager.API.Models
{
	public class MedicineFrontendModel
	{
		public string Id { get; set; }
		public string Manufacturer { get; set; }
		public string Name { get; set; }
		public string Description { get; set; }
		public DateTime ManufacturingDate { get; set; }
		public DateTime ExpirationDate { get; set; }
		public string Price { get; set; }
		public long Quantity { get; set; }
	}
}
