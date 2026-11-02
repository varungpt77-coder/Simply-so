"use client";

import { useEffect, useId, useRef, type ReactNode } from "react";
import { Icon } from "@/components/icons";

export function Modal({ children, title, onClose, kind = "standard" }: { children: ReactNode; title: string; onClose: () => void; kind?: "standard" | "drawer" | "wide" | "search" }) {
  const ref = useRef<HTMLDivElement>(null);
  const closeRef = useRef(onClose);
  closeRef.current = onClose;
  const titleId = useId();
  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null;
    const oldOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const focusTimeout = setTimeout(() => {
      const target = ref.current?.querySelector<HTMLElement>("[data-autofocus]") || ref.current?.querySelector<HTMLElement>("input, button");
      target?.focus();
    }, 50);
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeRef.current();
      if (event.key === "Tab") {
        const elements = ref.current?.querySelectorAll<HTMLElement>('button:not([disabled]), a[href], input:not([disabled]), select, textarea, [tabindex="0"]');
        if (!elements?.length) return;
        const first = elements[0];
        const last = elements[elements.length - 1];
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
      }
    };
    document.addEventListener("keydown", handleKey);
    return () => {
      clearTimeout(focusTimeout);
      document.body.style.overflow = oldOverflow;
      document.removeEventListener("keydown", handleKey);
      previous?.focus();
    };
  }, []);
  return <div className={`modal-backdrop ${kind === "drawer" ? "drawer-backdrop" : ""}`} onClick={(event) => { if (event.target === event.currentTarget) onClose(); }}><div className={`modal-panel modal-${kind}`} role="dialog" aria-modal="true" aria-labelledby={titleId} ref={ref}><div className="modal-header"><h2 id={titleId}>{title}</h2><button className="icon-button modal-close" onClick={onClose} aria-label="Close dialog"><Icon name="close" /></button></div>{children}</div></div>;
}
