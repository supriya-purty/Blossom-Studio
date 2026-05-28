import SectionHeader from "../components/SectionHeader";

const faqs = [
  ["How long does delivery take?", "Most handmade orders are packed within 2-4 working days. Customized products may take longer depending on design."],
  ["Can I request a custom product?", "Yes. Use the Contact page or WhatsApp link and share your color, size, name, and gifting details."],
  ["How do I track my order?", "Login to your account and open Profile. Your latest order status is shown in Order History."],
  ["Are payments secure?", "Yes. The project includes Razorpay payment integration for secure checkout."],
  ["Can I cancel an order?", "Contact Blossom Studio as soon as possible. Orders already packed or shipped may not be cancellable."]
];

const FAQ = () => (
  <section className="section">
    <SectionHeader eyebrow="Help" title="Frequently Asked Questions" text="Quick answers for orders, custom gifts, delivery, and payments." />
    <div className="mx-auto grid max-w-4xl gap-4">
      {faqs.map(([question, answer]) => (
        <details key={question} className="glass-card p-5">
          <summary className="cursor-pointer font-display text-2xl font-semibold">{question}</summary>
          <p className="mt-3 text-cocoa/70">{answer}</p>
        </details>
      ))}
    </div>
  </section>
);

export default FAQ;
