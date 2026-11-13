import type { ReactNode } from "react";

/** Section heading: bold lines that slide up from a mask, ending in one serif italic accent word. */
export default function Heading({
  id,
  lines,
  accent,
  className = "",
  as: Tag = "h2",
}: {
  id?: string;
  lines: ReactNode[];
  accent: string;
  className?: string;
  as?: "h2" | "h3";
}) {
  return (
    <Tag id={id} className={`h2 ${className}`}>
      {lines.map((l, i) => (
        <span key={i} className="rv-mask" style={{ ["--i" as string]: i }}>
          <span>
            {l}
            {i === lines.length - 1 && (
              <>
                {" "}
                <span className="accent">{accent}</span>
              </>
            )}
          </span>
        </span>
      ))}
    </Tag>
  );
}
