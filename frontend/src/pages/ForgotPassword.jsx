import { useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);

  const submit = async (event) => {
    event.preventDefault();
    setSending(true);
    setMessage("");

    try {
      const { data } = await api.post("/auth/forgot-password", { email });
      setMessage(data.message);
    } catch (error) {
      setMessage(error.response?.data?.message || "Could not send reset email. Check backend and Gmail SMTP.");
    } finally {
      setSending(false);
    }
  };

  return (
    <section className="section grid min-h-[70vh] place-items-center">
      <form className="glass-card w-full max-w-md p-8" onSubmit={submit}>
        <h1 className="font-display text-4xl">Forgot Password</h1>
        <p className="mt-3 text-cocoa/70">Enter your registered email to receive a reset link.</p>
        {message && <div className="mt-5 rounded-2xl bg-petal px-4 py-3 text-sm font-semibold">{message}</div>}
        <input className="input mt-6" type="email" placeholder="Registered email" value={email} onChange={(event) => setEmail(event.target.value)} required />
        <button className="btn-primary mt-6 w-full justify-center disabled:opacity-60" disabled={sending}>
          {sending ? "Sending..." : "Send Reset Link"}
        </button>
        <Link to="/login" className="mt-4 block text-center text-sm text-cocoa/70">
          Back to login
        </Link>
      </form>
    </section>
  );
};

export default ForgotPassword;
