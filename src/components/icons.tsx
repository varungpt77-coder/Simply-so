import type { CSSProperties } from "react";

export type IconName = "arrow" | "arrow-up" | "search" | "bag" | "close" | "plus" | "minus" | "menu" | "chevron" | "drop" | "leaf" | "shield" | "truck" | "thermometer" | "check" | "star" | "recycle" | "lock" | "trash" | "instagram";

export function Icon({ name, size = 22, className = "", style }: { name: IconName; size?: number; className?: string; style?: CSSProperties }) {
  const paths: Record<IconName, React.ReactNode> = {
    arrow: <><path d="M4 12h15M13 6l6 6-6 6" /></>,
    "arrow-up": <><path d="M5 19 19 5M5 5h14v14" /></>,
    search: <><circle cx="10.8" cy="10.8" r="6.8" /><path d="m16 16 4.5 4.5" /></>,
    bag: <><path d="M5 7.5h14l1.2 13H3.8L5 7.5Z" /><path d="M8.5 8V6a3.5 3.5 0 0 1 7 0v2" /></>,
    close: <path d="m6 6 12 12M18 6 6 18" />,
    plus: <path d="M12 5v14M5 12h14" />,
    minus: <path d="M5 12h14" />,
    menu: <path d="M4 7h16M4 12h16M4 17h16" />,
    chevron: <path d="m7 10 5 5 5-5" />,
    drop: <><path d="M12 2.5C9.8 6.2 5 10.5 5 14.6a7 7 0 0 0 14 0C19 10.5 14.2 6.2 12 2.5Z" /><path d="M8.6 15.4a3.6 3.6 0 0 0 3.5 3.2" /></>,
    leaf: <><path d="M20.5 3.5C9 2.5 3.4 8.2 5.2 14.5c1.7 6.1 8.6 6.2 12 .5 1.5-2.5 2.8-6.4 3.3-11.5Z" /><path d="M3 21 15.5 8.5M9 15l.2-5M13 11h4.3" /></>,
    shield: <><path d="M12 3 4.5 6v5.4c0 5.4 7.5 9.6 7.5 9.6s7.5-4.2 7.5-9.6V6L12 3Z" /><path d="m8.5 11.5 2.4 2.4 4.6-4.7" /></>,
    truck: <><path d="M2 5h12v12H2zM14 9h4l4 4v4h-8" /><circle cx="6" cy="18" r="2" /><circle cx="18" cy="18" r="2" /></>,
    thermometer: <><path d="M9 14.4V5a3 3 0 0 1 6 0v9.4a5 5 0 1 1-6 0Z" /><path d="M12 7v11M18 6h3M18 10h2" /><circle cx="12" cy="18" r="1" /></>,
    check: <path d="m5 12 4.5 4.5L19 7" />,
    star: <path d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2-5.6-3-5.6 3 1.1-6.2L3 9.6l6.2-.9L12 3Z" />,
    recycle: <><path d="m8 5 2-3 5 8M15 5l.5 5-5-.5M19 9l3 5-4 7h-6M20 17l-2 4 4 1M8 21H4l-3-7 4-6M1 9l4-1 1 4" /></>,
    lock: <><rect x="5" y="10" width="14" height="11" rx="2" /><path d="M8 10V6a4 4 0 0 1 8 0v4M12 14v3" /></>,
    trash: <><path d="M3 6h18M9 6V3h6v3M5 6l1 15h12l1-15M10 10v7M14 10v7" /></>,
    instagram: <><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><path d="M17.5 6.5h.01" /></>,
  };
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className} style={style} aria-hidden="true">{paths[name]}</svg>;
}
