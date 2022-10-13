using MediatR;
using Microsoft.AspNetCore.Mvc;
using PharmacyManager.API.MediatRFeatures;
using PharmacyManager.API.Models;
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

        [HttpPost("addMedicine")]
        public Task<MedicineModel> AddMedicine([FromBody] AddMedicineRequest request)
        {
            return mediator.Send(new AddMedicineFeature.Query
            {
                Name = request.Name,
                Manufacturer = request.Manufacturer,
                Description = request.Description
            });
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

        [HttpPost("getInitialPageCalculations")]
        public Task<PageCalculations> GetInitalPageCalculations([FromBody] GetPageCalculations.Query request)
        {
            return this.mediator.Send(request);
        }
    }
}
