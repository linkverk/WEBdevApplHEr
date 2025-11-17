import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import ShowInfo from "./showInfo";
import "./movie-list.css"
import MovieInfo from "../movie-detail/MovieInfo";
import type { Review, ZaalProp } from "../../utils/fake-data";

export interface ShowPropWithZaal {
  id: string;
  start_date: Date;
  end_date: Date;
  movieId: string;
  zaalId: string;
  zaal: ZaalProp;
}

export interface MoviePropFull {
    id: string;
    name: string;
    duration: number;
    rating: string;
    genre: string;
    description: string;
    shows: ShowPropWithZaal[];
    reviews: Review[];
}


function MovieList() {
    useEffect(() => {
        fetchAllMoviesFull();
    }, []);

    const [moviesFull, setMoviesFull] = useState<MoviePropFull[]>([]);

    const fetchAllMoviesFull = async () => {
        try {
            const response = await fetch("http://localhost:5275/api/Films/GetAllFull")
            const data: MoviePropFull[] = await response.json();
            setMoviesFull(data);
        } catch (error) {
            console.error("Failed to fetch movies:", error);
        }
    };

    const renderStars = (rating: number) => {
        const fullStars = "★".repeat(Math.floor(rating));
        const halfStar = rating % 1 >= 0.5 ? "⯪" : "";
        const emptyStars = "☆".repeat(5 - Math.ceil(rating));
        return fullStars + halfStar + emptyStars;
    };

    const averageRating = (reviews: Review[]) => {
        if (reviews.length === 0) return 0;
        const total = reviews.reduce((acc, review) => acc + review.rating, 0);
        return total / reviews.length;
    };

    return (
        <div className="movie-list">
            {moviesFull.map((item) => (
                <div className="movie-list-part">
                    <MovieInfo
                        name={item.name ?? "N/A"}
                        duration={item.duration ?? 0}
                        rating={item.rating ?? "N/A"}
                        genre={item.genre ?? "N/A"}
                        stars={renderStars(averageRating(item.reviews.filter(r => r.movieId === item.id)))}
                        includeDescription={false}
                        className="movie-info-list"
                        posterClass="poster-movielist"
                        textClass="movie-info-text"
                    />
                    <ShowInfo shows={item.shows} button={false} />
                    <Link
                        key={item.id ?? "N/A"}
                        to={`/movie_detail/${item.id ?? ""}`}
                        title={item.id ?? "N/A"}
                        className="goto-button"
                    >
                        {"details"}
                    </Link>
                </div>
            ))}
        </div>
    )
}

export default MovieList