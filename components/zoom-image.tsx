"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Maximize2, X } from "lucide-react";

/** An image that opens full-size in a dismissable lightbox on click. */
export default function ZoomImage({
  src,
  alt,
  width,
  height,
  className = "",
}: {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
}) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className="group relative block w-full cursor-zoom-in" aria-label="Enlarge image">
        <Image src={src} alt={alt} width={width} height={height} priority className={className} />
        <span
          className="absolute bottom-3 right-3 inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-[11px] font-medium opacity-90 group-hover:opacity-100 transition-opacity"
          style={{ background: "rgba(20,16,10,0.6)", color: "#fff", backdropFilter: "blur(2px)" }}
        >
          <Maximize2 size={12} strokeWidth={2.25} /> Enlarge
        </span>
      </button>

      {open && (
        <div
          className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-8 cursor-zoom-out majlis-fade-up"
          style={{ background: "rgba(20,16,10,0.86)" }}
          onClick={() => setOpen(false)}
        >
          <Image
            src={src}
            alt={alt}
            width={width}
            height={height}
            className="max-w-full max-h-[92vh] w-auto h-auto rounded-lg"
            style={{ boxShadow: "0 24px 80px rgba(0,0,0,0.5)" }}
          />
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="absolute top-5 right-5 inline-flex items-center justify-center rounded-full p-2 cursor-pointer hover:opacity-80"
            style={{ background: "rgba(255,255,255,0.14)", color: "#fff" }}
            aria-label="Close"
          >
            <X size={20} strokeWidth={2.25} />
          </button>
        </div>
      )}
    </>
  );
}
