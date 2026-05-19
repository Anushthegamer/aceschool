import { useEffect, useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Trash2, Plus, Users } from "lucide-react";
import { toast } from "sonner";

type Club = {
  id: string;
  name: string;
  kind: string;
  day_of_week: number | null;
  room: string | null;
  advisor: string | null;
  color: string;
  notes: string | null;
};

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function ClubsPage() {
  const { user } = useAuth();
  const [clubs, setClubs] = useState<Club[]>([]);
  const [name, setName] = useState("");
  const [kind, setKind] = useState("club");
  const [day, setDay] = useState<string>("3");
  const [room, setRoom] = useState("");
  const [advisor, setAdvisor] = useState("");
  const [color, setColor] = useState("#0ea5a4");
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase.from("clubs").select("*").order("created_at", { ascending: false });
    if (error) toast.error(error.message);
    setClubs((data as Club[]) ?? []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const add = async () => {
    if (!name.trim() || !user) return;
    const { error } = await supabase.from("clubs").insert({
      user_id: user.id, name, kind,
      day_of_week: parseInt(day),
      room: room || null, advisor: advisor || null, color,
    });
    if (error) return toast.error(error.message);
    setName(""); setRoom(""); setAdvisor("");
    toast.success("Added!");
    load();
  };

  const remove = async (id: string) => {
    await supabase.from("clubs").delete().eq("id", id);
    load();
  };

  return (
    <MainLayout>
      <div className="space-y-6 animate-fade-in">
        <header className="pt-8 lg:pt-0">
          <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-2"><Users className="h-7 w-7 text-primary" />Clubs & Electives</h1>
          <p className="text-muted-foreground mt-1">Track every after-school activity and elective.</p>
        </header>

        <Card>
          <CardHeader><CardTitle className="text-base">Add new</CardTitle></CardHeader>
          <CardContent className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            <div className="space-y-1.5"><Label>Name</Label><Input value={name} onChange={e => setName(e.target.value)} placeholder="Robotics Club" /></div>
            <div className="space-y-1.5">
              <Label>Type</Label>
              <Select value={kind} onValueChange={setKind}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="club">Club</SelectItem>
                  <SelectItem value="elective">Elective</SelectItem>
                  <SelectItem value="sport">Sport</SelectItem>
                  <SelectItem value="volunteer">Volunteer</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Day</Label>
              <Select value={day} onValueChange={setDay}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{DAYS.map((d, i) => <SelectItem key={d} value={String(i)}>{d}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5"><Label>Room</Label><Input value={room} onChange={e => setRoom(e.target.value)} placeholder="Rm 214" /></div>
            <div className="space-y-1.5"><Label>Advisor</Label><Input value={advisor} onChange={e => setAdvisor(e.target.value)} placeholder="Ms. Patel" /></div>
            <div className="space-y-1.5"><Label>Color</Label><Input type="color" value={color} onChange={e => setColor(e.target.value)} className="h-10 p-1" /></div>
            <div className="sm:col-span-2 lg:col-span-3"><Button onClick={add} className="w-full sm:w-auto"><Plus className="h-4 w-4 mr-1" />Add</Button></div>
          </CardContent>
        </Card>

        {loading ? <p className="text-sm text-muted-foreground">Loading…</p> : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {clubs.length === 0 && <p className="text-sm text-muted-foreground">No clubs yet — add your first one above.</p>}
            {clubs.map(c => (
              <Card key={c.id} className="relative overflow-hidden">
                <div className="absolute left-0 top-0 bottom-0 w-1.5" style={{ background: c.color }} />
                <CardContent className="pt-5 pl-5">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <h3 className="font-semibold truncate">{c.name}</h3>
                      <p className="text-xs text-muted-foreground mt-0.5">{c.advisor || "—"} · {c.room || "—"}</p>
                    </div>
                    <Button size="icon" variant="ghost" onClick={() => remove(c.id)}><Trash2 className="h-4 w-4" /></Button>
                  </div>
                  <div className="flex gap-1.5 mt-3 flex-wrap">
                    <Badge variant="secondary">{c.kind}</Badge>
                    {c.day_of_week !== null && <Badge variant="outline">{DAYS[c.day_of_week]}</Badge>}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <p className="text-center text-[10px] text-muted-foreground/60">Developed by Ramskandh Thirandasu</p>
      </div>
    </MainLayout>
  );
}
