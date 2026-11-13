/* Brand logos are files in /public/logos (see README for licences).
   Concept skills get thin line icons drawn in the same 24px grid. */

type Brand = { src: string; tint: string; label: string };

export const BRAND: Record<string, Brand> = {
  figma: { src: "/logos/devicon/figma.svg", tint: "#a259ff", label: "Figma logo" },
  sketch: { src: "/logos/devicon/sketch.svg", tint: "#fdb300", label: "Sketch logo" },
  webflow: { src: "/logos/devicon/webflow.svg", tint: "#4353ff", label: "Webflow logo" },
  miro: { src: "/logos/simple-icons/miro.svg", tint: "#ffd02f", label: "Miro logo" },
  framer: { src: "/logos/simple-icons/framer.svg", tint: "#0055ff", label: "Framer logo" },
};

const S = { fill: "none", stroke: "currentColor", strokeWidth: 1.2, strokeLinecap: "round", strokeLinejoin: "round" } as const;

export const CONCEPT: Record<string, React.ReactNode> = {
  // InVision has no openly licensed logo in devicon / simple-icons, so it gets a neutral monogram.
  invision: (
    <>
      <rect x="3" y="3" width="18" height="18" rx="4" {...S} />
      <text x="12" y="15.6" textAnchor="middle" fontSize="7.5" fontFamily="var(--font-mono)" fill="currentColor">
        Iv
      </text>
    </>
  ),
  wireframing: (
    <>
      <rect x="3" y="4" width="18" height="16" rx="2" {...S} />
      <path d="M3 8h18M6 11h6M6 14h4M14 11h4v6h-4z" {...S} />
    </>
  ),
  prototyping: (
    <>
      <rect x="3" y="5" width="7" height="6" rx="1.5" {...S} />
      <rect x="14" y="13" width="7" height="6" rx="1.5" {...S} />
      <path d="M10 8h3a2 2 0 0 1 2 2v3" {...S} />
      <path d="m13.4 11.4 1.6 1.6 1.6-1.6" {...S} />
    </>
  ),
  "user-research": (
    <>
      <circle cx="10" cy="9" r="3.2" {...S} />
      <path d="M4.5 19c.8-3 3-4.6 5.5-4.6 1.4 0 2.7.5 3.7 1.4" {...S} />
      <circle cx="17" cy="16.5" r="2.6" {...S} />
      <path d="m19 18.5 2 2" {...S} />
    </>
  ),
  "usability-testing": (
    <>
      <rect x="3" y="4" width="18" height="13" rx="2" {...S} />
      <path d="m8 10.5 2.5 2.5L16 8M9 20h6M12 17v3" {...S} />
    </>
  ),
  "design-thinking": (
    <>
      <path d="M9 18h6M10 21h4" {...S} />
      <path d="M12 3a6 6 0 0 0-3.6 10.8c.5.4.8 1 .8 1.6V16h5.6v-.6c0-.6.3-1.2.8-1.6A6 6 0 0 0 12 3Z" {...S} />
      <path d="M12 7v3l2 1.5" {...S} />
    </>
  ),
  "design-systems": (
    <>
      <rect x="3" y="3" width="7.5" height="7.5" rx="1.5" {...S} />
      <circle cx="17.25" cy="6.75" r="3.75" {...S} />
      <path d="M6.75 13.5 10.5 21h-7.5z" {...S} />
      <rect x="13.5" y="13.5" width="7.5" height="7.5" rx="3.75" {...S} />
    </>
  ),
  responsive: (
    <>
      <rect x="2.5" y="4" width="14" height="10" rx="1.5" {...S} />
      <path d="M7 18h5M9.5 14v4" {...S} />
      <rect x="15.5" y="9" width="6" height="11" rx="1.5" {...S} />
      <path d="M18 17.8h1" {...S} />
    </>
  ),
};

export function isBrand(key: string): boolean {
  return key in BRAND;
}

export default function TechLogo({ k, size = 24, label }: { k: string; size?: number; label?: string }) {
  const b = BRAND[k];
  if (b) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={b.src} width={size} height={size} alt={label ?? b.label} style={{ width: size, height: size }} />;
  }
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
    >
      {CONCEPT[k]}
    </svg>
  );
}
