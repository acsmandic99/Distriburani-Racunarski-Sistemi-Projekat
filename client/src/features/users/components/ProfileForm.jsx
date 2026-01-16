import { useState, useEffect } from "react";

const ProfileForm = ({ user, onSubmit }) => {
  const [formData, setFormData] = useState({
    first_name: user.first_name || "",
    last_name: user.last_name || "",
    email: user.email || "",
    country: user.country || "",
    city: user.city || "",
  });

  const [avatar, setAvatar] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(
    user.profile_picture || "",
  );
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (avatar) {
      const reader = new FileReader();
      reader.onloadend = () => setAvatarPreview(reader.result);
      reader.readAsDataURL(avatar);
    } else {
      setAvatarPreview(user.profile_picture || "");
    }
  }, [avatar, user.profile_picture]);

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
      <div className="avatar-preview">
        {avatarPreview ? (
          <img src={avatarPreview} alt="Avatar Preview" />
        ) : (
          <p>No avatar</p>
        )}
      </div>

      <input
        type="file"
        accept="image/*"
        onChange={(e) => setAvatar(e.target.files[0])}
      />

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
        name="city"
        placeholder="City"
        value={formData.city}
        onChange={handleChange}
      />

      <button type="submit">Save</button>

      {message && <p className="form-message">{message}</p>}
    </form>
  );
};

export default ProfileForm;
