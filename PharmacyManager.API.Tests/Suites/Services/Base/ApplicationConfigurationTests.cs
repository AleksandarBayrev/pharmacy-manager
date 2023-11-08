using FluentAssertions;
using PharmacyManager.API.Interfaces.Base;
using PharmacyManager.API.Services.Base;

namespace PharmacyManager.API.Tests.Suites.Services.Base
{
    internal class ApplicationConfigurationTests
	{
        [Test]
        public void BuildsCorrectConfiguration()
        {
            IApplicationConfiguration applicationConfiguration = new ApplicationConfiguration(
                EnableSwagger: true,
                new MocksConfiguration(true, 1000),
                LogErrorsOnly: false,
                RelativeHtmlPath: "",
                Dictionaries: Enumerable.Empty<string>(),
                DictionaryValidationKeys: Enumerable.Empty<string>(),
                DatabaseConfiguration: new DatabaseConfiguration(),
                PreferredDateFormatForRecords: "my-date-format");

            applicationConfiguration.EnableSwagger.Should().Be(true);
			applicationConfiguration.Mocks.Use.Should().Be(true);
			applicationConfiguration.Mocks.GeneratedNumberOfPharmacies.Should().Be(1000);
			applicationConfiguration.RelativeHtmlPath.Should().Be("");
            applicationConfiguration.Dictionaries.Count().Should().Be(0);
			applicationConfiguration.DictionaryValidationKeys.Count().Should().Be(0);
			applicationConfiguration.DatabaseConfiguration.Host.Should().Be(null);
			applicationConfiguration.DatabaseConfiguration.Username.Should().Be(null);
			applicationConfiguration.DatabaseConfiguration.Password.Should().Be(null);
			applicationConfiguration.DatabaseConfiguration.Database.Should().Be(null);
			applicationConfiguration.DatabaseConfiguration.Port.Should().Be(0);
            applicationConfiguration.PreferredDateFormatForRecords.Should().Be("my-date-format");
		}
    }
}