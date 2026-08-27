import { useState } from "react";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { Plus, Trash2, Search, FileText } from "lucide-react";

interface Note {
  id: string;
  title: string;
  content: string;
  color: string;
  updatedAt: number;
}

const COLORS = [
  "bg-amber-50/80 border-amber-200",
  "bg-rose-50/80 border-rose-200",
  "bg-cyan-50/80 border-cyan-200",
  "bg-emerald-50/80 border-emerald-200",
  "bg-violet-50/80 border-violet-200",
  "bg-orange-50/80 border-orange-200",
];

function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

export function NotesApp() {
  const [notes, setNotes] = useLocalStorage<Note[]>("edison-notes", []);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const selected = notes.find((n) => n.id === selectedId);
  const filtered = notes.filter(
    (n) =>
      n.title.toLowerCase().includes(search.toLowerCase()) ||
      n.content.toLowerCase().includes(search.toLowerCase())
  );

  const createNote = () => {
    const note: Note = {
      id: uid(),
      title: "Untitled Note",
      content: "",
      color: COLORS[notes.length % COLORS.length],
      updatedAt: Date.now(),
    };
    setNotes((prev) => [note, ...prev]);
    setSelectedId(note.id);
  };

  const updateNote = (id: string, patch: Partial<Note>) => {
    setNotes((prev) =>
      prev.map((n) => (n.id === id ? { ...n, ...patch, updatedAt: Date.now() } : n))
    );
  };

  const deleteNote = (id: string) => {
    setNotes((prev) => prev.filter((n) => n.id !== id));
    if (selectedId === id) setSelectedId(null);
  };

  return (
    <div className="flex h-full">
      {/* Sidebar */}
      <div className="w-56 border-r border-border/60 flex flex-col bg-muted/20">
        <div className="p-3 border-b border-border/60">
          <div className="flex items-center gap-2 mb-2">
            <button onClick={createNote} className="flex items-center gap-1.5 px-3 py-1.5 bg-primary text-primary-foreground rounded-lg text-xs font-medium hover:bg-primary/90 transition-colors">
              <Plus className="h-3.5 w-3.5" />
              New
            </button>
          </div>
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search notes..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 bg-card border border-border/60 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {filtered.length === 0 && (
            <p className="text-xs text-muted-foreground text-center py-6">No notes yet</p>
          )}
          {filtered.map((note) => (
            <button
              key={note.id}
              onClick={() => setSelectedId(note.id)}
              className={`w-full text-left p-2.5 rounded-lg transition-colors group ${
                selectedId === note.id ? "bg-primary/10 border border-primary/20" : "hover:bg-muted/60 border border-transparent"
              }`}
            >
              <div className="flex items-center justify-between">
                <p className="text-xs font-medium text-foreground truncate">{note.title || "Untitled"}</p>
                <button
                  onClick={(e) => { e.stopPropagation(); deleteNote(note.id); }}
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 className="h-3 w-3 text-muted-foreground hover:text-destructive" />
                </button>
              </div>
              <p className="text-[10px] text-muted-foreground mt-0.5 truncate">
                {note.content || "Empty note"}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Editor */}
      <div className="flex-1 flex flex-col">
        {selected ? (
          <>
            <div className="px-4 py-3 border-b border-border/60">
              <input
                type="text"
                value={selected.title}
                onChange={(e) => updateNote(selected.id, { title: e.target.value })}
                className="w-full text-lg font-bold bg-transparent focus:outline-none text-foreground"
                placeholder="Note title..."
              />
            </div>
            <textarea
              value={selected.content}
              onChange={(e) => updateNote(selected.id, { content: e.target.value })}
              className="flex-1 p-4 bg-transparent resize-none focus:outline-none text-sm text-foreground leading-relaxed"
              placeholder="Start writing..."
            />
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground">
            <FileText className="h-12 w-12 mb-3 opacity-30" />
            <p className="text-sm">Select or create a note</p>
          </div>
        )}
      </div>
    </div>
  );
}
