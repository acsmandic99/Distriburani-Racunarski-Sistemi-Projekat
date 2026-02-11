import React, { useState } from "react";
import { addReview } from "../services/reviewsAPI";

const ReviewForm = ({ recipeId, onReviewAdded }) => {
  const [rating, setRating] = useState(0);
  const [hoveredStar, setHoveredStar] = useState(0);
  const [body, setBody] = useState("");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!rating) {
      alert("Morate izabrati ocenu.");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("rating", rating);
      formData.append("body", body);
      if (image) formData.append("image", image);

      await addReview(recipeId, formData);

      setRating(0);
      setBody("");
      setImage(null);

      if (onReviewAdded) onReviewAdded();
    } catch (err) {
      console.error("Failed to submit review", err);
      alert("Greška pri slanju recenzije.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="review-form">
      <h3>Ostavi recenziju</h3>

      <form onSubmit={handleSubmit}>
        <div className="stars">
          {[1, 2, 3, 4, 5].map((star) => (
            <span
              key={star}
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoveredStar(star)}
              onMouseLeave={() => setHoveredStar(0)}
              style={{
                cursor: "pointer",
                fontSize: "1.5rem",
                color: (hoveredStar || rating) >= star ? "#ffc107" : "#ccc",
              }}
            >
              ★
            </span>
          ))}
        </div>

        <textarea
          placeholder="Napišite vašu recenziju..."
          value={body}
          onChange={(e) => setBody(e.target.value)}
          maxLength={1000}
        />

        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImage(e.target.files[0])}
        />

        <button type="submit" disabled={loading}>
          {loading ? "Slanje..." : "Pošalji recenziju"}
        </button>
      </form>
    </div>
  );
};

export default ReviewForm;
