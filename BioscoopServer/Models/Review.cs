namespace BioscoopServer.models
{
    public class Review
    {
        public Guid Id { get; set; }
        public Guid UserId { get; set; }
        public Guid FilmId { get; set; }
        public int? Rating { get; set; }
        public string? Description { get; set; }

        public User User { get; set; } = null!;
        public Film Film { get; set; } = null!;
    }
}