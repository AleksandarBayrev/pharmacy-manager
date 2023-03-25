using FluentAssertions;
using PharmacyManager.API.Interfaces.Base;
using PharmacyManager.API.Services.Base;

namespace PharmacyManager.API.Tests.Suites.Services.Base
{
	internal class LoggerTests
	{
		[Test]
		public async Task LogsToConsole()
		{
			using (StringWriter sw = new StringWriter())
			{
				Console.SetOut(sw);

				ILogger logger = new Logger();
				await logger.Log("Test", "Test");

				string expected = "<Test>: Test";
				sw.ToString().Should().Contain(expected);
			}
			
		}
	}
}
