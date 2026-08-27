import { useState } from "react";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { Plus, Trash2, ExternalLink, FolderOpen } from "lucide-react";

interface Resource {
  id: string;
  name: string;
  url: string;
  category: string;
}

function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

const CATEGORIES = ["Study", "Tools", "Research", "Reference", "Other"];

export function ResourcesApp() {
  const [resources, setResources] = useLocalStorage<Resource[]>("edison-resources", []);
  const [showAdd, setShowAdd] = useState(false);
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  const [category, setCategory] = useState("Study");

  const add = () => {
    if (!name.trim() || !url.trim()) return;
    setResources((prev) => [...prev, { id: uid(), name: name.trim(), url: url.trim(), category }]);
    setName(""); setUrl(""); setShowAdd(false);
  };

  const cats = [...new Set(resources.map((r) => r.category))];

  return (
    <div className="flex flex-col h-full">
      <div className="px-4 py-3 border-b border-border/60 bg-muted/20 flex items-center justify-between">
        <h3 className="text-sm font-bold text-foreground">Resources</h3>
        <button onClick={() => setShowAdd(true)} className="flex items-center gap-1 px-3 py-1.5 bg-primary text-primary-foreground rounded-lg text-xs font-medium">
          <Plus className="h-3 w-3" /> Add
        </button>
      </div>
      <div className="flex-1 overflow-y-auto p-3">
        {resources.length === 0 ? (
          <div className="text-center py-10">
            <FolderOpen className="h-10 w-10 text-muted-foreground/30 mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">No resources saved</p>
          </div>
        ) : (
          cats.map((cat) => (
            <div key={cat} className="mb-4">
              <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">{cat}</p>
              <div className="space-y-1.5">
                {resources.filter((r) => r.category === cat).map((r) => (
                  <div key={r.id} className="flex items-center gap-3 p-2.5 rounded-xl bg-card border border-border/40">
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-foreground truncate">{r.name}</p>
                      <p className="text-[10px] text-muted-foreground truncate">{r.url}</p>
                    </div>
                    <a href={r.url} target="_blank" rel="noopener" className="text-primary hover:text-primary/80">
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                    <button onClick={() => setResources((p) => p.filter((x) => x.id !== r.id))}>
                      <Trash2 className="h-3.5 w-3.5 text-muted-foreground hover:text-destructive" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
      {showAdd && (
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-card rounded-2xl border border-border/60 shadow-glow p-5 w-80">
            <h3 className="text-sm font-bold text-foreground mb-3">Add Resource</h3>
            <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} className="w-full px-3 py-2 bg-muted/40 border border-border/60 rounded-xl text-sm mb-2 focus:outline-none focus:ring-1 focus:ring-primary" />
            <input type="url" placeholder="URL" value={url} onChange={(e) => setUrl(e.target.value)} className="w-full px-3 py-2 bg-muted/40 border border-border/60 rounded-xl text-sm mb-2 focus:outline-none focus:ring-1 focus:ring-primary" />
            <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full px-3 py-2 bg-muted/40 border border-border/60 rounded-xl text-sm mb-3 focus:outline-none focus:ring-1 focus:ring-primary">
              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
            <div className="flex justify-end gap-2">
              <button onClick={() => setShowAdd(false)} className="px-3 py-1.5 text-xs text-muted-foreground hover:text-foreground">Cancel</button>
              <button onClick={add} className="px-3 py-1.5 bg-primary text-primary-foreground rounded-lg text-xs font-medium">Add</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
