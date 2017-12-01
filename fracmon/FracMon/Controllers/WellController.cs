using FracMon.Classes;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Text;
using System.Web.Http;

namespace FracMon.Controllers
{
    public class WellController : ApiController
    {
        [HttpGet]
        [Route("api/wells/")]
        public IHttpActionResult GetWells()
        {
            List<WellDTO> wells = new List<WellDTO>();
            using (SqlConnection connection = new SqlConnection(System.Web.Configuration.WebConfigurationManager.ConnectionStrings["fracdatasource"].ConnectionString))
            {
                //SqlCommand command = new SqlCommand("select * from well inner join welldata on well.id = welldata.id", connection);
                SqlCommand command = new SqlCommand("select * from well;", connection);
                connection.Open();
                SqlDataReader reader = command.ExecuteReader();
                try
                {
                    while (reader.Read())
                    {
                        WellDTO newWell = new WellDTO() { Id = int.Parse(reader["Id"].ToString()), Name = reader["Name"].ToString() };
                        wells.Add(newWell);
                    }
                }
                finally
                {
                    // Always call Close when done reading.
                    reader.Close();
                }
            }

            return Ok(wells);
        }

        [HttpGet]
        [Route("api/wells/{currentWell}/stages")]
        public IHttpActionResult GetWellStages([FromUri] int currentWell)
        {
            List<WellStageDTO> wellStages = new List<WellStageDTO>();
            using (SqlConnection connection = new SqlConnection(System.Web.Configuration.WebConfigurationManager.ConnectionStrings["fracdatasource"].ConnectionString))
            {
                String sqlQuery = String.Format("Select * from stage where well = {0}", currentWell);
                SqlCommand command = new SqlCommand(sqlQuery, connection);
                connection.Open();
                SqlDataReader reader = command.ExecuteReader();
                try
                {
                    while (reader.Read())
                    {
                        WellStageDTO newWell = new WellStageDTO()
                        {
                            Id = int.Parse(reader["id"].ToString()),
                            Well = int.Parse(reader["well"].ToString()),
                            Stage = int.Parse(reader["stage"].ToString()),
                            MaxDepth = int.Parse(reader["max_depth"].ToString()),
                            MinDepth = int.Parse(reader["min_depth"].ToString())
                        };
                        wellStages.Add(newWell);
                    }
                }
                finally
                {
                    // Always call Close when done reading.
                    reader.Close();
                }
            }

            return Ok(wellStages);
        }

        [HttpGet]
        [Route("api/wells/{currentWell}/{currentItem}")]
        public IHttpActionResult GetWellNextDataPoint([FromUri] int currentWell, [FromUri] int currentItem)
        {
            WellDataDTO newWellData = null;
            using (SqlConnection connection = new SqlConnection(System.Web.Configuration.WebConfigurationManager.ConnectionStrings["fracdatasource"].ConnectionString))
            {
                //SqlCommand command = new SqlCommand("select * from well inner join welldata on well.id = welldata.id", connection);
                String sqlQuery = String.Format("select *, welldata.id as wellDataId from well inner join welldata on well.id = welldata.well where well.Id = {0} and welldata.id > {1} order by welldata.id", currentWell, currentItem);
                SqlCommand command = new SqlCommand(sqlQuery, connection);
                connection.Open();
                SqlDataReader reader = command.ExecuteReader();
                try
                {
                    if (reader.Read())
                    {
                        newWellData = new WellDataDTO()
                        {
                            TimeInMinute = int.Parse(reader["time_in_minute"].ToString()),
                            Pressure = int.Parse(reader["pressure"].ToString()),
                            SlurryRate = int.Parse(reader["slurry_rate"].ToString()),
                            PropConcentration = Decimal.Parse(reader["prop_concentration"].ToString()),
                            BHCalcProb = Decimal.Parse(reader["bh_calc_prob"].ToString()),
                            FrictionReducer = Decimal.Parse(reader["friction_reducer"].ToString()),
                            ClayStay = Decimal.Parse(reader["clay_stay"].ToString()),
                            WellId = int.Parse(reader["well"].ToString()),
                            Surfacant = Decimal.Parse(reader["surfacant"].ToString()),
                            Biocide = Decimal.Parse(reader["biocide"].ToString()),
                            Id = int.Parse(reader["wellDataId"].ToString())
                        };

                        if (reader["stage"] == null)
                            newWellData.Stage = -1;
                        else
                        {
                            String s = (reader["stage"] == null) ? "-1" : reader["stage"].ToString();
                            if (s.Length == 0)
                                newWellData.Stage = -1;
                            else
                                newWellData.Stage = int.Parse(s);
                        }
                    }
                }
                finally
                {
                    // Always call Close when done reading.
                    reader.Close();
                }
            }

            return Ok(newWellData);
        }
    }
}
