using BioscoopServer.models;
using Microsoft.EntityFrameworkCore;

public class ReviewServices : DBDefaultService<Review>
{
    protected readonly DbContext _context;
    protected readonly DbSet<Review> _dbSet;

    public ReviewServices(DbContext context) : base(context)
    {
        _context = context;
        _dbSet = _context.Set<Review>();
    }

    public override bool Exists(Review entity, out Review? existing)
    {
        existing = _dbSet.AsNoTracking().FirstOrDefault(f => f.Id == entity.Id);
        return existing != null;
    }

    public override async Task<Review?> AddAsync(Review review)
    {
        if (review == null) throw new ArgumentNullException(nameof(review), "Nothing was filled in");

        await _dbSet.AddAsync(review);
        await _context.SaveChangesAsync();
        return review;
    }

}