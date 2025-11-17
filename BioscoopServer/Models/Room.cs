namespace BioscoopServer.models
{
    public class Room
    {
        public Guid Id { get; set; }
        public string? Naam { get; set; }
        public int? Rijen { get; set; }
        public int? StoelenPerRij { get; set; }

        public List<Show> Shows { get; set; } = new List<Show>();
    }
}