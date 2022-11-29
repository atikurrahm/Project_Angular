

using WorkDotnetCore.Models;
using WorkDotnetCore.Repositories.Interfaces;

namespace WorkDotnetCore.Repositories
{
    public class UnitOfWork : IUnitOfWork, IDisposable
    {
        WorkerDbContext db;
        public UnitOfWork(WorkerDbContext db)
        {
            this.db = db;
        }
        public async Task CompleteAsync()
        {
            await db.SaveChangesAsync();
        }

        public void Dispose()
        {
            this.db.Dispose();
        }

        public IGenericRepo<T> GetRepo<T>() where T : class, new()
        {
            return new GenericRepo<T>(this.db);
        }
    }
}
