import { useState, useRef, useEffect } from "react";
import { Bot, Send, X, Sparkles, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface Msg { role: "user" | "assistant"; content: string; }

const STARTERS = [
  "Quiz me on what's due this week",
  "Explain the Pythagorean theorem",
  "Summarize my last science note",
  "Plan my study time for the Pre-Algebra test",
];

export const AiTutorWidget = () => {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([
    { role: "assistant", content: "Hey Jack! 👋 I'm your AI tutor. I can see all your notes, assignments, and grades. What do you want help with today?" },
  ]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => { scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" }); }, [messages, loading]);

  const send = async (text: string) => {
    if (!text.trim() || loading) return;
    const next = [...messages, { role: "user" as const, content: text }];
    setMessages(next);
    setInput("");
    setLoading(true);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      const resp = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-tutor`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.access_token || import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
        },
        body: JSON.stringify({ messages: next.map(m => ({ role: m.role, content: m.content })) }),
      });

      if (resp.status === 429) { toast.error("Rate limit — wait a moment"); setLoading(false); return; }
      if (resp.status === 402) { toast.error("AI credits exhausted"); setLoading(false); return; }
      if (!resp.ok || !resp.body) { toast.error("AI tutor unavailable"); setLoading(false); return; }

      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let acc = "";
      setMessages(m => [...m, { role: "assistant", content: "" }]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });

        let nl: number;
        while ((nl = buffer.indexOf("\n")) !== -1) {
          let line = buffer.slice(0, nl);
          buffer = buffer.slice(nl + 1);
          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (!line.startsWith("data: ")) continue;
          const data = line.slice(6).trim();
          if (data === "[DONE]") { buffer = ""; break; }
          try {
            const parsed = JSON.parse(data);
            const delta = parsed.choices?.[0]?.delta?.content;
            if (delta) {
              acc += delta;
              setMessages(m => m.map((msg, i) => i === m.length - 1 ? { ...msg, content: acc } : msg));
            }
          } catch { buffer = line + "\n" + buffer; break; }
        }
      }
    } catch (e) {
      console.error(e);
      toast.error("Connection error");
    } finally { setLoading(false); }
  };

  if (!user) return null;

  return (
    <>
      <Button
        onClick={() => setOpen(!open)}
        className={cn("fixed bottom-4 right-4 z-40 h-14 w-14 rounded-full shadow-medium gradient-calm glitch-icon", open && "scale-90")}
        size="icon"
        aria-label="Open AI tutor"
      >
        {open ? <X className="h-6 w-6" /> : <Bot className="h-6 w-6" />}
      </Button>

      {open && (
        <Card className="fixed bottom-20 right-4 z-40 w-[380px] max-w-[calc(100vw-2rem)] h-[560px] max-h-[calc(100vh-6rem)] shadow-medium flex flex-col animate-fade-in">
          <div className="flex items-center gap-2 p-3 border-b bg-muted/30 rounded-t-xl">
            <div className="w-8 h-8 rounded-lg gradient-calm flex items-center justify-center"><Sparkles className="h-4 w-4 text-white" /></div>
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-sm">AI Tutor</div>
              <div className="text-[10px] text-muted-foreground">Knows your notes, grades & Edison curriculum</div>
            </div>
          </div>

          <ScrollArea className="flex-1 p-3" ref={scrollRef as any}>
            <div className="space-y-3">
              {messages.map((m, i) => (
                <div key={i} className={cn("flex", m.role === "user" ? "justify-end" : "justify-start")}>
                  <div className={cn(
                    "rounded-2xl px-3 py-2 text-sm max-w-[85%]",
                    m.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted"
                  )}>
                    {m.role === "assistant" ? (
                      <div className="prose prose-sm max-w-none dark:prose-invert prose-p:my-1 prose-ul:my-1 prose-headings:my-1 prose-headings:text-sm">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>{m.content || "…"}</ReactMarkdown>
                      </div>
                    ) : m.content}
                  </div>
                </div>
              ))}
              {loading && messages[messages.length - 1]?.role === "user" && (
                <div className="flex justify-start"><div className="bg-muted rounded-2xl px-3 py-2"><Loader2 className="h-4 w-4 animate-spin" /></div></div>
              )}
              {messages.length === 1 && (
                <div className="flex flex-wrap gap-1.5 pt-2">
                  {STARTERS.map(s => (
                    <button key={s} onClick={() => send(s)} className="text-[11px] px-2 py-1 rounded-full bg-muted hover:bg-secondary border transition-colors">
                      {s}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </ScrollArea>

          <form onSubmit={(e) => { e.preventDefault(); send(input); }} className="p-2 border-t flex gap-2">
            <Input value={input} onChange={e => setInput(e.target.value)} placeholder="Ask anything..." disabled={loading} className="text-sm" />
            <Button type="submit" size="icon" disabled={loading || !input.trim()}><Send className="h-4 w-4" /></Button>
          </form>
        </Card>
      )}
    </>
  );
};
