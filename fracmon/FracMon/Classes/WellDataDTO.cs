using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace FracMon.Controllers
{
    public class WellDataDTO
    {
        public int Id { get; set; }
        public int TimeInMinute { get; set; }
        public int Pressure { get; set; }
        public int SlurryRate { get; set; }
        public Decimal PropConcentration { get; set; }
        public Decimal BHCalcProb { get; set; }
        public Decimal FrictionReducer { get; set; }
        public Decimal ClayStay { get; set; }
        public Decimal Surfacant { get; set; }
        public Decimal Biocide { get; set; }
        public int WellId { get; set; }
        public int Stage { get; set; }
    }
}