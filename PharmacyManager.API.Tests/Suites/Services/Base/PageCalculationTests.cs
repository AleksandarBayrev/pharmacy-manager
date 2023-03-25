using FluentAssertions;
using PharmacyManager.API.Interfaces.Base;
using PharmacyManager.API.Models;
using PharmacyManager.API.Services.Base;
using PharmacyManager.API.Tests.Suites.Shared.Mocks;

namespace PharmacyManager.API.Tests.Suites.Services.Base
{
	internal class PageCalculationTests
	{
		[Test]
		public async Task CalculatesCorrectlyWithEvenNumbers()
		{
			ILogger logger = new LoggerMock();
			IPageCalculation<PageCalculations> pageCalculation = new PageCalculation(logger);
			var result = await pageCalculation.GetPageCalculations(5, 10);
			result.Should().BeEquivalentTo<PageCalculations>(new PageCalculations { ItemsPerPage = 5, Pages = 2 });
		}

		[Test]
		public async Task CalculatesCorrectlyWithOddNumbers()
		{
			ILogger logger = new LoggerMock();
			IPageCalculation<PageCalculations> pageCalculation = new PageCalculation(logger);
			var result = await pageCalculation.GetPageCalculations(5, 11);
			result.Should().BeEquivalentTo<PageCalculations>(new PageCalculations { ItemsPerPage = 5, Pages = 3 });
		}
	}
}
