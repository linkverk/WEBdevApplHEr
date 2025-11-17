namespace BioscoopServer.models
{
    public class Reservation
    {
        public Guid Id { get; set; }
        public Guid UserId { get; set; }
        public Guid ShowId { get; set; }

        public User User { get; set; } = null!;
        public Show Show { get; set; } = null!;
        public List<Seat> Seats { get; set; } = new List<Seat>();
    }
}