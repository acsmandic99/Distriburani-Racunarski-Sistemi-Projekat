import React, { useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../../shared/contexts/AuthContext";
import "./RecipeDetailsPage.css";
import { useEffect, useState } from "react";
import { getCommentsForRecipe, addComment, deleteComment } from "../../comments/services/commentAPI";
import CommentsList from "../../comments/components/CommentListForm";
import AddComment from "../../comments/components/AddCommentForm";

const RecipeDetailsPage = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const location = useLocation();
  const { recipe } = location.state || {};

  const [comments, setComments] = useState([]);
  const [loadingComments, setLoadingComments] = useState(true);

  useEffect(() => {
  const fetchComments = async () => {
    try {
      setLoadingComments(true);
      const data = await getCommentsForRecipe(recipe._id);
      setComments(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingComments(false);
    }
  };

  fetchComments();
  }, [recipe._id]);

  const handleAddComment = async (formData) => {
    const newComment = await addComment(formData);
    setComments((prev) => [newComment, ...prev]);
  };

  const handleDeleteComment = async (commentId) => {
    await deleteComment(commentId);
    setComments((prev) => prev.filter((c) => c._id !== commentId));
  };

  if (!recipe) return <p>Recipe not found.</p>;

  const handleEdit = () => {
    console.log("Edit recipe:", recipe._id);
  };

  const handleDelete = () => {
    console.log("Delete recipe:", recipe._id);
  };

  const isAuthor =
    user && recipe.author && recipe.author.first_name === user.first_name;

  return (
    <div className="recipe-details-page">
      <button
        onClick={() => navigate(-1)}
        style={{
          marginBottom: "1rem",
          padding: "0.5rem 1rem",
          cursor: "pointer",
        }}
      >
        &larr; Back
      </button>

      <h1>{recipe.title}</h1>
      <p>
        <strong>Type:</strong> {recipe.type_of_dish}
      </p>
      <p>
        <strong>Prep time:</strong> {recipe.time_for_preperation}
      </p>
      <p>
        <strong>Difficulty:</strong> {recipe.difficulty}
      </p>
      <p>
        <strong>Servings:</strong> {recipe.number_of_people}
      </p>
      <p>
        <strong>Author:</strong> {recipe.author.first_name}{" "}
        {recipe.author.last_name}
      </p>

      {recipe.image_url && (
        <img
          src={recipe.image_url}
          alt={recipe.title}
          className="recipe-image"
        />
      )}

      {recipe.additional_marks && recipe.additional_marks.length > 0 && (
        <p>
          <strong>Tags:</strong> {recipe.additional_marks.join(", ")}
        </p>
      )}

      <h2>Ingredients</h2>
      <ul>
        {recipe.ingredients.map((item, idx) => (
          <li key={idx}>{item}</li>
        ))}
      </ul>

      <h2>Steps</h2>
      <ol>
        {recipe.steps.map((step, idx) => (
          <li key={idx}>{step}</li>
        ))}
      </ol>

      {isAuthor && (
        <div className="recipe-actions">
          <button onClick={handleEdit}>Edit</button>
          <button onClick={handleDelete} style={{ marginLeft: "10px" }}>
            Delete
          </button>
        </div>
      )}

      <div className="recipe-comments">
        <h3>Comments</h3>
        {user && ( <AddComment recipeId={recipe._id} onAdd={handleAddComment} /> )}

        {loadingComments ? (
          <p>Loading comments...</p>
        ) : (
          <CommentsList
            comments={comments}
            currentUser={user}
            onDelete={handleDeleteComment}
          />
        )}
      </div>
    </div>
  );
};





export default RecipeDetailsPage;
