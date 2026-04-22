import { useEffect, useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollText, Play, Square } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { format } from "date-fns";

interface Pass { id: string; destination: string; reason: string | null; started_at: string; ended_at: string | null; }

export default function HallPassPage() {
  const { user } = useAuth();
  const [passes, setPasses] = useState<Pass[]>([]);
  const [dest, setDest] = useState("Restroom");
  const [reason, setReason] = useState("");

  const load = async () => {
    if (!user) return;
    const { data } = await supabase.from("hall_passes").select("*").order("started_at", { ascending: false }).limit(20);
    setPasses(data || []);
  };
  useEffect(() => { load(); }, [user]);

  const start = async () => {
    if (!user) return;
    const { error } = await supabase.from("hall_passes").insert({ user_id: user.id, destination: dest, reason: reason || null });
    if (error) toast.error(error.message); else { toast.success("Pass started"); setReason(""); load(); }
  };
  const end = async (id: string) => {
    const { error } = await supabase.from("hall_passes").update({ ended_at: new Date().toISOString() }).eq("id", id);
    if (error) toast.error(error.message); else load();
  };

  const active = passes.find(p => !p.ended_at);
  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-warning/20 flex items-center justify-center"><ScrollText className="h-6 w-6 text-warning" /></div>
          <div><h1 className="text-3xl font-bold">Hall Pass Log</h1><p className="text-muted-foreground">SmartPass-style time tracking</p></div>
        </div>

        {active ? (
          <Card className="border-warning">
            <CardHeader><CardTitle>🟢 Active pass to {active.destination}</CardTitle></CardHeader>
            <CardContent className="flex justify-between items-center">
              <div className="text-sm text-muted-foreground">Started {format(new Date(active.started_at), "h:mm a")}</div>
              <Button onClick={() => end(active.id)} variant="destructive" className="gap-2"><Square className="h-4 w-4" />End pass</Button>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader><CardTitle>Start new pass</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <Input value={dest} onChange={e => setDest(e.target.value)} placeholder="Destination (Restroom, Nurse, Office...)" />
              <Input value={reason} onChange={e => setReason(e.target.value)} placeholder="Reason (optional)" />
              <Button onClick={start} className="gap-2"><Play className="h-4 w-4" />Start</Button>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader><CardTitle>Recent passes</CardTitle></CardHeader>
          <CardContent>
            {passes.length === 0 ? <p className="text-sm text-muted-foreground">No passes yet.</p> : (
              <div className="space-y-2">
                {passes.map(p => {
                  const dur = p.ended_at ? Math.round((new Date(p.ended_at).getTime() - new Date(p.started_at).getTime()) / 60000) : null;
                  return (
                    <div key={p.id} className="flex justify-between items-center p-3 rounded-lg border">
                      <div>
                        <div className="font-medium text-sm">{p.destination}</div>
                        <div className="text-xs text-muted-foreground">{format(new Date(p.started_at), "MMM d, h:mm a")} {p.reason && `• ${p.reason}`}</div>
                      </div>
                      <Badge variant={dur === null ? "default" : dur > 10 ? "destructive" : "secondary"}>{dur === null ? "Active" : `${dur} min`}</Badge>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
