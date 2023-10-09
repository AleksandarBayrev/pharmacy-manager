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
                UseMocks: true,
                LogErrorsOnly: false,
                RelativeHtmlPath: "",
                Dictionaries: Enumerable.Empty<string>(),
                DictionaryValidationKeys: Enumerable.Empty<string>());

            applicationConfiguration.EnableSwagger.Should().Be(true);
            applicationConfiguration.UseMocks.Should().Be(true);
            applicationConfiguration.RelativeHtmlPath.Should().Be("");
            applicationConfiguration.Dictionaries.Count().Should().Be(0);
            applicationConfiguration.DictionaryValidationKeys.Count().Should().Be(0);
		}
    }
}