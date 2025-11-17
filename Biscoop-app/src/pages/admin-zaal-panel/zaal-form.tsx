import React from "react";
import type { ZaalProp} from "../../utils/fake-data";

interface ZaalFormProps {
    selectedZaal: ZaalProp;
    setSelectedZaal: React.Dispatch<React.SetStateAction<ZaalProp>>;
    handleSave: () => void;
}

const ZaalForm: React.FC<ZaalFormProps> = ({ selectedZaal, setSelectedZaal, handleSave }) => {
    return (
        <div className="form-top">
            <h2>{selectedZaal.id !== "" ? "Edit zaal" : "Add zaal Info"}</h2>

            <div className="form-group">
                <label>zaal Name:</label>
                <input
                    type="text"
                    value={selectedZaal?.naam || ""}
                    onChange={(e) => setSelectedZaal({ ...selectedZaal, naam: e.target.value })}
                    placeholder="Enter zaal name"
                />
            </div>

            <div className="form-group">
                <label>Rows:</label>
                <input
                    type="number"
                    value={selectedZaal?.rijen || ""}
                    onChange={(e) =>
                        setSelectedZaal({ ...selectedZaal, rijen: Number(e.target.value) })
                    }
                    placeholder="Enter number of rows"
                    min={0}
                />
            </div>

            <div className="form-group">
                <label>Seats per Row:</label>
                <input
                    type="number"
                    value={selectedZaal?.stoelen_per_rij || ""}
                    onChange={(e) =>
                        setSelectedZaal({
                            ...selectedZaal,
                            stoelen_per_rij: Number(e.target.value),
                        })
                    }
                    placeholder="Enter seats per row"
                    min={0}
                />
            </div>

            <button onClick={handleSave} className="save-button">
                {selectedZaal.id !== "" ? "Update zaal" : "Save zaal"}
            </button>
        </div>
    );
};

export default ZaalForm;