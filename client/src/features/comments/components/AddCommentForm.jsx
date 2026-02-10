import { useState } from "react";

const AddComment = ({ recipeId, onAdd }) => {
  const [body, setBody] = useState("");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!body.trim()) return;

    const formData = new FormData();
    formData.append("recipe_id", recipeId);
    formData.append("body", body);
    if (image) formData.append("image", image);

    setLoading(true);
    await onAdd(formData);
    setBody("");
    setImage(null);
    setLoading(false);
  };

  return (
    <form className="add-comment-form" onSubmit={handleSubmit}>
      <textarea
        placeholder="Write a comment..."
        value={body}
        onChange={(e) => setBody(e.target.value)}
      />

      <input
        type="file"
        accept="image/*"
        onChange={(e) => setImage(e.target.files[0])}
      />

      <button type="submit" disabled={loading}>
        {loading ? "Posting..." : "Add comment"}
      </button>
    </form>
  );
};

export default AddComment;
