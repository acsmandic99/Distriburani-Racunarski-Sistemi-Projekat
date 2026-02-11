import React, { useContext } from "react";
import { useNavigate, useLocation, Link, useParams } from "react-router-dom";
import { AuthContext } from "../../shared/contexts/AuthContext";
import "./RecipeDetailsPage.css";
import { useEffect, useState } from "react";
import {
  getCommentsForRecipe,
  addComment,
  deleteComment,
} from "../../comments/services/commentAPI";
import CommentsList from "../../comments/components/CommentListForm";
import AddComment from "../../comments/components/AddCommentForm";
import { getRecipeById } from "../services/recipesAPI";

const RecipeDetailsPage = () => {
  const navigate = useNavigate();
  const { user, token } = useContext(AuthContext);
  const location = useLocation();
  const { recipe } = location.state || {};
  const { id } = useParams();
  const [recipeData, setRecipeData] = useState(recipe || null);
  const [loadingRecipe, setLoadingRecipe] = useState(!recipe);

  const [comments, setComments] = useState([]);
  const [loadingComments, setLoadingComments] = useState(true);

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        if (!recipe && id) {
          const data = await getRecipeById(id);
          setRecipeData(data);
        }
      } catch (err) {
        console.error("Failed to fetch recipe:", err);
      } finally {
        setLoadingRecipe(false);
      }
    };

    fetchRecipe();
  }, [id, recipe]);

  useEffect(() => {
    if (!recipeData?._id) return;

    const fetchComments = async () => {
      try {
        setLoadingComments(true);
        const data = await getCommentsForRecipe(recipeData._id);
        setComments(Array.isArray(data) ? data : []);
      } catch (e) {
        console.error(e);
      } finally {
        setLoadingComments(false);
      }
    };

    fetchComments();
  }, [recipeData?._id]);

  const handleAddComment = async (formData) => {
    const newComment = await addComment(formData);
    setComments((prev) => [newComment, ...prev]);
  };

  const handleDeleteComment = async (commentId) => {
    if (!token) {
      console.error("No token available for deleting comment");
      return;
    }

    try {
      await deleteComment(commentId, token);
      setComments((prev) => prev.filter((c) => c._id !== commentId));
    } catch (err) {
      console.error("Failed to delete comment:", err);
    }
  };

  if (loadingRecipe) return <p>Loading recipe...</p>;
  if (!recipeData) return <p>Recipe not found.</p>;

  const handleEdit = () => {
    console.log("Edit recipe:", recipeData._id);
  };

  const handleDelete = () => {
    console.log("Delete recipe:", recipeData._id);
  };

  const isAuthor =
    user &&
    recipeData.author &&
    recipeData.author.first_name === user.first_name;

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

      <h1>{recipeData.title}</h1>
      <p>
        <strong>Type:</strong> {recipeData.type_of_dish}
      </p>
      <p>
        <strong>Prep time:</strong> {recipeData.time_for_preperation}
      </p>
      <p>
        <strong>Difficulty:</strong> {recipeData.difficulty}
      </p>
      <p>
        <strong>Servings:</strong> {recipeData.number_of_people}
      </p>
      <p>
        <strong>Author:</strong>{" "}
        <Link to={`/author/${recipeData.author.author_id}`}>
          {recipeData.author.first_name} {recipeData.author.last_name}
        </Link>
      </p>

      {recipeData.image_url && (
        <img
          src={recipeData.image_url}
          alt={recipeData.title}
          className="recipe-image"
        />
      )}

      {recipeData.additional_marks &&
        recipeData.additional_marks.length > 0 && (
          <p>
            <strong>Tags:</strong> {recipeData.additional_marks.join(", ")}
          </p>
        )}

      <h2>Ingredients</h2>
      <ul>
        {recipeData.ingredients.map((item, idx) => (
          <li key={idx}>{item}</li>
        ))}
      </ul>

      <h2>Steps</h2>
      <ol>
        {recipeData.steps.map((step, idx) => (
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
        {user && (
          <AddComment recipeId={recipeData._id} onAdd={handleAddComment} />
        )}

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
