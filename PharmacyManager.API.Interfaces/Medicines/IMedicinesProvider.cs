namespace PharmacyManager.API.Interfaces.Medicines
{
    public interface IMedicinesProvider<TMedicineModel>
    {
        public IEnumerable<TMedicineModel> Medicines { get; }
    }
}
