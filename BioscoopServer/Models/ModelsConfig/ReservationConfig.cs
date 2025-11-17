using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using BioscoopServer.models;

public class ReservationConfig : IEntityTypeConfiguration<Reservation>
{
    public void Configure(EntityTypeBuilder<Reservation> builder)
    {
        builder.HasMany(r => r.Seats)
            .WithOne(s => s.Reservation)
            .HasForeignKey(s => s.ReservationId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
