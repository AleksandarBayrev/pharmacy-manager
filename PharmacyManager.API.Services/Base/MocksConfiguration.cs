using PharmacyManager.API.Interfaces.Base;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PharmacyManager.API.Services.Base
{
	public class MocksConfiguration : IMocksConfiguration
	{
		public MocksConfiguration(
			bool Use,
			int GeneratedNumberOfPharmacies)
		{
			this.Use = Use;
			this.GeneratedNumberOfPharmacies = GeneratedNumberOfPharmacies;
		}
		public bool Use { get; private set; }

		public int GeneratedNumberOfPharmacies { get; private set; }
	}
}
