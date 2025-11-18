import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getProfile, updateProfile } from "../api";

const US_STATES = [
  "Alabama","Alaska","Arizona","Arkansas","California","Colorado","Connecticut","Delaware",
  "Florida","Georgia","Hawaii","Idaho","Illinois","Indiana","Iowa","Kansas","Kentucky",
  "Louisiana","Maine","Maryland","Massachusetts","Michigan","Minnesota","Mississippi",
  "Missouri","Montana","Nebraska","Nevada","New Hampshire","New Jersey","New Mexico",
  "New York","North Carolina","North Dakota","Ohio","Oklahoma","Oregon","Pennsylvania",
  "Rhode Island","South Carolina","South Dakota","Tennessee","Texas","Utah","Vermont",
  "Virginia","Washington","West Virginia","Wisconsin","Wyoming"
];

export default function EditProfile({ userId }) {
  const [fullName, setFullName] = useState("");
  const [age, setAge] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [state, setState] = useState("");

  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    async function load() {
      try {
        const data = await getProfile(userId);
        setFullName(data.fullName || "");
        setAge(data.age || "");
        setEmail(data.email || "");
        setAddress(data.address || "");
        setState(data.state || "");
      } catch (err) {
        console.error(err);
      }
    }
    load();
  }, [userId]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateProfile(userId, {
        fullName,
        age: age ? parseInt(age, 10) : null,
        email,
        address,
        state,
      });
      navigate("/profile");   // 保存后返回查看页面
    } catch (err) {
      console.error(err);
      alert("Failed to save profile.");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    navigate("/profile");
  };

  return (
    <div className="container">
      <h2>Edit Profile</h2>

      <div className="profile-form">
        <label>
          Name:
          <input
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />
        </label>

        <label>
          Age:
          <input
            type="number"
            min="0"
            value={age}
            onChange={(e) => setAge(e.target.value)}
          />
        </label>

        <label>
          Email:
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>

        <label>
          Address:
          <input
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
        </label>

        <label>
          State:
          <select value={state || ""} onChange={(e) => setState(e.target.value)}>
            <option value="">Select a state</option>
            {US_STATES.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </label>
      </div>

      <div className="profile-actions">
        <button onClick={handleCancel} disabled={saving}>
          Cancel
        </button>
        <button className="primary-btn" onClick={handleSave} disabled={saving}>
          {saving ? "Saving..." : "Save"}
        </button>
      </div>
    </div>
  );
}
