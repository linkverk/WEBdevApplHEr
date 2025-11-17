import React from "react";
import type { Review } from "../../utils/fake-data";

type ReviewListProps = {
  reviews: Review[];
};

const ReviewList: React.FC<ReviewListProps> = ({ reviews }) => {
  const renderStars = (rating: number) => {
    const fullStars = "⭐".repeat(rating);
    const emptyStars = "☆".repeat(5 - rating);
    return fullStars + emptyStars;
  };

  return (
    <div className="review-list">
      {reviews.map((review, index) => (
        <div className="review-item" key={index}>
          <div className="review-meta">
            <span className="label">{review.name}</span>
            <span className="review-rating">{renderStars(review.rating)}</span>
          </div>
          <div className="review-text">{review.text}</div>
        </div>
      ))}
    </div>
  );
};

export default ReviewList;
