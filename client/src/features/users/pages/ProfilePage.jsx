import { useContext } from "react";
import { AuthContext } from "../../shared/contexts/AuthContext";
import ProfileForm from "../components/ProfileForm";
import { useNavigate } from "react-router-dom";
import { updateProfile } from "../services/usersAPI";
import "../components/Profile.css";

const ProfilePage = () => {
  const { user /*, setUser */ } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleUpdate = async (formData, avatar) => {
    try {
      /*
      // Otkomentarisati kad se usersAPI otkomentarise, slobodno promeniti logiku ako treba

      const updatedUser = await updateProfile(formData, avatar);

      // Optional: keep AuthContext in sync
      setUser(updatedUser);
      */

      // Placeholder za sada
      console.log("[ProfilePage] Updating profile:", formData, avatar);

      navigate("/recipes");
    } catch (err) {
      console.error("Profile update failed", err);
    }
  };

  if (!user) return null;

  return (
    <div className="profile-page">
      <div className="profile-container">
        <h1>My Profile</h1>
        <ProfileForm user={user} onSubmit={handleUpdate} />
      </div>
    </div>
  );
};

export default ProfilePage;
