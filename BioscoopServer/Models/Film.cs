namespace BioscoopServer.models
{
    public class Film
    {
        public Guid Id { get; set; }
        public string? Name { get; set; }
        public string? Rating { get; set; }
        public string? Genre { get; set; }
        public int? Duration { get; set; }
        public string? Description { get; set; }

        public List<Show> Shows { get; set; } = new List<Show>();
        public List<Review> Reviews { get; set; } = new List<Review>();
    }
    
}