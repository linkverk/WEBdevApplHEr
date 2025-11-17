import "./movie-detail.css";
import React, { useState, useEffect } from "react";
import ReviewList from "./ReviewList";
import MovieInfo from "./MovieInfo";
import ShowInfo from "../movie-list/showInfo";
import { getAppData, setAppData } from "../../utils/storage";
import type { Review, ZaalProp } from "../../utils/fake-data";
import { useParams } from "react-router-dom";

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


const getStoredUsername = () => {
    // support multiple keys used across the app: 'username' (lowercase) or 'userName' (from register)
    const a = localStorage.getItem("username");
    if (a) return a;
    // try registeredUser object
    const reg = localStorage.getItem("registeredUser");
    if (reg) {
        try {
            const parsed = JSON.parse(reg);
            if (parsed && parsed.name) return parsed.name;
        } catch (e) {
            // ignore
        }
    }
    return "Jhon Doe";
    //This needs to be fixed later, so that it fetches the correct username from localStorage
};

const ReviewForm: React.FC<{ movieId: string; onAdded: () => void }> = ({ movieId, onAdded }) => {
    const username = getStoredUsername();
    const [text, setText] = useState("");
    const [rating, setRating] = useState<number>(5);

    const submit = (e?: React.FormEvent) => {
        e?.preventDefault();
        if (!text.trim()) return;
        const data = getAppData();
        const newReview = { name: username, text: text.trim(), rating, movieId };
        data.fakeReviews.push(newReview);
        setAppData(data);
        setText("");
        setRating(5);
        onAdded();
    };

    return (
        <form className="review-form" onSubmit={submit}>
            <div className="review-form-row">
                <label>Review</label>
                <textarea value={text} onChange={(e) => setText(e.target.value)} />
            </div>
            <div className="review-form-row small">
                <label>Rating</label>
                <select value={rating} onChange={(e) => setRating(Number(e.target.value))}>
                    <option value={5}>5</option>
                    <option value={4}>4</option>
                    <option value={3}>3</option>
                    <option value={2}>2</option>
                    <option value={1}>1</option>
                </select>
            </div>
            <div className="review-form-row">
                <button className="btn" type="submit">Add review as {username}</button>
            </div>
        </form>
    );
};

function Movie_detail() {
    const { movieId } = useParams();
    useEffect(() => {
        fetchAllMoviesFull();
    }, []);

    const [movieFull, setMovieFull] = useState<MoviePropFull>();

    const fetchAllMoviesFull = async () => {
        try {
            const response = await fetch(`http://localhost:5275/api/Films/GetById?id=${movieId}`)
            const data: MoviePropFull = await response.json();
            setMovieFull(data);
        } catch (error) {
            console.error("Failed to fetch movies:", error);
        }
    };


    const reloadReviews = () => {
        return
    };

    return (
        <div className="container">
            {movieFull && (
                <>
                    <div className="room-info">
                        <h2>Room & Showtime Information</h2>
                        <ShowInfo shows={movieFull.shows} button={true} />
                    </div>

                    <div>
                        <MovieInfo
                            name={movieFull.name}
                            duration={movieFull.duration}
                            rating={movieFull.rating}
                            genre={movieFull.genre}
                            includeDescription={true}
                            description={movieFull.description}
                            className="movie-info"
                            posterClass="poster"
                            textClass="info"
                        />
                    </div>

                    <div className="reviews">
                        <h2>Reviews</h2>
                        <ReviewList reviews={movieFull.reviews} />
                        <h3>Add a review</h3>
                        <ReviewForm movieId={movieFull.id} onAdded={reloadReviews} />
                    </div>
                </>
            )}
        </div>
    )
}

export default Movie_detail