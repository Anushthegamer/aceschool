import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Sparkles } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

export default function AuthPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [email, setEmail] = useState("jack.williams@edison.school");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("Jack Williams");
  const [busy, setBusy] = useState(false);

  useEffect(() => { if (user) navigate("/", { replace: true }); }, [user, navigate]);

  const signIn = async () => {
    setBusy(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setBusy(false);
    if (error) toast.error(error.message);
    else { toast.success("Welcome back, Jack!"); navigate("/"); }
  };

  const signUp = async () => {
    setBusy(true);
    const { error } = await supabase.auth.signUp({
      email, password,
      options: { emailRedirectTo: `${window.location.origin}/`, data: { full_name: name } },
    });
    setBusy(false);
    if (error) toast.error(error.message);
    else { toast.success("Account created!"); navigate("/"); }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 gradient-soft">
      <Card className="w-full max-w-md shadow-medium">
        <CardHeader className="text-center">
          <div className="mx-auto w-14 h-14 rounded-2xl gradient-calm flex items-center justify-center shadow-glow mb-3 glitch-icon">
            <Sparkles className="h-7 w-7 text-primary-foreground" />
          </div>
          <CardTitle className="text-2xl">The Planner</CardTitle>
          <CardDescription>8th Grade • Edison Middle School</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="signin">
            <TabsList className="grid w-full grid-cols-2"><TabsTrigger value="signin">Sign In</TabsTrigger><TabsTrigger value="signup">Sign Up</TabsTrigger></TabsList>
            <TabsContent value="signin" className="space-y-3 pt-4">
              <div><Label>Email</Label><Input value={email} onChange={e => setEmail(e.target.value)} /></div>
              <div><Label>Password</Label><Input type="password" value={password} onChange={e => setPassword(e.target.value)} /></div>
              <Button onClick={signIn} disabled={busy} className="w-full">{busy ? "Signing in..." : "Sign In"}</Button>
            </TabsContent>
            <TabsContent value="signup" className="space-y-3 pt-4">
              <div><Label>Full Name</Label><Input value={name} onChange={e => setName(e.target.value)} /></div>
              <div><Label>Email</Label><Input value={email} onChange={e => setEmail(e.target.value)} /></div>
              <div><Label>Password</Label><Input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="At least 6 characters" /></div>
              <Button onClick={signUp} disabled={busy} className="w-full">{busy ? "Creating..." : "Create Account"}</Button>
            </TabsContent>
          </Tabs>
          <p className="text-center text-xs text-muted-foreground mt-6">Developed by Ramskandh Thirandasu</p>
        </CardContent>
      </Card>
    </div>
  );
}
