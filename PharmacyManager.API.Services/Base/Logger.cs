using PharmacyManager.API.Interfaces.Base;

namespace PharmacyManager.API.Services.Base
{
    public class Logger : ILogger
    {
		private readonly IApplicationConfiguration applicationConfiguration;

		public Logger(IApplicationConfiguration applicationConfiguration)
        {
            this.applicationConfiguration = applicationConfiguration;
        }

        public async Task Log(string context, string message, LogLevel logLevel, CancellationToken? cancellationToken = null)
        {
            if ((cancellationToken.HasValue && cancellationToken.Value.IsCancellationRequested)
                || LogLevel.Check(logLevel, this.applicationConfiguration.MinLogLevel))
            {
                return;
            }
            await Console.Out.WriteLineAsync(BuildLog(context, message, logLevel));
        }

        private string BuildLog(string context, string message, LogLevel logLevel)
        {
            var currentTime = DateTime.Now.ToString("yyyy-MM-ddThh:mm:ss.fffZ");
			return $"[{currentTime}] ({logLevel}) <{context}>: {message}";
        }
    }
}
