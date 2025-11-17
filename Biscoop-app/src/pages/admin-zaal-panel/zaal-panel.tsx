import { useState } from "react";
import { getAppData, deleteItem, addItem, updateItem } from "../../utils/storage";
import type { ZaalProp } from "../../utils/fake-data";
import GenericSelect from "../../components/generic-select";
import ZaalForm from "./zaal-form";
import Seats from '../../components/Seats';
import "./zaal-panel.css";

function Zaal_panel() {

    const { fakeZalen } = getAppData();
    const [zalen, setZalen] = useState<ZaalProp[]>(fakeZalen);
    const emptyZaal: ZaalProp = {
        id: '',
        naam: '',
        rijen: 0,
        stoelen_per_rij: 0,
    };

    const [selectedZaal, setSelectedZaal] = useState<ZaalProp>(emptyZaal);

    const handleSave = () => {
        if (selectedZaal.naam === "" || selectedZaal.rijen === 0 || selectedZaal.stoelen_per_rij === 0) {
            alert("Please enter all info.");
            return;
        }

        if (selectedZaal.id !== "") {
            updateItem("fakeZalen", selectedZaal);
            alert("Zaal updated!");
        } else {
            const newZaal: ZaalProp = {
                id: crypto.randomUUID(),
                naam: selectedZaal.naam,
                rijen: selectedZaal.rijen,
                stoelen_per_rij: selectedZaal.stoelen_per_rij,
            };
            addItem("fakeZalen", newZaal);
            alert("Zaal saved!");
        }

    }


    return (
        <div className="movie-panel-container">
            <div className="movie-preview-side">
                <div className="top"><h1>Preview</h1></div>
                <div className="top"><h1>{selectedZaal.naam}</h1></div>
                <Seats
                    zaal={
                        {
                            id: "temp",
                            naam: selectedZaal.naam,
                            rijen: selectedZaal.rijen,
                            stoelen_per_rij: selectedZaal.stoelen_per_rij,
                        }
                    }
                    button={false}
                />
            </div>

            <div className="movie-form-side">
                <div className="form-top">
                    <ZaalForm
                        selectedZaal={selectedZaal}
                        setSelectedZaal={setSelectedZaal}
                        handleSave={handleSave}
                    />
                </div>

                <div className="form-bottom">
                    <GenericSelect<ZaalProp>
                        title="Select a Room"
                        items={zalen}
                        selectedItem={selectedZaal}
                        setSelectedItem={setSelectedZaal}
                        Label={(z) => z.naam}
                        emptyItem={emptyZaal}
                    />

                    <button
                        className="delete-button"
                        onClick={() => {
                            if (!selectedZaal) return;
                            const updatedZalen = zalen.filter(z => z.id !== selectedZaal.id);
                            setZalen(updatedZalen);
                            setSelectedZaal(emptyZaal);
                            deleteItem("fakeZalen", selectedZaal.id)
                        }}
                    >
                        Delete Room
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Zaal_panel;
