using GreenHouse.Model.Base;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq.Expressions;

namespace GreenHouse.DataAccess.Base
{
    public class Repository<Entity, PrimaryKeyType> : IRepository<Entity, PrimaryKeyType>
        where Entity : Model<PrimaryKeyType>
        where PrimaryKeyType : struct
    {
        private readonly DbSet<Entity> _entities;
        public Repository(DbContext context)
        {
            _entities = context.Set<Entity>();
        }
        public IQueryable<Entity> AllItems => _entities;
        public Task<Entity> FirstOrDefaultAsync(Expression<Func<Entity, bool>> predicate) => _entities.FirstOrDefaultAsync(predicate);
        public virtual void Delete(Entity item) => _entities.Remove(item);
        public virtual Entity Insert(Entity item) => _entities.Add(item);
    }
}
