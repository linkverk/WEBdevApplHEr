using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using BioscoopServer.models;

public class RoomConfig : IEntityTypeConfiguration<Room>
{
    public void Configure(EntityTypeBuilder<Room> builder)
    {
        builder.HasMany(r => r.Shows)
            .WithOne(s => s.Zaal)
            .HasForeignKey(s => s.RoomId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
