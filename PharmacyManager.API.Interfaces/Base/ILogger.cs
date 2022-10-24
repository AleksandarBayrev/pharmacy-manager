namespace PharmacyManager.API.Interfaces.Base
{
    public interface ILogger
    {
        public Task Log(string context, string message, CancellationToken? cancellationToken = null);
    }
}
