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
  const [avatarPreview, setAvatarPreview] = useState("");

  const [message, setMessage] = useState("");

  // Helper to get full avatar URL
  const getAvatarUrl = (path) => {
    if (!path) return "";
    if (path.startsWith("http://") || path.startsWith("https://")) return path;
    return `http://localhost:5000${path}`;
  };

  useEffect(() => {
    if (avatar) {
      // New upload
      const reader = new FileReader();
      reader.onloadend = () => setAvatarPreview(reader.result);
      reader.readAsDataURL(avatar);
    } else {
      setAvatarPreview(getAvatarUrl(user.profile_picture));
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
      await onSubmit(formData, avatar);

      if (passwordData.old_password && passwordData.new_password) {
        await changePassword(
          passwordData.old_password,
          passwordData.new_password,
        );
      }

      setMessage("Uspešno ste ažurirali profil!");
      setPasswordData({ old_password: "", new_password: "" });
    } catch (err) {
      console.error("CHANGE PASSWORD ERROR:", err.response?.data);
      setMessage(err.response?.data?.message || "Update failed");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="avatar-preview">
        {avatarPreview ? (
          <img src={avatarPreview} alt="Avatar Preview" />
        ) : (
          <p>Nemate sliku</p>
        )}
      </div>

      <input
        type="file"
        accept="image/*"
        onChange={(e) => setAvatar(e.target.files[0])}
      />

      <input
        name="first_name"
        placeholder="Ime"
        value={formData.first_name}
        onChange={handleFormChange}
        required
      />

      <input
        name="last_name"
        placeholder="Prezime"
        value={formData.last_name}
        onChange={handleFormChange}
        required
      />

      <input name="email" value={formData.email} disabled />

      <input
        type="password"
        name="old_password"
        placeholder="Trenutni password"
        value={passwordData.old_password}
        onChange={handlePasswordChange}
      />

      <input
        type="password"
        name="new_password"
        placeholder="Novi password"
        value={passwordData.new_password}
        onChange={handlePasswordChange}
      />

      <input
        name="country"
        placeholder="Država"
        value={formData.country}
        onChange={handleFormChange}
      />

      <input
        name="city"
        placeholder="Grad"
        value={formData.city}
        onChange={handleFormChange}
      />

      <button type="submit">Sačuvaj</button>

      {message && <p className="form-message">{message}</p>}
    </form>
  );
};

export default ProfileForm;
