namespace BioscoopServer.models
{
    public class User
    {
        public Guid Id { get; set; }
        public string Email { get; set; } = null!;
        public string Password { get; set; } = null!;
        public string? FirstName { get; set; }
        public string? LastName { get; set; }

        public List<Reservation> Reservations { get; set; } = new List<Reservation>();
        public List<Review> Reviews { get; set; } = new List<Review>();
    }
}
