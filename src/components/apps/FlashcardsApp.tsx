import { useState } from "react";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { Plus, Trash2, RotateCcw, ChevronLeft, ChevronRight, Brain, Check, X } from "lucide-react";

interface Flashcard {
  id: string;
  front: string;
  back: string;
  known: boolean;
}

function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

export function FlashcardsApp() {
  const [cards, setCards] = useLocalStorage<Flashcard[]>("edison-flashcards", []);
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [newFront, setNewFront] = useState("");
  const [newBack, setNewBack] = useState("");
  const [studyMode, setStudyMode] = useState(false);

  const current = cards[index];
  const unknownCards = cards.filter((c) => !c.known);
  const studyDeck = studyMode ? unknownCards : cards;
  const studyCurrent = studyDeck[index % studyDeck.length || 0];

  const addCard = () => {
    if (!newFront.trim() || !newBack.trim()) return;
    setCards((prev) => [...prev, { id: uid(), front: newFront.trim(), back: newBack.trim(), known: false }]);
    setNewFront("");
    setNewBack("");
    setShowAdd(false);
  };

  const markKnown = (id: string, known: boolean) => {
    setCards((prev) => prev.map((c) => (c.id === id ? { ...c, known } : c)));
    if (index < studyDeck.length - 1) setIndex(index + 1);
  };

  const resetProgress = () => {
    setCards((prev) => prev.map((c) => ({ ...c, known: false })));
    setIndex(0);
  };

  if (cards.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-6 text-center">
        <Brain className="h-16 w-16 text-muted-foreground/30 mb-4" />
        <h3 className="text-lg font-bold text-foreground mb-2">No flashcards yet</h3>
        <p className="text-sm text-muted-foreground mb-4">Create your first deck to start studying</p>
        <button onClick={() => setShowAdd(true)} className="px-4 py-2 bg-primary text-primary-foreground rounded-xl text-sm font-medium hover:bg-primary/90">
          <Plus className="h-4 w-4 inline mr-1" /> Add Card
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-border/60 bg-muted/20">
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-muted-foreground">
            {index + 1} / {studyDeck.length} {studyMode ? "(unknown)" : ""}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <button onClick={() => { setStudyMode(!studyMode); setIndex(0); }} className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-colors ${studyMode ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted/60"}`}>
            Study unknown
          </button>
          <button onClick={resetProgress} className="px-2.5 py-1 rounded-lg text-[11px] font-medium text-muted-foreground hover:bg-muted/60">
            <RotateCcw className="h-3 w-3 inline mr-0.5" /> Reset
          </button>
          <button onClick={() => setShowAdd(true)} className="px-2.5 py-1 rounded-lg text-[11px] font-medium bg-primary text-primary-foreground">
            <Plus className="h-3 w-3 inline mr-0.5" /> Add
          </button>
        </div>
      </div>

      {/* Card */}
      <div className="flex-1 flex flex-col items-center justify-center p-6">
        {studyCurrent && (
          <>
            <div
              onClick={() => setFlipped(!flipped)}
              className="w-full max-w-sm aspect-[3/2] rounded-2xl border border-border/60 bg-card shadow-medium flex items-center justify-center p-8 cursor-pointer select-none hover:shadow-glow transition-shadow"
            >
              <p className="text-center text-lg font-medium text-foreground leading-relaxed">
                {flipped ? studyCurrent.back : studyCurrent.front}
              </p>
            </div>
            <p className="text-[10px] text-muted-foreground mt-3">Click to flip</p>

            {flipped && (
              <div className="flex items-center gap-2 mt-4">
                <button onClick={() => markKnown(studyCurrent.id, false)} className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-red-500/10 text-red-500 text-xs font-medium hover:bg-red-500/20 transition-colors">
                  <X className="h-3.5 w-3.5" /> Still learning
                </button>
                <button onClick={() => markKnown(studyCurrent.id, true)} className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-500/10 text-emerald-500 text-xs font-medium hover:bg-emerald-500/20 transition-colors">
                  <Check className="h-3.5 w-3.5" /> Got it
                </button>
              </div>
            )}

            <div className="flex items-center gap-2 mt-4">
              <button onClick={() => { setFlipped(false); setIndex(Math.max(0, index - 1)); }} disabled={index === 0} className="w-8 h-8 rounded-lg bg-muted/60 flex items-center justify-center disabled:opacity-30">
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button onClick={() => { setFlipped(false); setIndex(Math.min(studyDeck.length - 1, index + 1)); }} disabled={index >= studyDeck.length - 1} className="w-8 h-8 rounded-lg bg-muted/60 flex items-center justify-center disabled:opacity-30">
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </>
        )}
      </div>

      {/* Add card dialog */}
      {showAdd && (
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-card rounded-2xl border border-border/60 shadow-glow p-5 w-80">
            <h3 className="text-sm font-bold text-foreground mb-3">Add Flashcard</h3>
            <input type="text" placeholder="Front (question)" value={newFront} onChange={(e) => setNewFront(e.target.value)} className="w-full px-3 py-2 bg-muted/40 border border-border/60 rounded-xl text-sm mb-2 focus:outline-none focus:ring-1 focus:ring-primary" />
            <input type="text" placeholder="Back (answer)" value={newBack} onChange={(e) => setNewBack(e.target.value)} className="w-full px-3 py-2 bg-muted/40 border border-border/60 rounded-xl text-sm mb-3 focus:outline-none focus:ring-1 focus:ring-primary" />
            <div className="flex justify-end gap-2">
              <button onClick={() => setShowAdd(false)} className="px-3 py-1.5 text-xs text-muted-foreground hover:text-foreground">Cancel</button>
              <button onClick={addCard} className="px-3 py-1.5 bg-primary text-primary-foreground rounded-lg text-xs font-medium">Add</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
