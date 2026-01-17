import { useState, useEffect } from "react";
import { changePassword } from "../services/usersAPI";

const ProfileForm = ({ user, onSubmit }) => {
  const [formData, setFormData] = useState({
    first_name: user.first_name || "",
    last_name: user.last_name || "",
    email: user.email || "",
    country: user.country || "",
    city: user.city || "",
  });
  const [passwordData, setPasswordData] = useState({
    old_password: "",
    new_password: "",
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

  const handleFormChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const handlePasswordChange = (e) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  setMessage("");

  try {
    // update profila
    await onSubmit(formData, avatar);

    if (passwordData.old_password && passwordData.new_password) {
      await changePassword(
        passwordData.old_password,
        passwordData.new_password
      );
    }

    setMessage("Profile updated successfully");
    setPasswordData({ old_password: "", new_password: "" });
  } catch (err) {
    console.error("CHANGE PASSWORD ERROR:", err.response?.data);
  setMessage(
    err.response?.data?.message || "Update failed")
  }
};


  return (
    <form onSubmit={handleSubmit}>
      <div className="avatar-preview">
        {avatarPreview ? (
          <img src={avatarPreview} alt="Avatar Preview"/>
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
        onChange={handleFormChange}
        required
      />

      <input
        name="last_name"
        placeholder="Last name"
        value={formData.last_name}
        onChange={handleFormChange}
        required
      />

      <input name="email" value={formData.email} disabled />

      <input
        type="password"
        name="old_password"
        placeholder="Current password"
        value={passwordData.old_password}
        onChange={handlePasswordChange}
      />

      <input
        type="password"
        name="new_password"
        placeholder="New password"
        value={passwordData.new_password}
        onChange={handlePasswordChange}
      />

      <input
        name="country"
        placeholder="Country"
        value={formData.country}
        onChange={handleFormChange}
      />

      <input
        name="city"
        placeholder="City"
        value={formData.city}
        onChange={handleFormChange}
      />

      <button type="submit">Save</button>

      {message && <p className="form-message">{message}</p>}
    </form>
  );
};

export default ProfileForm;
