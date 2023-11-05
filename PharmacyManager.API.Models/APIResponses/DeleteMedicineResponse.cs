using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PharmacyManager.API.Models.APIResponses
{
	public class DeleteMedicineResponse
	{
		public string MedicineId { get; set; }
		public bool Deleted { get; set; }
	}
}
