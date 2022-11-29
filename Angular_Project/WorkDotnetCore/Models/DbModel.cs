using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Reflection.Emit;
using System.Xml.Linq;
using Microsoft.EntityFrameworkCore;

namespace WorkDotnetCore.Models
{
    public enum Gender { Male = 1, Female }
    public class Customer
    {
        public int CustomerID { get; set; }
        [Required, StringLength(50), Display(Name = "Customer Name")]
        public string CustomerName { get; set; } = default!;
        [Required, StringLength(150)]
        public string Address { get; set; } = default!;
        [Required, StringLength(50)]
        public string Email { get; set; } = default!;
        public virtual ICollection<Payment> Payments { get; set; } = new List<Payment>();
    }
    public class Payment
    {
        public int PaymentId { get; set; }
        [Required, Column(TypeName = "date"),
        Display(Name = "Start Date"),
        DisplayFormat(DataFormatString = "{0:yyyy-MM-dd}",
        ApplyFormatInEditMode = true)]
        public DateTime StartDate { get; set; }
        [Required, Column(TypeName = "date"),
        Display(Name = "End Date"),
        DisplayFormat(DataFormatString = "{0:yyyy-MM-dd}",
        ApplyFormatInEditMode = true)]
        public DateTime EndDate { get; set; }
        
        
        public bool PaymentDone { get; set; }
        [Required, ForeignKey("Customer")]
        public int CustomerID { get; set; }
        public Customer Customer { get; set; } = default!;
        public virtual ICollection<Work> Works { get; set; } = new List<Work>();
    }
    public class Work
    {
        [ForeignKey("Payment")]
        public int PaymentId { get; set; }
        [ForeignKey("Worker")]
        public int WorkerId { get; set; }
        [Required]
        public int TotalWorkHour { get; set; }

        public virtual Payment Payment { get; set; } = default!;
        public virtual Worker Worker { get; set; } = default!;


    }
    public class Worker
    {
        public int WorkerId { get; set; }
        [Required, StringLength(50), Display(Name = "Worker Name")]
        public string WorkerName { get; set; } = default!;
        [Required, EnumDataType(typeof(Gender))]
        public Gender Gender { get; set; }
        [Required, StringLength(150)]
        public string Picture { get; set; } = default!;
        [Required, StringLength(50)]
        public string Phone { get; set; } = default!;
        [Required, Column(TypeName = "money"), DisplayFormat(DataFormatString = "{0:0.00}")]
        public decimal Payrate { get; set; }
        public virtual ICollection<Work> Works { get; set; } = new List<Work>();


    }
    
    public class WorkerDbContext : DbContext
    {
        public WorkerDbContext(DbContextOptions<WorkerDbContext> options) : base(options) { }
        public DbSet<Customer> Customers { get; set; } = default!;
        public DbSet<Worker> Workers { get; set; } = default!;
        public DbSet<Work> Works { get; set; } = default!;
        public DbSet<Payment> Payments { get; set; } = default!;
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Work>().HasKey(o => new { o.WorkerId, o.PaymentId });
        }
    }
}
