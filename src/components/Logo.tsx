import { Link } from "react-router-dom";

/**
 * B4NDX logomark: a graphite tile with a copper rail and a notched corner —
 * pure geometry, no glyph fonts required.
 */
export function Logomark({ size = 22 }: { size?: number }) {
  return (
    <svg
      viewBox="0 0 22 22"
      width={size}
      height={size}
      aria-hidden
      className="shrink-0"
    >
      <rect x="0.5" y="0.5" width="21" height="21" fill="#15181D" stroke="rgba(236,239,241,0.18)" />
      <path d="M21.5 8V0.5H14L21.5 8Z" fill="#1A1E24" stroke="rgba(236,239,241,0.18)" strokeWidth="1" />
      <rect x="4" y="5" width="2.5" height="12" fill="#D28E5F" />
      <rect x="9.5" y="5" width="2.5" height="12" fill="#ECEFF1" />
      <rect x="15" y="5" width="2.5" height="7" fill="#ECEFF1" opacity="0.55" />
    </svg>
  );
}

export function Logo() {
  return (
    <Link
      to="/"
      className="group flex items-center gap-2.5"
      aria-label="B4NDX Utility — home"
    >
      <Logomark />
      <span className="font-display text-[17px] font-bold tracking-[-0.01em] text-ink-1">
        B4NDX
      </span>
      <span
        aria-hidden
        className="mt-0.5 border-l border-line-2 pl-2.5 font-mono text-[0.5625rem] font-medium uppercase tracking-[0.22em] text-ink-3 transition-colors group-hover:text-ink-2"
      >
        Utility
      </span>
    </Link>
  );
}
