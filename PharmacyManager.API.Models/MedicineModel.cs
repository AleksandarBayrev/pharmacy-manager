namespace PharmacyManager.API.Models
{
	public class MedicineModel
    {
        public string Id { get; set; }
        public string Manufacturer { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public DateTime ManufacturingDate { get; set; }
        public DateTime ExpirationDate { get; set; }
        public decimal Price { get; set; }
        public long Quantity { get; set; }
        public bool Deleted { get; set; }
    }
}