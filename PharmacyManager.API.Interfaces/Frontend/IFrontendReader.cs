namespace PharmacyManager.API.Interfaces.Frontend
{
    public interface IFrontendReader
    {
        public Task<string> ReadHTML(string path);
        public Task<bool> ReloadHTML(string path);
    }
}
