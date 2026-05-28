import SectionHeader from "../components/SectionHeader";

const About = () => (
  <section className="section">
    <SectionHeader eyebrow="About" title="Handmade With Care In Jamshedpur" />
    <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
      <img
        className="h-full min-h-96 rounded-[2rem] object-cover shadow-soft"
        src="/blossom-hero-crochet-pipecleaner.png"
        alt="Blossom Studio handmade crochet and pipe cleaner crafts"
      />
      <div className="glass-card p-8 md:p-10">
        <h2 className="font-display text-4xl">Blossom Studio</h2>
        <p className="mt-5 text-lg leading-8 text-cocoa/75">
          Blossom Studio is a small handmade craft boutique from Jamshedpur, created for people who
          love thoughtful gifts with a personal touch. We make soft crochet pieces, pipe-cleaner
          flowers, aesthetic decor, and custom gift sets that feel warm, pretty, and meaningful.
        </p>
        <p className="mt-4 text-lg leading-8 text-cocoa/75">
          Every product is planned, shaped, wrapped, and packed with care. Whether it is a birthday
          hamper, a desk flower bouquet, or a cute crochet keepsake, our goal is to make handmade
          gifting simple, beautiful, and memorable.
        </p>
        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          {["Made by hand", "Gift-ready packing", "Custom orders"].map((item) => (
            <div key={item} className="rounded-[1.5rem] bg-white/60 p-5 text-center font-semibold">{item}</div>
          ))}
        </div>
      </div>
    </div>
  </section>
);

export default About;
