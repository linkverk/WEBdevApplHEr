namespace BioscoopServer.Models.ModelsDTOs
{
    public class FilmDTO
    {
        public string? Id { get; set; }
        public string? Name { get; set; }
        public string? Rating { get; set; }
        public string? Genre { get; set; }
        public int? Duration { get; set; }
        public string? Description { get; set; }
    }
}