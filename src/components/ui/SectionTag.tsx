export default function SectionTag({ index, label, className = "" }: { index: string; label: string; className?: string }) {
  return (
    <p className={`tag rv ${className}`}>
      <b>{index}</b>
      <i aria-hidden="true" />
      {label}
    </p>
  );
}
