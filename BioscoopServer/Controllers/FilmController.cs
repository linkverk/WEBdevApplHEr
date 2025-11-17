using Microsoft.AspNetCore.Mvc;
using BioscoopServer.models;
using BioscoopServer.DBServices;
using BioscoopServer.Models.ModelsDTOs;

namespace Controllers
{
    [ApiController]
    [Route("api/Films")]
    public class FilmController : ControllerBase
    {
        private readonly DBFilmService _DBFilmService;

        public FilmController(DBFilmService DBFilmService)
        {
            _DBFilmService = DBFilmService;
        }

        [HttpGet("GetById")]
        public async Task<IActionResult> GetFilById([FromQuery] string id)
        {
            var film = await _DBFilmService.GetByIdAsync(Guid.Parse(id));
            if(film == null)
            {
                return BadRequest($"Film with id {id} was not found");
            }
            return Ok(film);
        }

        [HttpGet("GetAll")]
        public async Task<IActionResult> GetAllFilms()
        {
            var films = await _DBFilmService.GetAllAsync();
            return Ok(films);
        }

        [HttpGet("GetAllFull")]
        public async Task<IActionResult> GetAllFilmsFull()
        {
            var films = await _DBFilmService.GetFilmsFull();
            return Ok(films);
        }

        [HttpPost("AddOrUpdate")]
        public async Task<IActionResult> AddOrUpdateFilm([FromBody] FilmDTO filmModel)
        {
            if (filmModel == null)
                return BadRequest("Film is required.");

            Guid filmId;
            if (string.IsNullOrWhiteSpace(filmModel.Id) || !Guid.TryParse(filmModel.Id, out filmId))
                filmId = Guid.NewGuid();

            var film = new Film
            {
                Id = filmId,
                Name = filmModel.Name,
                Rating = filmModel.Rating,
                Genre = filmModel.Genre,
                Duration = filmModel.Duration,
                Description = filmModel.Description,
            };

            var addedFilm = await _DBFilmService.AddOrUpdateAsync(film);
            return Ok(addedFilm);
        }
        [HttpPost("Delete")]
        public async Task<IActionResult> DeleteFilm([FromBody] FilmDTO filmModel)
        {
            if (filmModel == null)
                return BadRequest("Film is required.");

            Guid filmId;
            if(Guid.TryParse(filmModel.Id, out filmId))
            {
                var film = new Film
                {
                    Id = filmId,
                    Name = filmModel.Name,
                    Rating = filmModel.Rating,
                    Genre = filmModel.Genre,
                    Duration = filmModel.Duration,
                    Description = filmModel.Description,
                };

                await _DBFilmService.DeleteAsync(film);
                return Ok();
            }
            else
            {
                return BadRequest("film Id is invalid");
            }
        }
    }
}