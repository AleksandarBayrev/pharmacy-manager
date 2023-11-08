using PharmacyManager.API.Interfaces.Base;

namespace PharmacyManager.API.Services.Base
{
	public class DateFormatter : IDateFormatter
	{
		private readonly IApplicationConfiguration applicationConfiguration;

		public DateFormatter(IApplicationConfiguration applicationConfiguration)
		{
			this.applicationConfiguration = applicationConfiguration;
		}
		public string FormatDate(DateTime date)
		{
			return date.ToString(applicationConfiguration.PreferredDateFormatForRecords);
		}
	}
}
