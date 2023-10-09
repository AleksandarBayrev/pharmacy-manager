namespace PharmacyManager.API.Interfaces.Base
{
    public interface ILogger
    {
        public Task Log(string context, string message, LogLevel logLevel, CancellationToken? cancellationToken = null);
    }
}
