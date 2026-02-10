const CommentsList = ({ comments = [], currentUser, onDelete }) => {
  if (!Array.isArray(comments) || comments.length === 0) {
    return <p>No comments yet.</p>;
  }

  return (
    <div>
      {comments.map((comment) => (
        <div key={comment._id} className="comment-item">
          <div className="comment-header">
            <strong>
              {comment.comment_author.first_name}{" "}
              {comment.comment_author.last_name}
            </strong>
            <span className="comment-date">
              {new Date(comment.created_at).toLocaleString()}
            </span>
          </div>

          <p className="comment-body">{comment.body}</p>

          {comment.image_url && (
            <img
              src={comment.image_url}
              alt="comment"
              className="comment-image"
            />
          )}

          {currentUser &&
            currentUser._id === comment.comment_author.author_id && (
              <button
                className="comment-delete"
                onClick={() => onDelete(comment._id)}
              >
                Delete
              </button>
            )}
        </div>
      ))}
    </div>
  );
};

export default CommentsList;
