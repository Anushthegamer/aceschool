import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Megaphone, Pin, X } from "lucide-react";
import { Button } from "@/components/ui/button";

type Announcement = {
  id: string;
  title: string;
  body: string;
  pinned: boolean;
  created_at: string;
};

export function AnnouncementsBanner() {
  const [items, setItems] = useState<Announcement[]>([]);
  const [dismissed, setDismissed] = useState<Set<string>>(() => {
    try {
      return new Set(JSON.parse(localStorage.getItem("dismissed_announcements") ?? "[]"));
    } catch {
      return new Set();
    }
  });

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase
        .from("announcements")
        .select("*")
        .order("pinned", { ascending: false })
        .order("created_at", { ascending: false })
        .limit(5);
      setItems((data as Announcement[]) ?? []);
    };
    load();
    const channel = supabase
      .channel("announcements-banner")
      .on("postgres_changes", { event: "*", schema: "public", table: "announcements" }, load)
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const dismiss = (id: string) => {
    const next = new Set(dismissed);
    next.add(id);
    setDismissed(next);
    localStorage.setItem("dismissed_announcements", JSON.stringify([...next]));
  };

  const visible = items.filter((a) => a.pinned || !dismissed.has(a.id));
  if (visible.length === 0) return null;

  return (
    <div className="space-y-2">
      {visible.map((a) => (
        <Card key={a.id} className="p-3 flex items-start gap-3 border-primary/30 bg-primary/5">
          <div className="h-8 w-8 rounded-lg bg-primary/15 flex items-center justify-center shrink-0">
            {a.pinned ? <Pin className="h-4 w-4 text-primary" /> : <Megaphone className="h-4 w-4 text-primary" />}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-sm">{a.title}</p>
            <p className="text-xs text-muted-foreground whitespace-pre-wrap">{a.body}</p>
          </div>
          {!a.pinned && (
            <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => dismiss(a.id)}>
              <X className="h-4 w-4" />
            </Button>
          )}
        </Card>
      ))}
    </div>
  );
}
