namespace PharmacyManager.API.Models.APIRequests
{
    public class GetMedicinesRequest
    {
        public bool AvailableOnly { get; set; }
        public bool NotExpired { get; set; }
        public string Manufacturer { get; set; } = "";
        public int ItemsPerPage { get; set; } = 50;
        public int Page { get; set; } = 1;
    }
}
