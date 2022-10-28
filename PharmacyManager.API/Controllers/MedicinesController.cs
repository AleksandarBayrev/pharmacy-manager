using MediatR;
using Microsoft.AspNetCore.Mvc;
using PharmacyManager.API.MediatRFeatures;
using PharmacyManager.API.Models;
using PharmacyManager.API.Models.APIResponses;

namespace PharmacyManager.API.Controllers
{
    [Route("/api/medicines")]
    [ApiController]
    public class MedicinesController : ControllerBase
    {
        private readonly IMediator mediator;

        public MedicinesController(IMediator mediator)
        {
            this.mediator = mediator;
        }

        [HttpPost("addMedicine")]
        public Task<MedicineModel> AddMedicine([FromBody] AddMedicineFeature.AddMedicineFeatureQuery request)
        {
            return this.mediator.Send(request);
        }

        [HttpPost("getAllMedicines")]
        public Task<MedicinesResponse> GetMedicines([FromBody] GetMedicinesFeature.GetMedicinesQuery request)
        {
            return this.mediator.Send(request);
        }

        [HttpPost("getInitialPageCalculations")]
        public Task<PageCalculations> GetInitalPageCalculations([FromBody] GetPageCalculations.GetPageCalculationsQuery request)
        {
            return this.mediator.Send(request);
        }
    }
}
