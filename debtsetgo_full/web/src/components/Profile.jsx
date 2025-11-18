import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getProfile } from "../api";

export default function Profile({ userId, setUserName }) {
  const [profile, setProfile] = useState({
    fullName: "",
    age: "",
    email: "",
    address: "",
    state: "",
  });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchProfile() {
      try {
        const data = await getProfile(userId);
        setProfile({
          fullName: data.fullName || "",
          age: data.age || "",
          email: data.email || "",
          address: data.address || "",
          state: data.state || "",
        });

        // 更新顶栏显示的用户名
        if (data.fullName) {
          setUserName(data.fullName);
          localStorage.setItem("userName", data.fullName);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, [userId, setUserName]);

  if (loading) {
    return (
      <div className="container">
        <h2>Profile</h2>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="container">
      <h2>Profile</h2>

      <div className="profile-card">
        <p>
          <strong>Name:</strong> {profile.fullName}
        </p>
        <p>
          <strong>Age:</strong> {profile.age}
        </p>
        <p>
          <strong>Email:</strong> {profile.email}
        </p>
        <p>
          <strong>Address:</strong> {profile.address}
        </p>
        <p>
          <strong>State:</strong> {profile.state}
        </p>
      </div>

      {/* 按钮区域：左边返回首页，右边编辑资料 */}
      <div className="profile-actions">
        <button onClick={() => navigate("/app")}>
          Back to Home
        </button>

        <button
          className="primary-btn"
          onClick={() => navigate("/profile/edit")}
        >
          Edit Profile
        </button>
      </div>
    </div>
  );
}
