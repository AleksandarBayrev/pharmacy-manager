namespace PharmacyManager.API.Models.APIResponses
{
    public class MedicinesResponse
    {
        public IEnumerable<MedicineFrontendModel> Medicines { get; set; } = new List<MedicineFrontendModel>();
        public decimal Pages { get; set; }
		public int TotalFilteredCount { get; set; }
		public int TotalCount { get; set; }
    }
}
