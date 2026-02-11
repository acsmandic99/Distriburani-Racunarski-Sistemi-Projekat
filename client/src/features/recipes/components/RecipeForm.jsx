import { useState } from "react";
import { addRecipe } from "../services/recipesAPI";
import "./RecipeForm.css";

const RecipeForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    title: "",
    type_of_dish: "",
    time_for_preperation: "",
    difficulty: "Easy",
    number_of_people: 1,
    ingredients: [""],
    steps: [""],
    additional_marks: [],
  });

  const [image, setImage] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleArrayChange = (field, index, value) => {
    const arr = [...formData[field]];
    arr[index] = value;
    setFormData({ ...formData, [field]: arr });
  };

  const addArrayItem = (field) => {
    setFormData({ ...formData, [field]: [...formData[field], ""] });
  };

  const removeArrayItem = (field, index) => {
    const arr = [...formData[field]];
    arr.splice(index, 1);
    setFormData({ ...formData, [field]: arr });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      if (onSubmit) {
        await onSubmit(formData, image);
        setMessage("Recipe added successfully!");
        setFormData({
          title: "",
          type_of_dish: "",
          time_for_preperation: "",
          difficulty: "Easy",
          number_of_people: 1,
          ingredients: [""],
          steps: [""],
          additional_marks: [],
        });
        setImage(null);
      }
    } catch (err) {
      setMessage(err.message || "Failed to add recipe");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="recipe-form" onSubmit={handleSubmit}>
      <input
        name="title"
        placeholder="Ime recepta"
        value={formData.title}
        onChange={handleChange}
        required
      />
      <input
        name="type_of_dish"
        placeholder="Vrsta jela"
        value={formData.type_of_dish}
        onChange={handleChange}
        required
      />
      <input
        name="time_for_preperation"
        placeholder="Vreme pripreme"
        value={formData.time_for_preperation}
        onChange={handleChange}
        required
      />
      <select
        name="difficulty"
        value={formData.difficulty}
        onChange={handleChange}
      >
        <option>Easy</option>
        <option>Medium</option>
        <option>Hard</option>
      </select>
      <input
        type="number"
        name="number_of_people"
        placeholder="Broj ljudi"
        value={formData.number_of_people}
        onChange={handleChange}
        min={1}
        required
      />

      <div className="form-section">
        <label>Sastojci</label>
        {formData.ingredients.map((ing, i) => (
          <div className="array-item" key={i}>
            <input
              value={ing}
              onChange={(e) =>
                handleArrayChange("ingredients", i, e.target.value)
              }
            />
            <button
              type="button"
              className="remove-button"
              onClick={() => removeArrayItem("ingredients", i)}
            >
              Remove
            </button>
          </div>
        ))}
        <button type="button" onClick={() => addArrayItem("ingredients")}>
          Add Ingredient
        </button>
      </div>

      <div className="form-section">
        <label>Koraci:</label>
        {formData.steps.map((step, i) => (
          <div className="array-item" key={i}>
            <input
              value={step}
              onChange={(e) => handleArrayChange("steps", i, e.target.value)}
            />
            <button
              type="button"
              className="remove-button"
              onClick={() => removeArrayItem("steps", i)}
            >
              Remove
            </button>
          </div>
        ))}
        <button type="button" onClick={() => addArrayItem("steps")}>
          Add Step
        </button>
      </div>

      <input
        type="file"
        accept="image/*"
        onChange={(e) => setImage(e.target.files[0])}
      />

      <button type="submit" disabled={loading}>
        {loading ? "Adding..." : "Add Recipe"}
      </button>
      {message && <p className="form-message">{message}</p>}
    </form>
  );
};

export default RecipeForm;
