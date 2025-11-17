using Microsoft.EntityFrameworkCore;
using BioscoopServer.models;
public class CinemaContext : DbContext
{
    public DbSet<User> Users => Set<User>();
    public DbSet<Film> Films => Set<Film>();
    public DbSet<Room> Zalen => Set<Room>();
    public DbSet<Show> Shows => Set<Show>();
    public DbSet<Reservation> Reservations => Set<Reservation>();
    public DbSet<Seat> Seats => Set<Seat>();
    public DbSet<Review> Reviews => Set<Review>();

    public CinemaContext(DbContextOptions<CinemaContext> options) : base(options) { }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.ApplyConfigurationsFromAssembly(typeof(CinemaContext).Assembly);
    }
}