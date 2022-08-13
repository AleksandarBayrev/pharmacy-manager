using MediatR;
using Microsoft.AspNetCore.Mvc;
using PharmacyManager.API.MediatRFeatures;
using PharmacyManager.API.Models.APIRequests;
using PharmacyManager.API.Models.APIResponses;

namespace PharmacyManager.API.Controllers
{
    [Route("api/medicines")]
    [ApiController]
    public class MedicinesController : ControllerBase
    {
        private readonly IMediator mediator;

        public MedicinesController(IMediator mediator)
        {
            this.mediator = mediator;
        }

        [HttpPost("getAllMedicines")]
        public Task<MedicinesResponse> GetMedicines([FromBody] GetMedicinesRequest request)
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
