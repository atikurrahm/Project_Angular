namespace WorkDotnetCore.Repositories.Interfaces
{
    public interface IUnitOfWork
    {
        IGenericRepo<T> GetRepo<T>() where T : class, new();
        Task CompleteAsync();
        void Dispose();
    }
}
