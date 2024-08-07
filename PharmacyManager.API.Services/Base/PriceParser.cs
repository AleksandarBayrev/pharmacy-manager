﻿using PharmacyManager.API.Interfaces.Base;
using System.Globalization;

namespace PharmacyManager.API.Services.Base
{
    public class PriceParser : IPriceParser
    {
        private readonly ILogger logger;

        public PriceParser(ILogger logger)
        {
            this.logger = logger;
		}

		public async Task<decimal> Parse(string priceAsString)
		{
			await this.logger.Log(nameof(PriceParser), $"Parsing price as string {priceAsString} to decimal", LogLevel.Information);
			return Math.Round(decimal.Parse(priceAsString, CultureInfo.InvariantCulture), 2, MidpointRounding.AwayFromZero);
		}

		public async Task<string> Parse(decimal priceAsDecimal)
		{
			var priceAsString = priceAsDecimal.ToString(CultureInfo.InvariantCulture);
			await this.logger.Log(nameof(PriceParser), $"Parsing price as decimal {priceAsString} to string", LogLevel.Information);
			return Math.Round(decimal.Parse(priceAsString, CultureInfo.InvariantCulture), 2, MidpointRounding.AwayFromZero).ToString(CultureInfo.InvariantCulture);
		}
	}
}
