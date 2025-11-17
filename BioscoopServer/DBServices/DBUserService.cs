using BioscoopServer.models;
using Microsoft.EntityFrameworkCore;

namespace BioscoopServer.DBServices
{
    public class DBUserService : DBDefaultService<User>
    {
        public DBUserService(CinemaContext context) : base(context) { }

        public override bool Exists(User entity, out User? existing)
        {
            existing = _dbSet.AsNoTracking().FirstOrDefault(u => u.Id == entity.Id);
            return existing != null;
        }

        // NEW: Get user by email
        public async Task<User?> GetByEmailAsync(string email)
        {
            return await _dbSet
                .AsNoTracking()
                .FirstOrDefaultAsync(u => u.Email == email);
        }

        public async Task<List<Film>?> GetUserHistoryAsync(Guid userId)
        {
            var user = await _dbSet
                .AsNoTracking()
                .Include(u => u.Reviews)
                .ThenInclude(r => r.Film)
                .FirstOrDefaultAsync(u => u.Id == userId);

            if (user == null)
                return null;

            // Return films that user has reviewed (this serves as history)
            return user.Reviews.Select(r => r.Film).ToList();
        }

        public async Task<bool> AddToHistoryAsync(Guid userId, Guid filmId)
        {
            var user = await _dbSet.FindAsync(userId);
            if (user == null)
                return false;

            var film = await _context.Set<Film>().FindAsync(filmId);
            if (film == null)
                return false;

            // Check if review already exists
            var existingReview = await _context.Set<Review>()
                .FirstOrDefaultAsync(r => r.UserId == userId && r.FilmId == filmId);

            if (existingReview != null)
                return true; // Already in history

            // Create a review entry to track history
            var review = new Review
            {
                Id = Guid.NewGuid(),
                UserId = userId,
                FilmId = filmId,
                Rating = null, // No rating, just history tracking
                Description = null
            };

            await _context.Set<Review>().AddAsync(review);
            await _context.SaveChangesAsync();

            return true;
        }

        public async Task<List<Reservation>?> GetUserBookingsAsync(Guid userId)
        {
            var user = await _dbSet
                .AsNoTracking()
                .Include(u => u.Reservations)
                .ThenInclude(r => r.Show)
                .ThenInclude(s => s.Film)
                .Include(u => u.Reservations)
                .ThenInclude(r => r.Show)
                .ThenInclude(s => s.Zaal)
                .Include(u => u.Reservations)
                .ThenInclude(r => r.Seats)
                .FirstOrDefaultAsync(u => u.Id == userId);

            if (user == null)
                return null;

            return user.Reservations.ToList();
        }

        public async Task<User?> GetUserWithDetailsAsync(Guid userId)
        {
            return await _dbSet
                .AsNoTracking()
                .Include(u => u.Reservations)
                .ThenInclude(r => r.Show)
                .ThenInclude(s => s.Film)
                .Include(u => u.Reviews)
                .ThenInclude(r => r.Film)
                .FirstOrDefaultAsync(u => u.Id == userId);
        }
    }
}