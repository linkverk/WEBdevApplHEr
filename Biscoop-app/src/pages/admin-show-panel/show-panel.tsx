import { useState } from "react";
import { formatDateForShowing } from "../../utils/date-fromatter";
import MovieInfo from "../movie-detail/MovieInfo";
import type { ZaalProp, MovieProp, ShowProp } from "../../utils/fake-data";
import GenericSelect from "../../components/generic-select";
import "./show-panel.css";
import { getAppData, deleteItem, addItem, updateItem } from "../../utils/storage";

function Show_panel() {
    const { fakeMovies, fakeShows, fakeZalen } = getAppData();

    const [shows, setShows] = useState<ShowProp[]>(fakeShows);
    const [movies] = useState<MovieProp[]>(fakeMovies);
    const [rooms] = useState<ZaalProp[]>(fakeZalen);

    const emptyShow: ShowProp = {
        id: '',
        movieId: '',
        zaalId: '',
        start_date: new Date,
        end_date: new Date,
    };
    const [selectedShow, setSelectedShow] = useState<ShowProp>();
    const emptyMovie: MovieProp = {
        id: '',
        name: '',
        duration: 0,
        rating: '',
        genre: '',
        description: '',
    };
    const [selectedMovie, setSelectedMovie] = useState<MovieProp>(emptyMovie);
    const emptyZaal: ZaalProp = {
        id: '',
        naam: '',
        rijen: 0,
        stoelen_per_rij: 0,
    };
    const [selectedzaal, setSelectedZaal] = useState<ZaalProp>(emptyZaal);
    const [startDate, setStartDate] = useState<Date | string>("");
    const [endDate, setEndDate] = useState<Date | string>("");

    const handleSave = () => {
        if (!selectedzaal || !selectedShow || startDate === "" || endDate === "") {
            alert("Please enter all info.");
            return;
        }

        const start = new Date(startDate);
        const end = new Date(endDate);

        if (start > end) {
            alert("Start date can't be after end date.");
            return;
        }

        const showEnd = new Date(start.getTime() + selectedMovie.duration * 60000);
        if (showEnd > end) {
            alert("Show isn't long enough.");
            return;
        }

        if (selectedShow) {
            selectedShow.movieId = selectedMovie.id;
            selectedShow.zaalId = selectedzaal.id;
            selectedShow.start_date = start;
            selectedShow.end_date = end;

            updateItem("fakeShows", selectedShow);
            alert("Show updated!");
        } else {
            const newShow: ShowProp = {
                id: crypto.randomUUID(),
                movieId: selectedMovie.id,
                zaalId: selectedzaal.id,
                start_date: start,
                end_date: end,
            };
            addItem("fakeShows", newShow);
            alert("Show saved!");
        }

    };

    function formatDateForInput(date: Date | string): string {
        if (!date) return "";
        if (typeof date === "string") return date;
        const offset = date.getTimezoneOffset();
        const local = new Date(date.getTime() - offset * 60 * 1000);
        return local.toISOString().slice(0, 16);
    }

    return (
        <div className="movie-panel-container">
            <div className="movie-preview-side">
                <div className="top"><h1>Preview</h1></div>
                {selectedMovie != null && (
                    <MovieInfo
                        name={selectedMovie?.name}
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
                {selectedzaal != null &&
                    <div id="info">
                        <div>
                            <span className="label">Room name:</span> {selectedzaal?.naam}
                        </div>
                        <div>
                            <span className="label">Total Seats:</span> {selectedzaal?.stoelen_per_rij * selectedzaal.rijen}
                        </div>
                    </div>
                }
                {startDate != "" &&
                    <div id="info">
                        <div>
                            <span className="label">Start date:</span> {formatDateForShowing(startDate)}
                        </div>
                    </div>
                }
                {endDate != "" &&
                    <div id="info">
                        <div>
                            <span className="label">End date:</span> {formatDateForShowing(endDate)}
                        </div>
                    </div>
                }
            </div>

            <div className="movie-form-side">
                <div className="form-top">
                    <h2>{selectedShow?.id ? "Edit show info" : "Add show info"}</h2>

                    <GenericSelect<MovieProp>
                        title="Select a Movie"
                        items={movies}
                        selectedItem={selectedMovie}
                        setSelectedItem={setSelectedMovie}
                        Label={(m) => m.name}
                        emptyItem={emptyMovie}
                    />

                    <GenericSelect<ZaalProp>
                        title="Select a Room"
                        items={rooms}
                        selectedItem={selectedzaal}
                        setSelectedItem={setSelectedZaal}
                        Label={(z) => z.naam}
                        emptyItem={emptyZaal}
                    />

                    <div className="form-group">
                        <label>start date:</label>
                        <input
                            type="datetime-local"
                            value={formatDateForInput(startDate)}
                            onChange={(e) => setStartDate(e.target.value)}
                        />
                    </div>

                    <div className="form-group">
                        <label>end date:</label>
                        <input
                            type="datetime-local"
                            value={formatDateForInput(endDate)}
                            onChange={(e) => setEndDate(e.target.value)}
                        />
                    </div>

                    <button onClick={handleSave} className="save-button">
                        {selectedShow ? "Update Show" : "Save Show"}
                    </button>
                </div>

                <div className="form-bottom">
                    <h3>Select a show</h3>
                    <select
                        value={selectedShow?.id || ""}
                        onChange={(e) => {
                            const show = shows.find((s) => s.id === e.target.value) || emptyShow;
                            setSelectedShow(show);
                            setSelectedZaal(fakeZalen.find(z => z.id === show.zaalId) ?? emptyZaal);
                            setSelectedMovie(fakeMovies.find(m => m.id === show.movieId) ?? emptyMovie);
                            if(show.id !== ""){
                                setStartDate(new Date(show.start_date));
                                setEndDate(new Date(show.end_date));
                            }
                        }}
                    >
                        <option value="">-- Pick a Show --</option>
                        {shows.map((show) => (
                            <option key={show.id} value={show.id}>
                                {fakeMovies.find(m => m.id === show.movieId)?.name ?? "N/A"} - {fakeZalen.find(z => z.id === show.zaalId)?.naam ?? "N/A"}
                            </option>
                        ))}
                    </select>

                    <button
                        className="delete-button"
                        onClick={() => {
                            if (!selectedShow) return;
                            const updatedShows = shows.filter(s => s.id !== selectedShow.id);
                            setShows(updatedShows);
                            setSelectedShow(emptyShow);
                            deleteItem("fakeShows", selectedShow.id)
                        }}
                    >
                        Delete Show
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Show_panel;
