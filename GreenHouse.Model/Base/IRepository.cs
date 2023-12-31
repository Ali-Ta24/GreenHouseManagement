using System.Linq.Expressions;

namespace GreenHouse.Model.Base
{
    public interface IRepository<ModelItem, T>
         where ModelItem : Model<T>, IModel<T>
         where T : struct

    {
        Task<ModelItem> FirstOrDefaultAsync(Expression<Func<ModelItem, bool>> predicate);
        IQueryable<ModelItem> AllItems { get; }
        ModelItem Insert(ModelItem item);
        void Delete(ModelItem item);

    }
}
