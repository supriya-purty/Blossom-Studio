import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const AuthPage = () => {
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({ name: "", email: "", password: "", phoneNumber: "" });
  const [message, setMessage] = useState("");
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const submit = async (event) => {
    event.preventDefault();
    setMessage("");
    if (mode === "register" && form.password.length < 6) {
      setMessage("Password must be at least 6 characters.");
      return;
    }
    try {
      const loggedInUser =
        mode === "login" ? await login(form.email, form.password) : await register(form);
      navigate(loggedInUser.role === "admin" ? "/admin" : "/");
    } catch (error) {
      setMessage(error.response?.data?.message || "Could not connect to backend. Make sure backend is running on port 5000.");
    }
  };

  return (
    <section className="section grid min-h-[70vh] place-items-center">
      <form className="glass-card w-full max-w-md p-8" onSubmit={submit}>
        <h1 className="font-display text-4xl">{mode === "login" ? "Welcome Back" : "Create Account"}</h1>
        {message && <div className="mt-5 rounded-2xl bg-petal px-4 py-3 text-sm font-semibold">{message}</div>}
        <div className="mt-6 grid gap-4">
          {mode === "register" && <input className="input" placeholder="Full name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />}
          {mode === "register" && <input className="input" placeholder="Phone number" value={form.phoneNumber} onChange={(e) => setForm({ ...form, phoneNumber: e.target.value })} />}
          <input className="input" type="email" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          <input className="input" type="password" placeholder="Password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
        </div>
        <button className="btn-primary mt-6 w-full justify-center">{mode === "login" ? "Login" : "Register"}</button>
        <button type="button" className="mt-4 w-full text-center text-sm text-cocoa/70" onClick={() => setMode(mode === "login" ? "register" : "login")}>
          {mode === "login" ? "Need an account? Register" : "Already registered? Login"}
        </button>
      </form>
    </section>
  );
};

export default AuthPage;
