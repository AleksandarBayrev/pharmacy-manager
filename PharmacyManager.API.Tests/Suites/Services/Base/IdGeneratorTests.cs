using FluentAssertions;
using PharmacyManager.API.Interfaces.Base;
using PharmacyManager.API.Services.Base;

namespace PharmacyManager.API.Tests.Suites.Services.Base
{
	internal class IdGeneratorTests
	{
		[Test]
		public void GeneratesId()
		{
			IIdGenerator idGenerator = new IdGenerator();
			idGenerator.GenerateId().Should().NotContain("{");
			idGenerator.GenerateId().Should().NotContain("}");
			idGenerator.GenerateId().Should().NotContain("-");
		}
	}
}
