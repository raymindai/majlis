"use client";

import { useEffect, useState } from "react";
import { FloatingWindow } from "@/components/floating-window";
import { loadNotes, NOTES_EVENT, removeNote, updateNotePos, type Note } from "@/lib/notes";
import { C, CitationChip, ConfidenceBadge } from "@/components/ui";
import { useCitation } from "@/components/citation-context";
import type { Confidence } from "@/lib/corpus";

/** Renders every saved note as its own floating window. */
export default function NotesLayer() {
  const { open } = useCitation();
  const [notes, setNotes] = useState<Note[]>([]);

  useEffect(() => {
    const sync = () => setNotes(loadNotes());
    sync();
    window.addEventListener(NOTES_EVENT, sync);
    return () => window.removeEventListener(NOTES_EVENT, sync);
  }, []);

  return (
    <>
      {notes.map((n) => (
        <FloatingWindow
          key={n.id}
          title="Note"
          anchor={n.pos}
          onClose={() => removeNote(n.id)}
          onMove={(pos) => updateNotePos(n.id, pos)}
          initialW={340}
          initialH={300}
        >
          <div className="text-[13px] font-semibold leading-snug">{n.title}</div>
          <p className="text-[13px] mt-2 leading-relaxed" style={{ color: C.detail }}>{n.summary}</p>
          {n.claims.length > 0 && (
            <div className="mt-3 pt-3 border-t space-y-2.5" style={{ borderColor: C.line }}>
              {n.claims.map((c, i) => (
                <div key={i} className="text-[12px]">
                  <div style={{ color: C.detail }} className="leading-snug">{c.text}</div>
                  <div className="mt-1 flex items-center gap-1.5 flex-wrap">
                    <ConfidenceBadge confidence={c.confidence as Confidence} />
                    <CitationChip sourceId={c.sourceId} onClick={(pos) => open({ sourceId: c.sourceId, passageId: c.passageId }, pos)} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </FloatingWindow>
      ))}
    </>
  );
}
