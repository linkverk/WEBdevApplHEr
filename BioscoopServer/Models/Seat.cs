namespace BioscoopServer.models
{
    public class Seat
    {
        public Guid Id { get; set; }
        public Guid ReservationId { get; set; }
        public string Stoelnummer { get; set; } = null!;

        public Reservation Reservation { get; set; } = null!;
    }
}