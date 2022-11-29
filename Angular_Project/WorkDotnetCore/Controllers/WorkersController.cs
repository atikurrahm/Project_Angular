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
using WorkDotnetCore.ViewModels.Input;

namespace WorkDotnetCore.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class WorkersController : ControllerBase
    {
        private IWebHostEnvironment env;
        IUnitOfWork unitOfWork;
        IGenericRepo<Worker> repo;

        public WorkersController(IUnitOfWork UnitOfWork, IWebHostEnvironment env)
        {
            this.unitOfWork = UnitOfWork;
            this.repo=this.unitOfWork.GetRepo<Worker>();
            this.env = env;
        }

        // GET: api/Workers
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Worker>>> GetWorkers()
        {
            var data = await this.repo.GetAllAsync();
            return data.ToList();
        }
        [HttpGet("VM")]
        public async Task<ActionResult<IEnumerable<WorkerViewModel>>> GetWorkerViewModels()
        {
            var data = await this.repo.GetAllAsync(p => p.Include(x => x.Works));
            return data.ToList().Select(p => new WorkerViewModel
            {
                WorkerId = p.WorkerId,
                WorkerName = p.WorkerName,
                Gender = p.Gender,
                Phone = p.Phone,
                Payrate = p.Payrate,
                CanDelete = !p.Works.Any(),
                Picture = p.Picture

            }).ToList();
        }
        // GET: api/Workers/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Worker>> GetWorker(int id)
        {
            var worker = await this.repo.GetAsync(x=>x.WorkerId==id);

            if (worker == null)
            {
                return NotFound();
            }

            return worker;
        }

        // PUT: api/Workers/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutWorker(int id, Worker worker)
        {
            if (id != worker.WorkerId)
            {
                return BadRequest();
            }

            await this.repo.UpdateAsync(worker);

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
        [HttpPut("{id}/VM")]
        public async Task<IActionResult> PutWorkerViewModel(int id, WorkerInputModel worker)
        {
            if (id != worker.WorkerId)
            {
                return BadRequest();
            }

            var existing = await this.repo.GetAsync(p => p.WorkerId == id);
            if (existing != null)
            {
                
                existing.WorkerName = worker.WorkerName;
                existing.Phone = worker.Phone;
                existing.Gender = worker.Gender;
                existing.Payrate = worker.Payrate;
                await this.repo.UpdateAsync(existing);
            }

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
        // POST: api/Workers
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<Worker>> PostWorker(Worker worker)
        {
            await this.repo.AddAsync(worker);
            await this.unitOfWork.CompleteAsync();

            return worker;
        }
        [HttpPost("VM")]
        public async Task<ActionResult<Worker>> PosWorkerInput(WorkerInputModel worker)
        {
            var newWorker = new Worker
            {
                WorkerName = worker.WorkerName,
                Gender = worker.Gender,
                Phone = worker.Phone,
                Payrate = worker.Payrate,
                Picture = "no-product-image-400x400.png"
            };
            await this.repo.AddAsync(newWorker);
            await this.unitOfWork.CompleteAsync();

            return newWorker;
        }
        [HttpPost("Upload/{id}")]
        public async Task<ImagePathResponse> UploadPicture(int id, IFormFile picture)
        {
            var product = await this.repo.GetAsync(p => p.WorkerId == id);
            var ext = Path.GetExtension(picture.FileName);
            string fileName = Guid.NewGuid() + ext;
            string savePath = Path.Combine(this.env.WebRootPath, "Pictures", fileName);
            FileStream fs = new FileStream(savePath, FileMode.Create);
            picture.CopyTo(fs);
            fs.Close();
            product.Picture = fileName;
            await this.repo.UpdateAsync(product);
            await this.unitOfWork.CompleteAsync();
            return new ImagePathResponse { PictureName = fileName };
        }
        // DELETE: api/Workers/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteWorker(int id)
        {
            var worker = await this.repo.GetAsync(p=>p.WorkerId== id);
            if (worker == null)
            {
                return NotFound();
            }

            await this.repo.DeleteAsync(worker);
            await this.unitOfWork.CompleteAsync();


            return NoContent();
        }

    }
}
