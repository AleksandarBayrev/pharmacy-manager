using PharmacyManager.API.Interfaces.Base;

namespace PharmacyManager.API.Services.Base
{
    public class Logger : ILogger
    {
        public Task Log(string context, string message, CancellationToken? cancellationToken = null)
        {
            return Task.Run(() =>
            {
                if (cancellationToken.HasValue && cancellationToken.Value.IsCancellationRequested)
                {
                    return;
                }
                Console.WriteLine(BuildLog(context, message));
            });
        }

        private string BuildLog(string context, string message)
        {
            var currentTime = DateTime.Now.ToString("yyyy-MM-ddThh:mm:ss.fffZ");
            return $"[{currentTime}] <{context}>: {message}";
        }
    }
}
