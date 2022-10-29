﻿namespace PharmacyManager.API.Interfaces.Base
{
    public interface ITranslationManager
    {
        public Task LoadDictionaries();
        public IDictionary<string, string> BG { get; }
        public IDictionary<string, string> EN { get; }
    }
}