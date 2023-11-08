using PharmacyManager.API.Extensions;
using PharmacyManager.API.Interfaces.Medicines;
using PharmacyManager.API.Models;
using System.Collections.Concurrent;

namespace PharmacyManager.API.Services.Medicines
{
	public class MedicinesState : IMedicinesState<string, MedicineModel>
	{
		private readonly ConcurrentDictionary<string, MedicineModel> deletedMedicines = new ConcurrentDictionary<string, MedicineModel>();
		private readonly ConcurrentDictionary<string, MedicineModel> medicines = new ConcurrentDictionary<string, MedicineModel>();

		public IReadOnlyDictionary<string, MedicineModel> Medicines => medicines;
		public IReadOnlyDictionary<string, MedicineModel> DeletedMedicines => deletedMedicines;

		public void DeleteMedicine(string medicineId)
		{
			this.medicines[medicineId].Deleted = true;
			this.deletedMedicines.TryAdd(medicineId, this.medicines[medicineId]);
		}
		public bool RemoveMedicine(string medicineId, out MedicineModel? medicine)
		{
			var isRemovedMain = this.medicines.TryRemove(medicineId, out _);
			var isRemovedDeleted = this.deletedMedicines.TryRemove(medicineId, out medicine);
			return isRemovedDeleted && isRemovedMain;
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
