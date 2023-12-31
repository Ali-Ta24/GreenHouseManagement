namespace GreenHouse.Model.Base
{
    public class Model<PrimaryKey> : IModel<PrimaryKey>
        where PrimaryKey : struct
    {

        public virtual PrimaryKey ID { get; set; }

        public Model()
        {

        }

        public Model(IModel<PrimaryKey> model)
        {
            this.ID = model.ID;
        }
    }
}