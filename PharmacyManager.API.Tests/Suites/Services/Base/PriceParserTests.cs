using FluentAssertions;
using PharmacyManager.API.Interfaces.Base;
using PharmacyManager.API.Services.Base;
using PharmacyManager.API.Tests.Suites.Shared.Mocks;

namespace PharmacyManager.API.Tests.Suites.Services.Base
{
	internal class PriceParserTests
	{
		[Test]
		public async Task ParsesCorrectly()
		{
			ILogger logger = new LoggerMock();
			IPriceParser parser = new PriceParser(logger);
			var result = await parser.Parse("2.356");
			result.Should().Be(new decimal(2.36));
			var resultTwo = await parser.Parse("2.354");
			resultTwo.Should().Be(new decimal(2.35));
		}
	}
}
