using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using BioscoopServer.models;

public class SeatConfig : IEntityTypeConfiguration<Seat>
{
    public void Configure(EntityTypeBuilder<Seat> builder)
    {
        builder.Property(s => s.Stoelnummer)
            .IsRequired();
    }
}
