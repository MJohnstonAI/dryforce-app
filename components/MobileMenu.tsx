"use client";

import { useEffect, useId, useState } from "react";
import Link from "next/link";
import MaterialSymbol from "@/components/MaterialSymbol";

type MobileMenuLink = {
  label: string;
  href: string;
};

type MobileMenuProps = {
  links: MobileMenuLink[];
  emergencyLabel: string;
  emergencyHref: string;
  wrapperClassName?: string;
  buttonClassName?: string;
};

export default function MobileMenu({
  links,
  emergencyLabel,
  emergencyHref,
  wrapperClassName,
  buttonClassName,
}: MobileMenuProps) {
  const [open, setOpen] = useState(false);
  const panelId = useId();

  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  const closeMenu = () => setOpen(false);
  const toggleMenu = () => setOpen((current) => !current);
  const buttonClasses = buttonClassName ?? "p-2";

  const wrapperClasses = wrapperClassName ?? "md:hidden";

  return (
    <div className={wrapperClasses}>
      <button
        className={buttonClasses}
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        aria-label={open ? "Close menu" : "Open menu"}
        onClick={toggleMenu}
      >
        <MaterialSymbol name={open ? "close" : "menu"} />
      </button>
      {open ? (
        <div className="fixed inset-0 z-[60]">
          <button
            className="absolute inset-0 bg-slate-900/40"
            type="button"
            aria-label="Close menu"
            onClick={closeMenu}
          />
          <div
            className="absolute left-4 right-4 top-20 rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-700 dark:bg-surface-dark"
            id={panelId}
            role="dialog"
            aria-modal="true"
            aria-label="Mobile navigation"
          >
            <nav className="flex flex-col gap-4">
              {links.map((link) => {
                const isInternal = link.href.startsWith("/");
                const linkClasses =
                  "text-base font-semibold text-slate-900 transition-colors hover:text-primary dark:text-white";

                if (isInternal) {
                  return (
                    <Link
                      className={linkClasses}
                      href={link.href}
                      key={`${link.label}-${link.href}`}
                      onClick={closeMenu}
                    >
                      {link.label}
                    </Link>
                  );
                }

                return (
                  <a
                    className={linkClasses}
                    href={link.href}
                    key={`${link.label}-${link.href}`}
                    onClick={closeMenu}
                  >
                    {link.label}
                  </a>
                );
              })}
            </nav>
            <a
              className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-secondary px-4 py-3 text-sm font-bold text-white shadow-lg shadow-red-500/20 transition-colors hover:bg-red-700"
              href={emergencyHref}
              onClick={closeMenu}
            >
              <MaterialSymbol name="call" className="text-[20px]" />
              {emergencyLabel}
            </a>
          </div>
        </div>
      ) : null}
    </div>
  );
}
