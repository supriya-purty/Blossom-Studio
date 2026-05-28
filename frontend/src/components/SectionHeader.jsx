const SectionHeader = ({ eyebrow, title, text }) => (
  <div className="mx-auto mb-10 max-w-2xl text-center">
    <span className="text-sm font-semibold uppercase tracking-[0.24em] text-cocoa/60">{eyebrow}</span>
    <h2 className="mt-3 font-display text-4xl font-semibold text-cocoa md:text-5xl">{title}</h2>
    {text && <p className="mt-4 text-cocoa/70">{text}</p>}
  </div>
);

export default SectionHeader;
