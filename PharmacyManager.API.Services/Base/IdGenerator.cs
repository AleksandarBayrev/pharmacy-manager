using PharmacyManager.API.Interfaces.Base;

namespace PharmacyManager.API.Services.Base
{
    public class IdGenerator : IIdGenerator
    {
        public string GenerateId()
        {
            return $"{GenerateIdWithoutDashes()}{GenerateIdWithoutDashes()}";
        }

        private string GenerateIdWithoutDashes()
        {
            return Guid.NewGuid().ToString().Replace("-", "").Replace("{", "").Replace("}", "");
        }
    }
}
