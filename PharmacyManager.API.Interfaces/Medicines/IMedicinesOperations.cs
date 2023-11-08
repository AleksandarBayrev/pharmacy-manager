namespace PharmacyManager.API.Interfaces.Medicines
{
	public interface IMedicinesOperations<TKey> where TKey : notnull
	{
		Task AddMedicineToDB(TKey medicineId);
		Task UpdateMedicineInDB(TKey medicineId);
		Task DeleteMedicineInDB(TKey medicineId);
	}
}
