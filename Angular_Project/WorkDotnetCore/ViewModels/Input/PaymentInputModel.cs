using Microsoft.EntityFrameworkCore.Metadata.Internal;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Xml.Linq;
using WorkDotnetCore.Models;

namespace WorkDotnetCore.ViewModels.Input
{
    public class PaymentInputModel
    {
        [Required]
        public int PaymentId { get; set; }
        [Required,DataType(DataType.Date)]
        public DateTime StartDate { get; set; }
        [DataType(DataType.Date)]
        public DateTime EndDate { get; set; }
        public bool PaymentDone { get; set; }
        [Required]
        public int CustomerID { get; set; }
        public List<Work> Works { get; }
    }
}
