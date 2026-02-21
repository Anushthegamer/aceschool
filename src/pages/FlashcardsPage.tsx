import { useState, useEffect } from "react";
import { Plus, RotateCcw, ChevronLeft, ChevronRight, Shuffle, CheckCircle2, X, Brain, Trash2, Edit3, Save } from "lucide-react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

interface Flashcard {
  id: string;
  front: string;
  back: string;
  mastered: boolean;
}

interface Deck {
  id: string;
  name: string;
  subject: string;
  cards: Flashcard[];
  color: string;
  lastStudied: Date | null;
}

const subjectColors: Record<string, string> = {
  "Mathematics": "border-primary/30 bg-primary/5",
  "English Language Arts": "border-warning/30 bg-warning/5",
  "Science": "border-success/30 bg-success/5",
  "U.S. History": "border-info/30 bg-info/5",
  "Spanish": "border-destructive/30 bg-destructive/5",
  "General": "border-muted-foreground/30 bg-muted/50",
};

const initialDecks: Deck[] = [
  {
    id: "1", name: "Linear Equations", subject: "Mathematics", color: "border-primary/30 bg-primary/5", lastStudied: new Date(Date.now() - 86400000),
    cards: [
      { id: "1a", front: "What is the slope-intercept form?", back: "y = mx + b, where m is the slope and b is the y-intercept", mastered: false },
      { id: "1b", front: "How do you find the slope between two points?", back: "m = (y₂ - y₁) / (x₂ - x₁)\n\nRise over Run", mastered: true },
      { id: "1c", front: "What does a slope of 0 mean?", back: "The line is horizontal (flat). y doesn't change as x changes.", mastered: false },
      { id: "1d", front: "What is point-slope form?", back: "y - y₁ = m(x - x₁)\n\nUseful when you know a point and the slope", mastered: false },
      { id: "1e", front: "How do you solve a system of equations by substitution?", back: "1. Solve one equation for a variable\n2. Substitute into the other equation\n3. Solve for the remaining variable\n4. Back-substitute to find the first variable", mastered: false },
    ],
  },
  {
    id: "2", name: "Cell Biology", subject: "Science", color: "border-success/30 bg-success/5", lastStudied: new Date(Date.now() - 172800000),
    cards: [
      { id: "2a", front: "What is mitosis?", back: "Cell division producing 2 identical daughter cells.\n\nPhases: Prophase → Metaphase → Anaphase → Telophase", mastered: true },
      { id: "2b", front: "What is the difference between plant and animal cells?", back: "Plant cells have: cell wall, chloroplasts, large central vacuole\n\nAnimal cells have: centrioles, smaller vacuoles, no cell wall", mastered: false },
      { id: "2c", front: "What does the mitochondria do?", back: "The 'powerhouse of the cell' — produces ATP (energy) through cellular respiration", mastered: true },
      { id: "2d", front: "What is osmosis?", back: "The movement of water molecules across a semipermeable membrane from an area of low solute concentration to high solute concentration", mastered: false },
      { id: "2e", front: "What is DNA?", back: "Deoxyribonucleic acid — the molecule that carries genetic instructions for development, functioning, and reproduction of all living organisms", mastered: false },
      { id: "2f", front: "What are the parts of a cell membrane?", back: "Phospholipid bilayer with embedded proteins.\n\nControls what enters and exits the cell (selectively permeable)", mastered: false },
    ],
  },
  {
    id: "3", name: "Literary Devices", subject: "English Language Arts", color: "border-warning/30 bg-warning/5", lastStudied: null,
    cards: [
      { id: "3a", front: "What is a metaphor?", back: "A direct comparison between two unlike things WITHOUT using 'like' or 'as'.\n\nExample: 'Time is money'", mastered: false },
      { id: "3b", front: "What is a simile?", back: "A comparison using 'like' or 'as'.\n\nExample: 'Her smile was like sunshine'", mastered: true },
      { id: "3c", front: "What is personification?", back: "Giving human qualities to non-human things.\n\nExample: 'The wind whispered through the trees'", mastered: false },
      { id: "3d", front: "What is foreshadowing?", back: "Hints or clues about what will happen later in the story. Builds suspense and prepares the reader.", mastered: false },
      { id: "3e", front: "What is irony?", back: "When the opposite of what is expected happens.\n\n3 types: Dramatic (audience knows), Situational (unexpected outcome), Verbal (saying opposite of meaning)", mastered: false },
    ],
  },
  {
    id: "4", name: "American Revolution", subject: "U.S. History", color: "border-info/30 bg-info/5", lastStudied: new Date(Date.now() - 86400000 * 3),
    cards: [
      { id: "4a", front: "What was the Stamp Act (1765)?", back: "British tax on all paper documents in the colonies. First direct tax. Led to 'No taxation without representation' protests.", mastered: false },
      { id: "4b", front: "What was the Boston Tea Party?", back: "December 16, 1773 — Colonists dumped 342 chests of British tea into Boston Harbor to protest the Tea Act.", mastered: true },
      { id: "4c", front: "When was the Declaration of Independence signed?", back: "July 4, 1776\n\nWritten primarily by Thomas Jefferson.\nDeclared the 13 colonies free from British rule.", mastered: true },
      { id: "4d", front: "What were the Intolerable Acts?", back: "Punitive laws passed by British Parliament in 1774 after the Boston Tea Party.\n\nClosed Boston Harbor, restricted town meetings, quartered soldiers in homes.", mastered: false },
      { id: "4e", front: "Who were the Sons of Liberty?", back: "A secret political organization founded by Samuel Adams to protest British taxation. Key members: Paul Revere, John Hancock, Patrick Henry.", mastered: false },
    ],
  },
  {
    id: "5", name: "Spanish Basics - Greetings", subject: "Spanish", color: "border-destructive/30 bg-destructive/5", lastStudied: new Date(Date.now() - 86400000 * 2),
    cards: [
      { id: "5a", front: "How do you say 'Hello, how are you?' in Spanish?", back: "¡Hola! ¿Cómo estás?\n\n(Informal — use with friends/classmates)", mastered: true },
      { id: "5b", front: "How do you say 'My name is...'?", back: "Me llamo...\nor\nMi nombre es...", mastered: true },
      { id: "5c", front: "What is 'Where is the bathroom?'", back: "¿Dónde está el baño?", mastered: false },
      { id: "5d", front: "How do you say 'I don't understand'?", back: "No entiendo.\n\nor more politely:\nNo comprendo.", mastered: false },
    ],
  },
];

