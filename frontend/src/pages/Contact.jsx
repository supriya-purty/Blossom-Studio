import { useState } from "react";
import { Mail, MapPin, Phone } from "lucide-react";
import SectionHeader from "../components/SectionHeader";
import { contactDetails } from "../data/catalog";
import api from "../services/api";

const Contact = () => {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [status, setStatus] = useState("");
  const [sending, setSending] = useState(false);

  const updateForm = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const sendMessage = async (event) => {
    event.preventDefault();
    setSending(true);
    setStatus("");

    try {
      const { data } = await api.post("/contact", form);
      setStatus(data.message || "Your message was sent to Blossom Studio.");
      setForm({ name: "", email: "", subject: "", message: "" });
    } catch (error) {
      setStatus(error.response?.data?.message || "Message could not be sent. Please check backend, MongoDB and Gmail SMTP.");
    } finally {
      setSending(false);
    }
  };

  return (
    <section className="section">
      <SectionHeader eyebrow="Contact" title="Let Us Craft Something Sweet" />
      <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="grid gap-4">
          {[
            [Phone, `+91 ${contactDetails.phone}`],
            [Mail, contactDetails.email],
            [MapPin, "Jamshedpur, India"]
          ].map(([Icon, text]) => (
            <div key={text} className="glass-card flex items-center gap-4 p-5">
              <Icon className="text-blush" />
              <span>{text}</span>
            </div>
          ))}
          <img className="rounded-[2rem] shadow-soft" src="/blossom-contact.jpeg" alt="Blossom Studio contact card" />
        </div>
        <form className="glass-card grid gap-4 p-6 md:p-8" onSubmit={sendMessage}>
          {status && <p className="rounded-2xl bg-petal px-4 py-3 text-sm font-semibold">{status}</p>}
          <input className="input" placeholder="Your name" value={form.name} onChange={(event) => updateForm("name", event.target.value)} required />
          <input className="input" type="email" placeholder="Email address" value={form.email} onChange={(event) => updateForm("email", event.target.value)} required />
          <input className="input" placeholder="Subject" value={form.subject} onChange={(event) => updateForm("subject", event.target.value)} required />
          <textarea className="input min-h-36 resize-none" placeholder="Message or custom order request" value={form.message} onChange={(event) => updateForm("message", event.target.value)} required />
          <button className="btn-primary justify-center disabled:opacity-60" type="submit" disabled={sending}>
            {sending ? "Sending..." : "Send message"}
          </button>
        </form>
      </div>
    </section>
  );
};

export default Contact;
