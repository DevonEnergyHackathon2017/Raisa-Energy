using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace FracMon.Classes
{
    public class WellStageDTO
    {
        public int Id { get; set; }
        public int Well { get; set; }
        public int Stage { get; set; }
        public int MaxDepth { get; set; }
        public int MinDepth { get; set; }
    }
}