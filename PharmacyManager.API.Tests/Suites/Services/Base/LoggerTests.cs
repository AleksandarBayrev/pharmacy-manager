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

				ILogger logger = new Logger(new ApplicationConfiguration(
					EnableSwagger: false,
					UseMocks: true,
					LogErrorsOnly: true,
					RelativeHtmlPath: "",
					new List<string>(),
					new List<string>()
				));
				await logger.Log("Test", "Test", LogLevel.Info);

				string expected = "<Test>: Test";
				sw.ToString().Should().Contain(expected);
			}
			
		}
	}
}
