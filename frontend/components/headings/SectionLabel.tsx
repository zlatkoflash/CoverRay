export default function SectionLabel({ number, children }: { number: number, children: React.ReactNode }) {
  return (
    <>
      <div className="section-label">
        <div className="section-number">{number}</div>
        {children}
      </div>
    </>
  );
}