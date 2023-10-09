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

        public Task Log(string context, string message, LogLevel logLevel, CancellationToken? cancellationToken = null)
        {
            return Task.Run(() =>
            {
                if ((cancellationToken.HasValue && cancellationToken.Value.IsCancellationRequested)
                    || (this.applicationConfiguration.LogErrorsOnly && logLevel != LogLevel.Error))
                {
                    return;
                }
                Console.WriteLine(BuildLog(context, message, logLevel));
            });
        }

        private string BuildLog(string context, string message, LogLevel logLevel)
        {
            var currentTime = DateTime.Now.ToString("yyyy-MM-ddThh:mm:ss.fffZ");
            return $"[{currentTime}] <{context}>: {message}";
        }
    }
}
