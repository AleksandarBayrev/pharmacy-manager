using PharmacyManager.API.Interfaces.Base;

namespace PharmacyManager.API.Services.Base
{
    public class Logger : ILogger
    {
        public Task Log(string context, string message)
        {
            return Task.Run(() =>
            {
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
