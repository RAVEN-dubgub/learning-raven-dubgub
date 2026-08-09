"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/learn", label: "// Lessons" },
  { href: "/dashboard", label: "// Dashboard" },
  { href: "/login", label: "// Auth" },
];

export function NavLinks() {
  const pathname = usePathname();

  return (
    <nav className="flex items-center gap-1 sm:gap-2">
      {links.map(({ href, label }) => {
        const active = pathname === href || pathname.startsWith(`${href}/`);
        return (
          <Link
            key={href}
            href={href}
            className={`nav-link ${active ? "nav-link--active" : ""}`}
          >
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
