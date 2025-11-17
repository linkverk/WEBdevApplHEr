import React, { useState, useEffect } from 'react';
import './Seats.css';
import type { ZaalProp } from "./../utils/fake-data";

type Seat = {
  id: number;
  reserved: boolean;
};

interface SeatsProps {
  zaal: ZaalProp;
  button: boolean;
}

const Seats: React.FC<SeatsProps> = ({ zaal, button }) => {
  const [seats, setSeats] = useState<Seat[]>([]);

  const [hoveredId, setHoveredId] = useState<number | null>(null);
  useEffect(() => {
    const totalSeats = Math.max(zaal.rijen * zaal.stoelen_per_rij, 0);
    const newSeats = Array.from({ length: totalSeats }, (_, i) => ({
      id: i,
      reserved: false,
    }));
    setSeats(newSeats);
  }, [zaal.rijen, zaal.stoelen_per_rij]);

  const toggleReservation = (id: number) => {
    setSeats(prevSeats => {
      const updatedSeats = prevSeats.map(seat =>
        seat.id === id ? { ...seat, reserved: !seat.reserved } : seat
      );
      localStorage.setItem('seats', JSON.stringify(updatedSeats));
      return updatedSeats;
    });
  };

  return (
    <div className="screening-room-container">
      <h2 className="main-title">Select Your Seat</h2>

      <div className="legend">
        <div className="legend-item">
          <span className="box available"></span>Available
        </div>
        <div className="legend-item">
          <span className="box reserved"></span>Reserved
        </div>
      </div>

      <div
        className="seat-grid"
        style={{
          gridTemplateColumns: `repeat(${zaal.stoelen_per_rij}, 44px)`,
        }}
      >
        {seats.map(seat => (
          <div
            key={seat.id}
            className={`box ${seat.reserved ? 'reserved' : 'available'}`}
            onClick={() => toggleReservation(seat.id)}
            onMouseEnter={() => setHoveredId(seat.id)}
            onMouseLeave={() => setHoveredId(null)}
          >
            {zaal.rijen * zaal.stoelen_per_rij - seat.id}
            {hoveredId === seat.id && (
              <div className="tooltip">
                Seat {zaal.rijen * zaal.stoelen_per_rij - seat.id}<br />
                {seat.reserved ? 'Reserved' : 'Available'}
              </div>
            )}
          </div>
        ))}
      </div>

      {button && <button className='button2'>Reserve</button>}
    </div>
  );
};

export default Seats;
