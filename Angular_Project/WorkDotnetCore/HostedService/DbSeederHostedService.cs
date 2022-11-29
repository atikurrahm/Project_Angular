
using System.IO.Pipelines;
using System.Numerics;
using WorkDotnetCore.Models;


namespace WorkDotnetCore.HostedService
{
    public class DbSeederHostedService : IHostedService
    {
       
        IServiceProvider serviceProvider;
        public DbSeederHostedService(
            IServiceProvider serviceProvider)
        {
            this.serviceProvider = serviceProvider;
           
        }

        public async Task StartAsync(CancellationToken cancellationToken)
        {
            using (IServiceScope scope = serviceProvider.CreateScope())
            {
               
                  var db = scope.ServiceProvider.GetRequiredService<WorkerDbContext>();

                  await SeedDbAsync(db);
               
            }
        }
       public async Task SeedDbAsync(WorkerDbContext db)
        {
            await db.Database.EnsureCreatedAsync();
            if (!db.Customers.Any())
            {
                var c1 = new Customer { CustomerName = "Customer 1", Email = "customer1@mysite.com", Address = "Armanitola, Armenia" };
                await db.Customers.AddAsync(c1);
                var c2 = new Customer { CustomerName = "Customer 2", Email = "customer2@mysite.com", Address = "Kanpur, Kenia" };
                await db.Customers.AddAsync(c2);
                var p1 = new Worker { WorkerName = "Worker 1", Gender = Gender.Male, Phone = "01968363446", Payrate = 8000, Picture = "1.jpg" };
                await db.Workers.AddAsync(p1);
                var p2 = new Worker { WorkerName = "Worker 2", Gender = Gender.Female, Phone = "01668363446", Payrate = 7000, Picture = "2.jpg" };
                await db.Workers.AddAsync(p2);
                var o1 = new Payment { StartDate = DateTime.Today.AddDays(-8), EndDate = DateTime.Today.AddDays(-1), PaymentDone=true, Customer = c1 };
                o1.Works.Add(new Work { Payment = o1, Worker = p1, TotalWorkHour = 510 });
                var o2 = new Payment { StartDate = DateTime.Today.AddDays(-10), EndDate = DateTime.Today.AddDays(-2), PaymentDone = true, Customer = c1 };
                o2.Works.Add(new Work { Payment = o2, Worker = p1, TotalWorkHour = 100 });
                o2.Works.Add(new Work { Payment = o2, Worker = p2, TotalWorkHour = 120 });
                await db.Payments.AddAsync(o1);
                await db.Payments.AddAsync(o2);
                await db.SaveChangesAsync();
            }

        }
        public Task StopAsync(CancellationToken cancellationToken)
        {
            return Task.CompletedTask;
        }
        
    }
}
