namespace PharmacyManager.API.Models
{
    public class MedicineRequest
    {
        public bool AvailableOnly { get; init; }
        public bool NotExpired { get; init; }
        public string Manufacturer { get; init; }
        public int Page { get; init; }
        public int ItemsPerPage { get; init; }
    }
}
