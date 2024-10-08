﻿using FluentAssertions;
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
					new MocksConfiguration(true, 1000),
					MinLogLevel: "Information",
					RelativeHtmlPath: "",
					new List<string>(),
					new List<string>(),
					new DatabaseConfiguration(),
					"yyyy-MM-ddTHH:mm:ss.fffZ"
				));
				await logger.Log("Test", "Test", LogLevel.Information);

				string expected = "<Test>: Test";
				sw.ToString().Should().Contain(expected);
			}
			
		}
	}
}
