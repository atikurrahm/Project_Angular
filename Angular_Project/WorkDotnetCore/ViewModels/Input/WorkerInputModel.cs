using Microsoft.EntityFrameworkCore.Metadata.Internal;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Xml.Linq;
using WorkDotnetCore.Models;

namespace WorkDotnetCore.ViewModels.Input
{
    public class WorkerInputModel
    {
        public int WorkerId { get; set; }
        [Required, StringLength(50), Display(Name = "Worker Name")]
        public string WorkerName { get; set; } = default!;
        [Required, EnumDataType(typeof(Gender))]
        public Gender Gender { get; set; }
        [Required, StringLength(50)]
        public string Phone { get; set; } = default!;
        [Required, Column(TypeName = "money"), DisplayFormat(DataFormatString = "{0:0.00}")]
        public decimal Payrate { get; set; }
        public virtual ICollection<Work> Works { get; set; } = new List<Work>();
    }
}
