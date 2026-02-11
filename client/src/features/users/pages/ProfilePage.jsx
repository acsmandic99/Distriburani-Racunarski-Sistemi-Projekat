import { useContext, useState } from "react";
import { AuthContext } from "../../shared/contexts/AuthContext";
import ProfileForm from "../components/ProfileForm";
import { useNavigate } from "react-router-dom";
import { updateProfile } from "../services/usersAPI";
import "../components/Profile.css";

const ProfilePage = () => {
  const { user, setUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const [message, setMessage] = useState("");

  const handleUpdate = async (formData, avatar) => {
    try {
      const updatedUser = await updateProfile(formData, avatar);

      // Update context so UI shows new data
      setUser(updatedUser);

      setMessage("Uspešno ste ažurirali profil!");
      setTimeout(() => navigate("/recipes"), 1000);
    } catch (err) {
      console.error("Profile update failed", err);
      setMessage("Neuspešno ažuriranje profila.");
    }
  };

  if (!user) return null;

  return (
    <div className="profile-page">
      <div className="profile-container">
        <h1>Moj profil</h1>
        {message && <p className="message">{message}</p>}
        <ProfileForm user={user} onSubmit={handleUpdate} />
      </div>
    </div>
  );
};

export default ProfilePage;
