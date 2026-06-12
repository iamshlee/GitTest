"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const TABS = [
  { href: "/", label: "홈", icon: HomeIcon },
  { href: "/compare", label: "비교", icon: ChartIcon },
  { href: "/news", label: "뉴스", icon: NewsIcon },
  { href: "/watchlist", label: "관심", icon: StarIcon },
];

export default function BottomNav() {
  const pathname = usePathname();
  return (
    <nav className="fixed inset-x-0 bottom-0 z-50">
      <div className="mx-auto max-w-[480px] border-t border-toss-line bg-toss-card/90 backdrop-blur">
        <ul className="flex items-stretch justify-around px-2 pb-[env(safe-area-inset-bottom)] pt-2">
          {TABS.map((t) => {
            const active =
              t.href === "/"
                ? pathname === "/"
                : pathname.startsWith(t.href);
            const Icon = t.icon;
            return (
              <li key={t.href} className="flex-1">
                <Link
                  href={t.href}
                  className="press flex flex-col items-center gap-1 py-1.5"
                >
                  <Icon active={active} />
                  <span
                    className={`text-[11px] font-medium ${
                      active ? "text-brand" : "text-toss-gray"
                    }`}
                  >
                    {t.label}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}

function base(active: boolean) {
  return active ? "#3182F6" : "#8B95A1";
}

function HomeIcon({ active }: { active: boolean }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path
        d="M4 11.5 12 5l8 6.5V19a1 1 0 0 1-1 1h-4v-5h-6v5H5a1 1 0 0 1-1-1v-7.5Z"
        stroke={base(active)}
        strokeWidth="1.8"
        strokeLinejoin="round"
        fill={active ? "#E8F2FF" : "none"}
      />
    </svg>
  );
}
function ChartIcon({ active }: { active: boolean }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path
        d="M5 19V5M5 19h14M9 16v-5M13 16V8M17 16v-3"
        stroke={base(active)}
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}
function NewsIcon({ active }: { active: boolean }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <rect
        x="4"
        y="5"
        width="16"
        height="14"
        rx="2"
        stroke={base(active)}
        strokeWidth="1.8"
        fill={active ? "#E8F2FF" : "none"}
      />
      <path
        d="M8 9h8M8 12h8M8 15h5"
        stroke={base(active)}
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}
function StarIcon({ active }: { active: boolean }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path
        d="m12 4 2.5 5 5.5.8-4 3.9.95 5.5L12 16.5 7.05 19.2 8 13.7l-4-3.9 5.5-.8L12 4Z"
        stroke={base(active)}
        strokeWidth="1.8"
        strokeLinejoin="round"
        fill={active ? "#E8F2FF" : "none"}
      />
    </svg>
  );
}
