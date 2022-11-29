using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;
using WorkDotnetCore.Models;
using WorkDotnetCore.Repositories.Interfaces;
using WorkDotnetCore.ViewModels;

namespace WorkDotnetCore.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PaymentsController : ControllerBase
    {
        private readonly IUnitOfWork unitOfWork;
        private readonly IGenericRepo<Payment> repo;

        public PaymentsController(IUnitOfWork unitOfWork)
        {
            this.unitOfWork = unitOfWork;
            this.repo=this.unitOfWork.GetRepo<Payment>();
        }

        // GET: api/Payments
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Payment>>> GetPayments()
        {
            var data=await this.repo.GetAllAsync();
            return data.ToList();
        }
        [HttpGet("VM")]
        public async Task<ActionResult<IEnumerable<PaymentViewModel>>> GetPaymentVMs()
        {
            var data = await this.repo.GetAllAsync(x=>x.Include(o=>o.Works).ThenInclude(oi=>oi.Worker)
                                                        .Include(o=>o.Customer));
            return data.Select(o=> new PaymentViewModel
            {
                PaymentId=o.PaymentId,
                CustomerID=o.CustomerID,
                StartDate=o.StartDate,
                EndDate=o.EndDate,
                
                PaymentDone=o.PaymentDone,
                CustomerName=o.Customer.CustomerName,
                TotalPayment=o.Works.Sum(oi=>oi.TotalWorkHour*oi.Worker.Payrate)
            })
                .ToList();
        }
        // GET: api/Payments/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Payment>> GetPayment(int id)
        {
            var payment = await this.repo.GetAsync(o=>o.PaymentId==id);

            if (payment == null)
            {
                return NotFound();
            }

            return payment;
        }
        [HttpGet("{id}/OI")]
        public async Task<ActionResult<Payment>> GetPaymentWithWorks(int id)
        {
            var payment = await this.repo.GetAsync(o => o.PaymentId == id, x => x.Include(o => o.Works).ThenInclude(oi => oi.Worker)
                                                                            .Include(o => o.Customer));

            if (payment == null)
            {
                return NotFound();
            }

            return payment;
        }
        // PUT: api/Payments/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutPayment(int id, Payment payment)
        {
            if (id != payment.PaymentId)
            {
                return BadRequest();
            }

            await this.repo.UpdateAsync(payment);

            try
            {
                await this.unitOfWork.CompleteAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                throw;
            }

            return NoContent();
        }

        // POST: api/Payments
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<Payment>> PostPayment(Payment payment)
        {
            await this.repo.AddAsync(payment);
            await this.unitOfWork.CompleteAsync();

            return payment;
        }

        // DELETE: api/Payments/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePayment(int id)
        {
            var payment = await this.repo.GetAsync(o=>o.PaymentId==id);
            if (payment == null)
            {
                return NotFound();
            }

            await this.repo.DeleteAsync(payment);
            await this.unitOfWork.CompleteAsync();

            return NoContent();
        }
    }
}
