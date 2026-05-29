import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import api from "../services/api";

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);

  const submit = async (event) => {
    event.preventDefault();
    setMessage("");

    if (password.length < 6) {
      setMessage("Password must be at least 6 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setMessage("Passwords do not match.");
      return;
    }

    setSaving(true);
    try {
      const { data } = await api.post(`/auth/reset-password/${token}`, { password });
      setMessage(data.message);
      setTimeout(() => navigate("/login"), 1200);
    } catch (error) {
      setMessage(error.response?.data?.message || "Password reset failed. The link may be expired.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="section grid min-h-[70vh] place-items-center">
      <form className="glass-card w-full max-w-md p-8" onSubmit={submit}>
        <h1 className="font-display text-4xl">Reset Password</h1>
        <p className="mt-3 text-cocoa/70">Create a new password for your Blossom Studio account.</p>
        {message && <div className="mt-5 rounded-2xl bg-petal px-4 py-3 text-sm font-semibold">{message}</div>}
        <div className="mt-6 grid gap-4">
          <input className="input" type="password" placeholder="New password" value={password} onChange={(event) => setPassword(event.target.value)} required />
          <input className="input" type="password" placeholder="Confirm new password" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} required />
        </div>
        <button className="btn-primary mt-6 w-full justify-center disabled:opacity-60" disabled={saving}>
          {saving ? "Saving..." : "Reset Password"}
        </button>
        <Link to="/login" className="mt-4 block text-center text-sm text-cocoa/70">
          Back to login
        </Link>
      </form>
    </section>
  );
};

export default ResetPassword;
