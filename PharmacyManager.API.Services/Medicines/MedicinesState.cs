using PharmacyManager.API.Extensions;
using PharmacyManager.API.Interfaces.Medicines;
using PharmacyManager.API.Models;
using System.Collections.Concurrent;

namespace PharmacyManager.API.Services.Medicines
{
	public class MedicinesState : IMedicinesState<string, MedicineModel>
	{
		private readonly ConcurrentDictionary<string, MedicineModel> medicines = new ConcurrentDictionary<string, MedicineModel>();
		public ConcurrentDictionary<string, MedicineModel> Medicines
		{
			get
			{
				return medicines.Where(x => !x.Value.Deleted).ToConcurrentDictionary(x => x.Key, x => x.Value);
			}
		}
		public ConcurrentDictionary<string, MedicineModel> DeletedMedicines
		{
			get
			{
				return medicines.Where(x => x.Value.Deleted).ToConcurrentDictionary(x => x.Key, x => x.Value);
			}
		}
		public void DeleteMedicine(string medicineId)
		{
			this.medicines[medicineId].Deleted = true;
		}
		public bool RemoveMedicine(string medicineId, out MedicineModel? medicine)
		{
			return this.medicines.Remove(medicineId, out medicine);
		}
		public bool TryAdd(string medicineId, MedicineModel medicine)
		{
			return this.medicines.TryAdd(medicineId, medicine);
		}
		public MedicineModel AddOrUpdate(string medicineId, MedicineModel medicine, Func<string, MedicineModel, MedicineModel> comparer)
		{
			return this.medicines.AddOrUpdate(medicineId, medicine, comparer);
		}
	}
}
