using System.Collections.Concurrent;

namespace PharmacyManager.API.Interfaces.Medicines
{
	public interface IMedicinesState<TKey, TValue> where TKey : notnull
	{
		ConcurrentDictionary<TKey, TValue> Medicines { get; }
		ConcurrentDictionary<TKey, TValue> DeletedMedicines { get; }
		public bool TryAdd(TKey medicineId, TValue medicine);
		public TValue AddOrUpdate(TKey key, TValue medicine, Func<TKey, TValue, TValue> comparer);
		void DeleteMedicine(TKey medicineId);
		public bool RemoveMedicine(TKey medicineId, out TValue? medicine);
	}
}
