import React from "react";
import "./movie-list.css"
import { Link } from "react-router-dom";
import type { ZaalProp } from "../../utils/fake-data";
import { formatDateForShowing } from "../../utils/date-fromatter";

export interface ShowPropWithZaal {
  id: string;
  start_date: Date;
  end_date: Date;
  movieId: string;
  zaalId: string;
  zaal: ZaalProp;
}

interface ShowInfoProps {
  shows: ShowPropWithZaal[];
  button: boolean;
}

const ShowInfo: React.FC<ShowInfoProps> = ({ shows, button }) => {

  return (
    <div className="voorstelling-info">
      {shows.map((show) => {
        const totalSeats = (show.zaal?.rijen ?? 0) * (show.zaal?.stoelen_per_rij ?? 0);

        return (
          <div key={show.id} className="voorstelling-card">
            <div>zaal: {show.zaal?.naam ?? "N/A"}</div>
            <div>Stoelen: {totalSeats}</div>
            <div>start date: {formatDateForShowing(show.start_date)}</div>
            <div>end date: {formatDateForShowing(show.end_date)}</div>
            {button && show.zaal &&
              <Link
                key={show.zaal.id ?? "N/A"}
                to={`/screeningRoom/${show.zaal.id ?? ""}`}
                title={show.zaal.id ?? "N/A"}
                className="button"
              >
                Reserve seats
              </Link>
            }
          </div>
        );
      })}
    </div>
  );
};

export default ShowInfo;
