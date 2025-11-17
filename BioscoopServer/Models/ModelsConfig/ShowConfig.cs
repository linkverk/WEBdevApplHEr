using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using BioscoopServer.models;

public class ShowConfig : IEntityTypeConfiguration<Show>
{
    public void Configure(EntityTypeBuilder<Show> builder)
    {
        builder.HasMany(s => s.Reservations)
            .WithOne(r => r.Show)
            .HasForeignKey(r => r.ShowId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}