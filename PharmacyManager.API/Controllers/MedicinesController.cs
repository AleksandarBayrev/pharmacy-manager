using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using PharmacyManager.API.MediatRFeatures;
using PharmacyManager.API.Models;
using PharmacyManager.API.Models.APIRequests;

namespace PharmacyManager.API.Controllers
{
    [Route("api/pharmacy")]
    [ApiController]
    public class MedicinesController : ControllerBase
    {
        private readonly IMediator mediator;

        public MedicinesController(IMediator mediator)
        {
            this.mediator = mediator;
        }

        [HttpPost("getAllMedicines")]
        public Task<IList<MedicineModel>> GetMedicines([FromBody] GetMedicinesRequest request)
        {
            return this.mediator.Send(new GetMedicinesFeature.Query
            {
                AvailableOnly = request.AvailableOnly,
                NotExpired = request.NotExpired,
                Manufacturer = request.Manufacturer,
                ItemsPerPage = request.ItemsPerPage,
                Page = request.Page
            });
        }
    }
}
