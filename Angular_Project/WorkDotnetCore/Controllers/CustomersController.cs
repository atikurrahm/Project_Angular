using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WorkDotnetCore.Models;
using WorkDotnetCore.Repositories.Interfaces;
using WorkDotnetCore.ViewModels;

namespace WorkDotnetCore.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CustomersController : ControllerBase
    {
        IUnitOfWork unitOfWork;
        IGenericRepo<Customer> repo;
        public CustomersController(IUnitOfWork unitOfWork)
        {
            this.unitOfWork = unitOfWork;
            this.repo = this.unitOfWork.GetRepo<Customer>();
        }
        // GET: api/Customers
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Customer>>> GetCustomers()
        {
            var data = await this.repo.GetAllAsync();
            return data.ToList();
        }
        [HttpGet("VM")]
        public async Task<ActionResult<IEnumerable<CustomerViewModel>>> GetCustomerViewModels()
        {
            var data = await this.repo.GetAllAsync(x => x.Include(c => c.Payments));
            return data.Select(c => new CustomerViewModel
            {
                CustomerID = c.CustomerID,
                CustomerName = c.CustomerName,
                Address = c.Address,
                Email = c.Email,
                CanDelete = c.Payments.Count == 0
            }).ToList();
        }
        /// to get all customers with order entries
        [HttpGet("WithWorkers")]
        public async Task<ActionResult<IEnumerable<Customer>>> GetCustomerWithWorkers()
        {
            var data = await this.repo.GetAllAsync(x => x.Include(c => c.Payments));
            return data.ToList();
        }

        // GET: api/Customers/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Customer>> GetCustomer(int id)
        {
            var customer = await this.repo.GetAsync(c => c.CustomerID == id);

            if (customer == null)
            {
                return NotFound();
            }

            return customer;
        }

        /// to get single customer with order entries
        /////////////////////////////////////////////
        [HttpGet("{id}/WithOrders")]
        public async Task<ActionResult<Customer>> GetCustomerWithOrders(int id)
        {
            var customer = await this.repo.GetAsync(c => c.CustomerID == id, x => x.Include(c => c.Payments));

            if (customer == null)
            {
                return NotFound();
            }

            return customer;
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> PutCustomer(int id, Customer customer)
        {
            if (id != customer.CustomerID)
            {
                return BadRequest();
            }

            await this.repo.UpdateAsync(customer);

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

        // POST: api/Customers
       
        [HttpPost]
        public async Task<ActionResult<Customer>> PostCustomer(Customer customer)
        {
            await this.repo.AddAsync(customer);
            await unitOfWork.CompleteAsync();

            return customer;
        }

        // DELETE: api/Customers/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCustomer(int id)
        {
            var customer = await repo.GetAsync(c => c.CustomerID == id);
            if (customer == null)
            {
                return NotFound();
            }

            await this.repo.DeleteAsync(customer);
            await unitOfWork.CompleteAsync();

            return NoContent();
        }
    }
}
