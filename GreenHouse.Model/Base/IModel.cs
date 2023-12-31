namespace GreenHouse.Model.Base
{
    public interface IModel<T> where T : struct
    {
        T ID { get; set; }
    }
}
