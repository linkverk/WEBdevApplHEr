namespace BioscoopServer.models
{
    public class Show
    {
        public Guid Id { get; set; }
        public Guid FilmId { get; set; }
        public Guid RoomId { get; set; }
        public DateTime? Begintijd { get; set; }
        public DateTime? Eindtijd { get; set; }

        public Film Film { get; set; } = null!;
        public Room Zaal { get; set; } = null!;
        public List<Reservation> Reservations { get; set; } = new List<Reservation>();
    }
}