const FlashcardsPage = () => {
  const [decks, setDecks] = useState<Deck[]>(() => {
    const saved = localStorage.getItem("focusflow-flashcards");
    if (saved) {
      const parsed = JSON.parse(saved);
      return parsed.map((d: any) => ({ ...d, lastStudied: d.lastStudied ? new Date(d.lastStudied) : null }));
    }
    return initialDecks;
  });
  const [activeDeck, setActiveDeck] = useState<Deck | null>(null);
  const [cardIndex, setCardIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [showAddDeck, setShowAddDeck] = useState(false);
  const [showAddCard, setShowAddCard] = useState(false);
  const [newDeck, setNewDeck] = useState({ name: "", subject: "Mathematics" });
  const [newCard, setNewCard] = useState({ front: "", back: "" });
  const [studyMode, setStudyMode] = useState<"all" | "unmastered">("all");

  useEffect(() => {
    localStorage.setItem("focusflow-flashcards", JSON.stringify(decks));
  }, [decks]);

  const studyCards = activeDeck
    ? studyMode === "unmastered"
      ? activeDeck.cards.filter((c) => !c.mastered)
      : activeDeck.cards
    : [];

  const currentCard = studyCards[cardIndex];

  const startStudy = (deck: Deck) => {
    setActiveDeck(deck);
    setCardIndex(0);
    setFlipped(false);
    setDecks(decks.map((d) => (d.id === deck.id ? { ...d, lastStudied: new Date() } : d)));
  };

  const nextCard = () => {
    setFlipped(false);
    setTimeout(() => setCardIndex((prev) => Math.min(prev + 1, studyCards.length - 1)), 150);
  };

  const prevCard = () => {
    setFlipped(false);
    setTimeout(() => setCardIndex((prev) => Math.max(prev - 1, 0)), 150);
  };

  const shuffleCards = () => {
    if (!activeDeck) return;
    const shuffled = [...activeDeck.cards].sort(() => Math.random() - 0.5);
    const updated = { ...activeDeck, cards: shuffled };
    setDecks(decks.map((d) => (d.id === activeDeck.id ? updated : d)));
    setActiveDeck(updated);
    setCardIndex(0);
    setFlipped(false);
  };

  const toggleMastered = (cardId: string) => {
    if (!activeDeck) return;
    const updatedCards = activeDeck.cards.map((c) => (c.id === cardId ? { ...c, mastered: !c.mastered } : c));
    const updated = { ...activeDeck, cards: updatedCards };
    setDecks(decks.map((d) => (d.id === activeDeck.id ? updated : d)));
    setActiveDeck(updated);
  };

  const createDeck = () => {
    if (!newDeck.name) return;
    const deck: Deck = {
      id: Date.now().toString(),
      name: newDeck.name,
      subject: newDeck.subject,
      cards: [],
      color: subjectColors[newDeck.subject] || subjectColors["General"],
      lastStudied: null,
    };
    setDecks([...decks, deck]);
    setNewDeck({ name: "", subject: "Mathematics" });
    setShowAddDeck(false);
  };

  const addCardToDeck = () => {
    if (!newCard.front || !newCard.back || !activeDeck) return;
    const card: Flashcard = { id: Date.now().toString(), front: newCard.front, back: newCard.back, mastered: false };
    const updated = { ...activeDeck, cards: [...activeDeck.cards, card] };
    setDecks(decks.map((d) => (d.id === activeDeck.id ? updated : d)));
    setActiveDeck(updated);
    setNewCard({ front: "", back: "" });
    setShowAddCard(false);
  };

  const deleteDeck = (deckId: string) => {
    setDecks(decks.filter((d) => d.id !== deckId));
    if (activeDeck?.id === deckId) setActiveDeck(null);
  };

  if (activeDeck) {
    const masteredCount = activeDeck.cards.filter((c) => c.mastered).length;
    const totalCount = activeDeck.cards.length;
    const masteredPercent = totalCount > 0 ? (masteredCount / totalCount) * 100 : 0;

    return (
      <MainLayout>
        <div className="space-y-6 animate-fade-in">
          <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-8 lg:pt-0">
            <div className="flex items-center gap-3">
              <Button variant="outline" size="icon" onClick={() => setActiveDeck(null)}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-foreground">{activeDeck.name}</h1>
                <p className="text-muted-foreground text-sm">{activeDeck.subject} • {totalCount} cards</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => setStudyMode(studyMode === "all" ? "unmastered" : "all")}>
                {studyMode === "all" ? "Study All" : "Unmastered Only"}
              </Button>
              <Button variant="outline" size="sm" className="gap-1" onClick={shuffleCards}>
                <Shuffle className="h-3.5 w-3.5" /> Shuffle
              </Button>
              <Dialog open={showAddCard} onOpenChange={setShowAddCard}>
                <DialogTrigger asChild>
                  <Button variant="calm" size="sm" className="gap-1"><Plus className="h-3.5 w-3.5" /> Add Card</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader><DialogTitle>Add Flashcard</DialogTitle></DialogHeader>
                  <div className="space-y-4 pt-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Front (Question)</label>
                      <Textarea placeholder="What's the question?" value={newCard.front} onChange={(e) => setNewCard({ ...newCard, front: e.target.value })} />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Back (Answer)</label>
                      <Textarea placeholder="What's the answer?" value={newCard.back} onChange={(e) => setNewCard({ ...newCard, back: e.target.value })} />
                    </div>
                    <div className="flex gap-3">
                      <Button variant="outline" className="flex-1" onClick={() => setShowAddCard(false)}>Cancel</Button>
                      <Button variant="calm" className="flex-1" onClick={addCardToDeck}>Add Card</Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </header>

          {/* Progress */}
          <Card>
            <CardContent className="py-4">
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="text-muted-foreground">Mastery Progress</span>
                <span className="font-medium">{masteredCount}/{totalCount} mastered</span>
              </div>
              <Progress value={masteredPercent} className="h-2" />
            </CardContent>
          </Card>

          {/* Flashcard */}
          {studyCards.length > 0 && currentCard ? (
            <div className="max-w-2xl mx-auto">
              <div
                className="relative cursor-pointer perspective-1000"
                onClick={() => setFlipped(!flipped)}
                style={{ perspective: "1000px" }}
              >
                <div
                  className={cn(
                    "relative w-full min-h-[320px] transition-transform duration-500 preserve-3d",
                    flipped && "[transform:rotateY(180deg)]"
                  )}
                  style={{ transformStyle: "preserve-3d" }}
                >
                  {/* Front */}
                  <Card
                    variant="elevated"
                    className="absolute inset-0 backface-hidden flex items-center justify-center p-8"
                    style={{ backfaceVisibility: "hidden" }}
                  >
                    <CardContent className="text-center">
                      <Badge variant="muted" className="mb-4">Question</Badge>
                      <p className="text-xl font-medium text-foreground whitespace-pre-wrap">{currentCard.front}</p>
                      <p className="text-sm text-muted-foreground mt-6">Click to reveal answer</p>
                    </CardContent>
                  </Card>

                  {/* Back */}
                  <Card
                    variant="elevated"
                    className="absolute inset-0 backface-hidden flex items-center justify-center p-8 bg-primary/5 border-primary/20"
                    style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
                  >
                    <CardContent className="text-center">
                      <Badge variant="subject" className="mb-4">Answer</Badge>
                      <p className="text-lg text-foreground whitespace-pre-wrap">{currentCard.back}</p>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* Controls */}
              <div className="flex items-center justify-between mt-6">
                <Button variant="outline" size="icon" onClick={prevCard} disabled={cardIndex === 0}>
                  <ChevronLeft className="h-5 w-5" />
                </Button>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-muted-foreground">{cardIndex + 1} / {studyCards.length}</span>
                  <Button
                    variant={currentCard.mastered ? "default" : "outline"}
                    size="sm"
                    className="gap-1"
                    onClick={() => toggleMastered(currentCard.id)}
                  >
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    {currentCard.mastered ? "Mastered" : "Mark Mastered"}
                  </Button>
                </div>
                <Button variant="outline" size="icon" onClick={nextCard} disabled={cardIndex === studyCards.length - 1}>
                  <ChevronRight className="h-5 w-5" />
                </Button>
              </div>
            </div>
          ) : (
            <Card className="max-w-2xl mx-auto">
              <CardContent className="py-12 text-center">
                <Brain className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">{studyMode === "unmastered" ? "All cards mastered! 🎉" : "No cards in this deck yet."}</p>
              </CardContent>
            </Card>
          )}
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="space-y-6 animate-fade-in">
        <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-8 lg:pt-0">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Study Flashcards</h1>
            <p className="text-muted-foreground mt-1">Create decks and master your subjects</p>
          </div>
          <Dialog open={showAddDeck} onOpenChange={setShowAddDeck}>
            <DialogTrigger asChild>
              <Button variant="calm" className="gap-2"><Plus className="h-5 w-5" />New Deck</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>Create Flashcard Deck</DialogTitle></DialogHeader>
              <div className="space-y-4 pt-4">
                <Input placeholder="Deck name (e.g., Pythagorean Theorem)" value={newDeck.name} onChange={(e) => setNewDeck({ ...newDeck, name: e.target.value })} />
                <Select value={newDeck.subject} onValueChange={(v) => setNewDeck({ ...newDeck, subject: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {Object.keys(subjectColors).map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                  </SelectContent>
                </Select>
                <div className="flex gap-3">
                  <Button variant="outline" className="flex-1" onClick={() => setShowAddDeck(false)}>Cancel</Button>
                  <Button variant="calm" className="flex-1" onClick={createDeck}>Create</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </header>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card variant="elevated" className="bg-primary/5 border-primary/20">
            <CardContent className="p-4 text-center">
              <div className="text-3xl font-bold text-primary">{decks.length}</div>
              <p className="text-xs text-muted-foreground mt-1">Total Decks</p>
            </CardContent>
          </Card>
          <Card variant="elevated" className="bg-success/5 border-success/20">
            <CardContent className="p-4 text-center">
              <div className="text-3xl font-bold text-success">{decks.reduce((sum, d) => sum + d.cards.length, 0)}</div>
              <p className="text-xs text-muted-foreground mt-1">Total Cards</p>
            </CardContent>
          </Card>
          <Card variant="elevated" className="bg-warning/5 border-warning/20">
            <CardContent className="p-4 text-center">
              <div className="text-3xl font-bold text-warning">{decks.reduce((sum, d) => sum + d.cards.filter((c) => c.mastered).length, 0)}</div>
              <p className="text-xs text-muted-foreground mt-1">Mastered</p>
            </CardContent>
          </Card>
          <Card variant="elevated" className="bg-info/5 border-info/20">
            <CardContent className="p-4 text-center">
              <div className="text-3xl font-bold text-info">
                {decks.reduce((sum, d) => sum + d.cards.length, 0) > 0
                  ? Math.round((decks.reduce((sum, d) => sum + d.cards.filter((c) => c.mastered).length, 0) / decks.reduce((sum, d) => sum + d.cards.length, 0)) * 100)
                  : 0}%
              </div>
              <p className="text-xs text-muted-foreground mt-1">Mastery Rate</p>
            </CardContent>
          </Card>
        </div>

        {/* Decks Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {decks.map((deck) => {
            const mastered = deck.cards.filter((c) => c.mastered).length;
            const total = deck.cards.length;
            return (
              <Card
                key={deck.id}
                className={cn("hover-lift cursor-pointer group relative", deck.color)}
                onClick={() => startStudy(deck)}
              >
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity h-7 w-7"
                  onClick={(e) => { e.stopPropagation(); deleteDeck(deck.id); }}
                >
                  <Trash2 className="h-3.5 w-3.5 text-destructive" />
                </Button>
                <CardHeader>
                  <Badge variant="subject" className="w-fit text-xs">{deck.subject}</Badge>
                  <CardTitle className="text-lg">{deck.name}</CardTitle>
                  <CardDescription>{total} cards • {mastered} mastered</CardDescription>
                </CardHeader>
                <CardContent>
                  <Progress value={total > 0 ? (mastered / total) * 100 : 0} className="h-2 mb-3" />
                  <p className="text-xs text-muted-foreground">
                    {deck.lastStudied ? `Last studied ${deck.lastStudied.toLocaleDateString()}` : "Not studied yet"}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </MainLayout>
  );
};

export default FlashcardsPage;
