using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using BioscoopServer.models;

public class FilmConfig : IEntityTypeConfiguration<Film>
{
    public void Configure(EntityTypeBuilder<Film> builder)
    {
        builder.HasMany(f => f.Shows)
            .WithOne(s => s.Film)
            .HasForeignKey(s => s.FilmId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasMany(f => f.Reviews)
            .WithOne(rv => rv.Film)
            .HasForeignKey(rv => rv.FilmId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
