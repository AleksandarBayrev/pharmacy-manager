﻿using PharmacyManager.API.Interfaces.Base;

namespace PharmacyManager.API.Tests.Suites.Shared.Mocks
{
    internal class LoggerMock : ILogger
    {
        public Task Log(string context, string message, CancellationToken? cancellationToken = null)
        {
            return Task.CompletedTask;
        }
    }
}
