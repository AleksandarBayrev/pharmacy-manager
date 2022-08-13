namespace PharmacyManager.API.Models.APIResponses
{
    public class MedicinesResponse
    {
        public IEnumerable<MedicineModel> Medicines { get; set; } = new List<MedicineModel>();
        public decimal Pages { get; set; }
    }
}
