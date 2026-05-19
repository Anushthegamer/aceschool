import { useEffect, useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Clock, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

type Block = {
  id: string;
  title: string;
  subject: string | null;
  starts_at: string;
  ends_at: string;
  completed: boolean;
  category: string;
};

const todayIso = () => new Date().toISOString().slice(0, 10);

export default function TimeManagerPage() {
  const { user } = useAuth();
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("");
  const [date, setDate] = useState(todayIso());
  const [start, setStart] = useState("15:00");
  const [end, setEnd] = useState("16:00");

  const load = async () => {
    const dayStart = new Date(date + "T00:00:00").toISOString();
    const dayEnd = new Date(date + "T23:59:59").toISOString();
    const { data, error } = await supabase
      .from("time_blocks").select("*")
      .gte("starts_at", dayStart).lte("starts_at", dayEnd)
      .order("starts_at", { ascending: true });
    if (error) toast.error(error.message);
    setBlocks((data as Block[]) ?? []);
  };

  useEffect(() => { load(); /* eslint-disable-next-line */ }, [date]);

  const add = async () => {
    if (!title.trim() || !user) return;
    const startsAt = new Date(`${date}T${start}:00`).toISOString();
    const endsAt = new Date(`${date}T${end}:00`).toISOString();
    if (new Date(endsAt) <= new Date(startsAt)) return toast.error("End must be after start.");
    const { error } = await supabase.from("time_blocks").insert({
      user_id: user.id, title, subject: subject || null,
      starts_at: startsAt, ends_at: endsAt,
    });
    if (error) return toast.error(error.message);
    setTitle(""); setSubject("");
    load();
  };

  const toggle = async (b: Block) => {
    await supabase.from("time_blocks").update({ completed: !b.completed }).eq("id", b.id);
    load();
  };

  const remove = async (id: string) => {
    await supabase.from("time_blocks").delete().eq("id", id);
    load();
  };

  const fmt = (iso: string) => new Date(iso).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
  const totalMin = blocks.reduce((s, b) => s + (new Date(b.ends_at).getTime() - new Date(b.starts_at).getTime()) / 60000, 0);
  const doneMin = blocks.filter(b => b.completed).reduce((s, b) => s + (new Date(b.ends_at).getTime() - new Date(b.starts_at).getTime()) / 60000, 0);

  return (
    <MainLayout>
      <div className="space-y-6 animate-fade-in">
        <header className="pt-8 lg:pt-0">
          <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-2"><Clock className="h-7 w-7 text-primary" />Time Manager</h1>
          <p className="text-muted-foreground mt-1">Time-block your school day and after-school study sessions.</p>
        </header>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between flex-wrap gap-3">
            <CardTitle className="text-base">Schedule a block</CardTitle>
            <Input type="date" value={date} onChange={e => setDate(e.target.value)} className="w-auto" />
          </CardHeader>
          <CardContent className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            <div className="space-y-1.5 lg:col-span-2"><Label>Title</Label><Input value={title} onChange={e => setTitle(e.target.value)} placeholder="Study for Algebra test" /></div>
            <div className="space-y-1.5"><Label>Subject</Label><Input value={subject} onChange={e => setSubject(e.target.value)} placeholder="Math" /></div>
            <div className="space-y-1.5"><Label>Start</Label><Input type="time" value={start} onChange={e => setStart(e.target.value)} /></div>
            <div className="space-y-1.5"><Label>End</Label><Input type="time" value={end} onChange={e => setEnd(e.target.value)} /></div>
            <div className="sm:col-span-2 lg:col-span-5"><Button onClick={add} className="w-full sm:w-auto"><Plus className="h-4 w-4 mr-1" />Add block</Button></div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center justify-between">
              <span>{new Date(date).toLocaleDateString(undefined, { weekday: "long", month: "short", day: "numeric" })}</span>
              <span className="text-xs font-normal text-muted-foreground">{Math.round(doneMin)}/{Math.round(totalMin)} min done</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {blocks.length === 0 && <p className="text-sm text-muted-foreground">No blocks planned. Add one above.</p>}
            {blocks.map(b => (
              <div key={b.id} className="flex items-center gap-3 p-3 rounded-lg border bg-card">
                <Checkbox checked={b.completed} onCheckedChange={() => toggle(b)} />
                <div className="flex-1 min-w-0">
                  <p className={`font-medium truncate ${b.completed ? "line-through text-muted-foreground" : ""}`}>{b.title}</p>
                  <p className="text-xs text-muted-foreground">{fmt(b.starts_at)} – {fmt(b.ends_at)}{b.subject ? ` · ${b.subject}` : ""}</p>
                </div>
                <Button size="icon" variant="ghost" onClick={() => remove(b.id)}><Trash2 className="h-4 w-4" /></Button>
              </div>
            ))}
          </CardContent>
        </Card>

        <p className="text-center text-[10px] text-muted-foreground/60">Developed by Ramskandh Thirandasu</p>
      </div>
    </MainLayout>
  );
}
