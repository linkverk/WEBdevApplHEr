import { useState, useEffect } from "react";
import GenericSelect from "../../components/generic-select";
import type { MovieProp } from "../../utils/fake-data";
import MovieInfo from "../movie-detail/MovieInfo";
import MovieForm from "./movie-form";
import "./movie-panel.css";

function Movie_panel() {
    // const { fakeMovies } = getAppData();
    useEffect(() => {
        fetchAllMovies();
    }, []);

    const [movies, setMovies] = useState<MovieProp[]>([]);
    const emptyMovie: MovieProp = {
        id: '',
        name: '',
        duration: 0,
        rating: '',
        genre: '',
        description: '',
    };

    const [selectedMovie, setSelectedMovie] = useState<MovieProp>(emptyMovie);
    const [poster, setPoster] = useState<string | undefined>(undefined);

    // const handlePosterUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    //     const file = e.target.files?.[0];
    //     if (file) {
    //         setPoster(URL.createObjectURL(file));
    //     }
    // };

    const fetchAllMovies = async () => {
        try {
            const response = await fetch("http://localhost:5275/api/Films/GetAll")
            const data: MovieProp[] = await response.json();
            setMovies(data);
        } catch (error) {
            console.error("Failed to fetch movies:", error);
        }
    };

    const handleSave = async () => {
        if (!poster || selectedMovie.name === "" || selectedMovie.genre === "" || selectedMovie.description === "" || selectedMovie.rating === "" || selectedMovie.duration === 0) {
            alert("Please enter all info.");
            return;
        }

        const requestOptions: RequestInit = {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(selectedMovie),
        };

        try {
            const response = await fetch("http://localhost:5275/api/Films/AddOrUpdate",
                requestOptions
            );
            if (response.ok) {
                alert("Film added or updated succesfully.");
                const data: MovieProp = await response.json();
                if (movies.find((m) => m.id === data.id)) {
                    setMovies(movies.map((m) => (m.id === data.id ? data : m)));
                } else {
                    setMovies([...movies, data]);
                }
            }
            else {
                alert("Film not saved, something went wrong.");
            }
        } catch (err) {
            console.error("Failed to add or update movie:", err);
        };
    };

    const handleDelete = async () => {
        if (selectedMovie.id === "") {
            alert("Please select a movie.");
            return;
        }

        const requestOptions: RequestInit = {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(selectedMovie),
        };

        try {
            const response = await fetch("http://localhost:5275/api/Films/Delete",
                requestOptions
            );
            if (response.ok) {
                const updatedMovies = movies.filter(m => m.id !== selectedMovie.id);
                setMovies(updatedMovies);
                setSelectedMovie(emptyMovie);
            }
            else {
                alert("Film not delete, something went wrong.");
            }
        } catch (err) {
            console.error("Failed to delete movie:", err);
        };
    };

    return (
        <div className="movie-panel-container">
            <div className="movie-preview-side">
                <div className="top"><h1>Preview</h1></div>
                {(
                    <MovieInfo
                        poster={poster}
                        name={selectedMovie.name}
                        duration={selectedMovie.duration as number}
                        rating={selectedMovie.rating}
                        genre={selectedMovie.genre}
                        includeDescription={true}
                        description={selectedMovie.description}
                        className="movie-info-preview"
                        posterClass="movie-preview-poster"
                        textClass="movie-preview-info"
                    />
                )}
            </div>

            <div className="movie-form-side">
                <div className="form-top">
                    <MovieForm
                        selectedMovie={selectedMovie}
                        setSelectedMovie={setSelectedMovie}
                        poster={poster}
                        setPoster={setPoster}
                        handleSave={handleSave}
                    />
                </div>

                <div className="form-bottom">
                    <GenericSelect<MovieProp>
                        title="Select a Movie"
                        items={movies}
                        selectedItem={selectedMovie}
                        setSelectedItem={setSelectedMovie}
                        Label={(m) => m.name}
                        emptyItem={emptyMovie}
                    />
                    <button
                        className="delete-button"
                        onClick={() => {
                            handleDelete()
                        }}
                    >
                        Delete Movie
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Movie_panel;
