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
            var logger = app.Services.GetService<Interfaces.Base.ILogger>();

            if (logger == null)
            {
                throw new NullReferenceException("Missing application logger!");
            }

            await logger.Log(nameof(Program), "Configuring application...");
            app.ConfigureApplication();
            await logger.Log(nameof(Program), "Starting application...");
            app.Run();
        }
    }
}