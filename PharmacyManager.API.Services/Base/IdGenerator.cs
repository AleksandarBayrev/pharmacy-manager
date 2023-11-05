using PharmacyManager.API.Interfaces.Base;

namespace PharmacyManager.API.Services.Base
{
    public class IdGenerator : IIdGenerator
    {
        public string GenerateId()
        {
            return Guid.NewGuid().ToString();
        }
    }
}
