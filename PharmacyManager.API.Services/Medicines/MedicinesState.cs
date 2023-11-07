using PharmacyManager.API.Interfaces.Medicines;
using PharmacyManager.API.Models;
using System.Collections.Concurrent;

namespace PharmacyManager.API.Services.Medicines
{
	public class MedicinesState : IMedicinesState<string, MedicineModel>
	{
		public ConcurrentDictionary<string, MedicineModel> Medicines { get; } = new ConcurrentDictionary<string, MedicineModel>();
	}
}
