import { useState } from "react";

const ProfileForm = ({ user, onSubmit }) => {
  const [formData, setFormData] = useState({
    first_name: user.first_name || "",
    last_name: user.last_name || "",
    email: user.email || "",
    country: user.country || "",
    street: user.street || "",
  });

  const [avatar, setAvatar] = useState(null);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.first_name || !formData.last_name) {
      setMessage("First and last name are required");
      return;
    }

    try {
      if (onSubmit) {
        await onSubmit(formData, avatar);
      }
    } catch {
      setMessage("Update failed");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        name="first_name"
        placeholder="First name"
        value={formData.first_name}
        onChange={handleChange}
        required
      />

      <input
        name="last_name"
        placeholder="Last name"
        value={formData.last_name}
        onChange={handleChange}
        required
      />

      <input name="email" value={formData.email} disabled />

      <input
        name="country"
        placeholder="Country"
        value={formData.country}
        onChange={handleChange}
      />

      <input
        name="street"
        placeholder="Street"
        value={formData.street}
        onChange={handleChange}
      />

      <input
        type="file"
        accept="image/*"
        onChange={(e) => setAvatar(e.target.files[0])}
      />

      <button type="submit">Save</button>

      {message && <p>{message}</p>}
    </form>
  );
};

export default ProfileForm;
