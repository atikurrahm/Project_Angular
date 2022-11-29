using System.ComponentModel.DataAnnotations;

namespace WorkDotnetCore.ViewModels
{
    public class PaymentViewModel
    {
        public int PaymentId { get; set; }
       
        public DateTime StartDate { get; set; }
    
        public DateTime EndDate { get; set; }
       
        public bool PaymentDone { get; set; }
     
        public int CustomerID { get; set; }
        public string CustomerName { get; set; } = default!;
        public decimal TotalPayment { get; set; }
    }
}
