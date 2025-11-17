import React from "react";
import type { MovieProp } from "../../utils/fake-data";

interface MovieFormProps {
    selectedMovie: MovieProp;
    setSelectedMovie: React.Dispatch<React.SetStateAction<MovieProp>>;
    poster: string | undefined;
    setPoster: React.Dispatch<React.SetStateAction<string | undefined>>;
    handleSave: () => void;
}

const MovieForm: React.FC<MovieFormProps> = ({ selectedMovie, setSelectedMovie, poster, setPoster, handleSave }) => {

    const handlePosterUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file && selectedMovie) {
            setPoster(URL.createObjectURL(file));
        }
    };

    return (
        <div className="form-top">
            <h2>{selectedMovie.id !== "" ? "Edit Movie" : "Add Movie Info"}</h2>

            <div className="form-group">
                <label>Title:</label>
                <input
                    type="text"
                    value={selectedMovie?.name || ""}
                    onChange={(e) => setSelectedMovie({ ...selectedMovie, name: e.target.value })}
                    placeholder="Enter movie title"
                />
            </div>

            <div className="form-group">
                <label>Duration (minutes):</label>
                <input
                    type="number"
                    value={selectedMovie?.duration || ""}
                    onChange={(e) =>
                        setSelectedMovie({ ...selectedMovie, duration: Number(e.target.value) })
                    }
                    placeholder="Enter duration in minutes"
                    min={0}
                />
            </div>

            <div className="form-group">
                <label>PG Rating:</label>
                <select
                    value={selectedMovie?.rating || ""}
                    onChange={(e) => setSelectedMovie({ ...selectedMovie, rating: e.target.value })}
                >
                    <option value="">Select rating</option>
                    <option value="G">G</option>
                    <option value="PG">PG</option>
                    <option value="PG-13">PG-13</option>
                    <option value="R">R</option>
                    <option value="NC-17">NC-17</option>
                    <option value="NR">NR</option>
                </select>
            </div>

            <div className="form-group">
                <label>Genre:</label>
                <input
                    type="text"
                    value={selectedMovie?.genre || ""}
                    onChange={(e) => setSelectedMovie({ ...selectedMovie, genre: e.target.value })}
                    placeholder="e.g. Comedy, Mystery"
                />
            </div>

            <div className="form-group">
                <label>Description:</label>
                <textarea
                    value={selectedMovie?.description || ""}
                    onChange={(e) => setSelectedMovie({ ...selectedMovie, description: e.target.value })}
                    placeholder="Enter movie description"
                />
            </div>

            <div className="form-group">
                <label>Poster Image:</label>
                <input type="file" accept="image/*" onChange={handlePosterUpload} />
            </div>

            <button onClick={handleSave} className="save-button">
                {selectedMovie.id !== "" ? "Update Movie" : "Save Movie"}
            </button>
        </div>
    );
};

export default MovieForm;