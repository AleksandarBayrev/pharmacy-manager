using PharmacyManager.API.Extensions;

namespace PharmacyManager.API
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = ConfigureBuilder(args);
            ConfigureAndStartApplication(builder).GetAwaiter().GetResult();
        }

        private static WebApplicationBuilder ConfigureBuilder(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);
            builder.AddServices();
            return builder;
        }

        private static async Task ConfigureAndStartApplication(WebApplicationBuilder builder)
        {
            var app = builder.Build();
            var logger = app.Services.GetRequiredService<Interfaces.Base.ILogger>();

            await logger.Log(nameof(Program), "Configuring application...", Interfaces.Base.LogLevel.Info);
            await app.ConfigureApplication();
            await logger.Log(nameof(Program), "Starting application...", Interfaces.Base.LogLevel.Info);
            app.Run();
        }
    }
}