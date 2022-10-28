using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PharmacyManager.API.Interfaces.Medicines
{
    public interface IMedicinesFilter<TMedicineRequest, TMedicineModel>
    {
        public Task<IEnumerable<TMedicineModel>> ApplyFilters(TMedicineRequest request, IEnumerable<TMedicineModel> medicines);
    }
}
