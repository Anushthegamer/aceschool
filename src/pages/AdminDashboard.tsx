import { useEffect, useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { useUserRole } from "@/hooks/useUserRole";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, THead, TRow } from "@/components/ui/table";
import {
  Table as ShTable,
  TableBody as ShTableBody,
  TableCell as ShTableCell,
  TableHead as ShTableHead,
  TableHeader as ShTableHeader,
  TableRow as ShTableRow,
} from "@/components/ui/table";
import { toast } from "sonner";
import { ShieldAlert, Users, Megaphone, Activity, BookOpen, GraduationCap, Trash2, Plus, Pin } from "lucide-react";

type Profile = {
  id: string;
  full_name: string;
  email: string | null;
  grade: number;
  section: string;
  school: string;
  is_suspended: boolean;
  last_seen_at: string | null;
  created_at: string;
};

type Announcement = {
  id: string;
  title: string;
  body: string;
  audience: string;
  pinned: boolean;
  created_at: string;
  author_id: string;
};

type ActivityRow = {
  id: string;
  user_id: string;
  action: string;
  entity: string | null;
  metadata: Record<string, unknown>;
  created_at: string;
};

export default function AdminDashboard() {
  const { isAdmin, loading } = useUserRole();
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [activity, setActivity] = useState<ActivityRow[]>([]);
  const [stats, setStats] = useState({ users: 0, assignments: 0, grades: 0, notes: 0 });
  const [newTitle, setNewTitle] = useState("");
  const [newBody, setNewBody] = useState("");

  useEffect(() => {
    if (!isAdmin) return;
    void refresh();
  }, [isAdmin]);

  const refresh = async () => {
    const [{ data: p }, { data: a }, { data: act }, ac, gc, nc] = await Promise.all([
      supabase.from("profiles").select("*").order("created_at", { ascending: false }).limit(200),
      supabase.from("announcements").select("*").order("pinned", { ascending: false }).order("created_at", { ascending: false }),
      supabase.from("activity_log").select("*").order("created_at", { ascending: false }).limit(100),
      supabase.from("assignments").select("*", { count: "exact", head: true }),
      supabase.from("grades").select("*", { count: "exact", head: true }),
      supabase.from("notes").select("*", { count: "exact", head: true }),
    ]);
    setProfiles((p as Profile[]) ?? []);
    setAnnouncements((a as Announcement[]) ?? []);
    setActivity((act as ActivityRow[]) ?? []);
    setStats({
      users: p?.length ?? 0,
      assignments: ac.count ?? 0,
      grades: gc.count ?? 0,
      notes: nc.count ?? 0,
    });
  };

  const toggleSuspend = async (p: Profile) => {
    const { error } = await supabase.from("profiles").update({ is_suspended: !p.is_suspended }).eq("id", p.id);
    if (error) return toast.error(error.message);
    toast.success(p.is_suspended ? "User reinstated" : "User suspended");
    refresh();
  };

  const grantRole = async (userId: string, role: "admin" | "moderator") => {
    const { error } = await supabase.from("user_roles").insert({ user_id: userId, role });
    if (error) return toast.error(error.message);
    toast.success(`Granted ${role}`);
  };

  const createAnnouncement = async () => {
    if (!newTitle.trim() || !newBody.trim()) return toast.error("Title and body required");
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const { error } = await supabase.from("announcements").insert({
      author_id: user.id,
      title: newTitle.trim(),
      body: newBody.trim(),
      audience: "all",
    });
    if (error) return toast.error(error.message);
    setNewTitle("");
    setNewBody("");
    toast.success("Posted to all students");
    refresh();
  };

  const togglePin = async (a: Announcement) => {
    await supabase.from("announcements").update({ pinned: !a.pinned }).eq("id", a.id);
    refresh();
  };

  const deleteAnnouncement = async (id: string) => {
    await supabase.from("announcements").delete().eq("id", id);
    refresh();
  };

  if (loading) {
    return <MainLayout><div className="p-8 text-muted-foreground">Loading…</div></MainLayout>;
  }

  if (!isAdmin) {
    return (
      <MainLayout>
        <div className="max-w-md mx-auto mt-20 text-center space-y-3">
          <ShieldAlert className="h-12 w-12 mx-auto text-destructive" />
          <h1 className="text-2xl font-bold">Admins only</h1>
          <p className="text-muted-foreground">You don't have permission to view this page.</p>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="space-y-6 p-4 md:p-6 max-w-7xl mx-auto">
        <div>
          <h1 className="text-3xl font-bold glitch-text" data-text="Admin Dashboard">Admin Dashboard</h1>
          <p className="text-muted-foreground text-sm">Manage users, post announcements, and monitor activity.</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <StatTile icon={Users} label="Users" value={stats.users} />
          <StatTile icon={BookOpen} label="Assignments" value={stats.assignments} />
          <StatTile icon={GraduationCap} label="Grades" value={stats.grades} />
          <StatTile icon={Activity} label="Notes" value={stats.notes} />
        </div>

        <Tabs defaultValue="users">
          <TabsList className="grid grid-cols-3 w-full md:w-auto">
            <TabsTrigger value="users"><Users className="h-4 w-4 mr-1" />Users</TabsTrigger>
            <TabsTrigger value="announcements"><Megaphone className="h-4 w-4 mr-1" />Announce</TabsTrigger>
            <TabsTrigger value="activity"><Activity className="h-4 w-4 mr-1" />Activity</TabsTrigger>
          </TabsList>

          <TabsContent value="users" className="pt-4">
            <Card>
              <CardHeader><CardTitle>All Users ({profiles.length})</CardTitle></CardHeader>
              <CardContent className="overflow-x-auto">
                <ShTable>
                  <ShTableHeader>
                    <ShTableRow>
                      <ShTableHead>Name</ShTableHead>
                      <ShTableHead>Email</ShTableHead>
                      <ShTableHead>Grade</ShTableHead>
                      <ShTableHead>Status</ShTableHead>
                      <ShTableHead className="text-right">Actions</ShTableHead>
                    </ShTableRow>
                  </ShTableHeader>
                  <ShTableBody>
                    {profiles.map((p) => (
                      <ShTableRow key={p.id}>
                        <ShTableCell className="font-medium">{p.full_name}</ShTableCell>
                        <ShTableCell className="text-muted-foreground text-xs">{p.email}</ShTableCell>
                        <ShTableCell>{p.grade}{p.section ? `-${p.section}` : ""}</ShTableCell>
                        <ShTableCell>
                          {p.is_suspended ? <Badge variant="destructive">Suspended</Badge> : <Badge variant="secondary">Active</Badge>}
                        </ShTableCell>
                        <ShTableCell className="text-right space-x-1">
                          <Button size="sm" variant="outline" onClick={() => grantRole(p.id, "admin")}>+Admin</Button>
                          <Button size="sm" variant="outline" onClick={() => toggleSuspend(p)}>
                            {p.is_suspended ? "Reinstate" : "Suspend"}
                          </Button>
                        </ShTableCell>
                      </ShTableRow>
                    ))}
                  </ShTableBody>
                </ShTable>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="announcements" className="pt-4 space-y-4">
            <Card>
              <CardHeader><CardTitle>Post Announcement</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                <Input placeholder="Title" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} />
                <Textarea placeholder="Body — visible to all signed-in students" rows={4} value={newBody} onChange={(e) => setNewBody(e.target.value)} />
                <Button onClick={createAnnouncement}><Plus className="h-4 w-4 mr-1" />Publish</Button>
              </CardContent>
            </Card>

            <div className="space-y-2">
              {announcements.map((a) => (
                <Card key={a.id}>
                  <CardContent className="p-4 flex items-start gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        {a.pinned && <Pin className="h-3.5 w-3.5 text-primary" />}
                        <h3 className="font-semibold">{a.title}</h3>
                      </div>
                      <p className="text-sm text-muted-foreground whitespace-pre-wrap mt-1">{a.body}</p>
                      <p className="text-[11px] text-muted-foreground mt-2">{new Date(a.created_at).toLocaleString()}</p>
                    </div>
                    <div className="flex flex-col gap-1">
                      <Button size="icon" variant="ghost" onClick={() => togglePin(a)}><Pin className="h-4 w-4" /></Button>
                      <Button size="icon" variant="ghost" onClick={() => deleteAnnouncement(a.id)}><Trash2 className="h-4 w-4" /></Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
              {announcements.length === 0 && <p className="text-sm text-muted-foreground text-center py-6">No announcements yet.</p>}
            </div>
          </TabsContent>

          <TabsContent value="activity" className="pt-4">
            <Card>
              <CardHeader><CardTitle>Recent Activity</CardTitle></CardHeader>
              <CardContent>
                <div className="space-y-1 max-h-[500px] overflow-y-auto">
                  {activity.map((r) => (
                    <div key={r.id} className="text-xs border-b py-2 flex justify-between gap-2">
                      <span><code className="text-primary">{r.action}</code> {r.entity && <span className="text-muted-foreground">on {r.entity}</span>}</span>
                      <span className="text-muted-foreground whitespace-nowrap">{new Date(r.created_at).toLocaleTimeString()}</span>
                    </div>
                  ))}
                  {activity.length === 0 && <p className="text-sm text-muted-foreground text-center py-6">No activity recorded yet.</p>}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
}

function StatTile({ icon: Icon, label, value }: { icon: typeof Users; label: string; value: number }) {
  return (
    <Card>
      <CardContent className="p-4 flex items-center gap-3">
        <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
          <Icon className="h-5 w-5 text-primary" />
        </div>
        <div>
          <p className="text-2xl font-bold">{value}</p>
          <p className="text-xs text-muted-foreground">{label}</p>
        </div>
      </CardContent>
    </Card>
  );
}
