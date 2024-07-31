namespace PharmacyManager.API.Interfaces.Base
{
    public static class LogLevelParser
	{
		static LogLevelParser()
		{
			_logLevelMapping = BuildLogLevelMapping();
		}

		public static bool Check(LogLevel logLevel, string minLogLevel)
		{
			var logLevelAsString = Enum.GetName(logLevel);
			return logLevelAsString != null
				&& _logLevelMapping.ContainsKey(logLevelAsString)
				&& _logLevelMapping.ContainsKey(minLogLevel)
				&& _logLevelMapping[logLevelAsString] >= _logLevelMapping[minLogLevel];
		}
		public static readonly string Error = nameof(Error);
		public static readonly string Information = nameof(Information);
		public static readonly string Warning = nameof(Warning);

		private static readonly IDictionary<string, LogLevel> _logLevelMapping;

		private static IDictionary<string, LogLevel> BuildLogLevelMapping()
		{
			var mapping = new Dictionary<string, LogLevel>
            {
                { Information, LogLevel.Information },
                { Warning, LogLevel.Warning },
                { Error, LogLevel.Error }
            };
			return mapping;
		}

	}
	public enum LogLevel
	{
		Information = 0,
		Warning = 1,
		Error = 2
	}
}
