import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Sparkles, AtSign, Lock, User as UserIcon, ShieldCheck } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const EDISON_DOMAIN = "@edison.k12.nj.us";

export default function AuthPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [signinLocal, setSigninLocal] = useState("jack.williams");
  const [signupLocal, setSignupLocal] = useState("");
  const [signinPw, setSigninPw] = useState("");
  const [signupPw, setSignupPw] = useState("");
  const [name, setName] = useState("Jack Williams");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (user) navigate("/", { replace: true });
  }, [user, navigate]);

  const buildEmail = (local: string) => `${local.trim().toLowerCase().replace(EDISON_DOMAIN, "")}${EDISON_DOMAIN}`;

  const validLocal = (local: string) => /^[a-z0-9._-]{2,}$/i.test(local.trim());

  const signIn = async () => {
    if (!validLocal(signinLocal)) return toast.error("Enter your Edison username (letters, numbers, . _ -).");
    if (signinPw.length < 6) return toast.error("Password must be at least 6 characters.");
    setBusy(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: buildEmail(signinLocal),
      password: signinPw,
    });
    setBusy(false);
    if (error) toast.error(error.message);
    else {
      toast.success("Welcome back!");
      navigate("/");
    }
  };

  const signUp = async () => {
    if (!name.trim()) return toast.error("Enter your full name.");
    if (!validLocal(signupLocal)) return toast.error("Enter a valid Edison username.");
    if (signupPw.length < 6) return toast.error("Password must be at least 6 characters.");
    setBusy(true);
    const { error } = await supabase.auth.signUp({
      email: buildEmail(signupLocal),
      password: signupPw,
      options: {
        emailRedirectTo: `${window.location.origin}/`,
        data: { full_name: name },
      },
    });
    setBusy(false);
    if (error) return toast.error(error.message);
    toast.success("Account created — signing you in…");
    // No email verification required — sign in immediately
    const { error: siErr } = await supabase.auth.signInWithPassword({
      email: buildEmail(signupLocal),
      password: signupPw,
    });
    if (siErr) toast.error(siErr.message);
    else navigate("/");
  };

  return (
    <div className="min-h-[100dvh] flex items-center justify-center p-4 gradient-soft safe-area">
      <Card className="w-full max-w-md shadow-medium">
        <CardHeader className="text-center">
          <div className="mx-auto w-14 h-14 rounded-2xl gradient-calm flex items-center justify-center shadow-glow mb-3 glitch-icon">
            <Sparkles className="h-7 w-7 text-primary-foreground" />
          </div>
          <CardTitle className="text-2xl glitch-text" data-text="The Planner">The Planner</CardTitle>
          <CardDescription>Edison Township Public Schools · 8th Grade</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="signin">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="signin">Sign In</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>

            <TabsContent value="signin" className="space-y-3 pt-4">
              <div>
                <Label>Edison Username</Label>
                <div className="flex items-stretch rounded-md border bg-background overflow-hidden focus-within:ring-2 focus-within:ring-ring">
                  <span className="px-3 flex items-center text-muted-foreground border-r"><AtSign className="h-4 w-4" /></span>
                  <Input
                    className="border-0 focus-visible:ring-0 rounded-none flex-1 min-w-0"
                    value={signinLocal}
                    onChange={(e) => setSigninLocal(e.target.value)}
                    placeholder="jack.williams"
                    autoCapitalize="none"
                    autoCorrect="off"
                    spellCheck={false}
                  />
                  <span className="px-2 sm:px-3 flex items-center text-xs sm:text-sm text-muted-foreground bg-muted whitespace-nowrap">{EDISON_DOMAIN}</span>
                </div>
              </div>
              <div>
                <Label>Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="password"
                    className="pl-9"
                    value={signinPw}
                    onChange={(e) => setSigninPw(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && signIn()}
                  />
                </div>
              </div>
              <Button onClick={signIn} disabled={busy} className="w-full">
                {busy ? "Signing in…" : "Sign In"}
              </Button>
            </TabsContent>

            <TabsContent value="signup" className="space-y-3 pt-4">
              <div>
                <Label>Full Name</Label>
                <div className="relative">
                  <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input className="pl-9" value={name} onChange={(e) => setName(e.target.value)} />
                </div>
              </div>
              <div>
                <Label>Edison Username</Label>
                <div className="flex items-stretch rounded-md border bg-background overflow-hidden focus-within:ring-2 focus-within:ring-ring">
                  <span className="px-3 flex items-center text-muted-foreground border-r"><AtSign className="h-4 w-4" /></span>
                  <Input
                    className="border-0 focus-visible:ring-0 rounded-none flex-1 min-w-0"
                    value={signupLocal}
                    onChange={(e) => setSignupLocal(e.target.value)}
                    placeholder="first.last"
                    autoCapitalize="none"
                    autoCorrect="off"
                    spellCheck={false}
                  />
                  <span className="px-2 sm:px-3 flex items-center text-xs sm:text-sm text-muted-foreground bg-muted whitespace-nowrap">{EDISON_DOMAIN}</span>
                </div>
              </div>
              <div>
                <Label>Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="password"
                    className="pl-9"
                    value={signupPw}
                    onChange={(e) => setSignupPw(e.target.value)}
                    placeholder="At least 6 characters"
                    onKeyDown={(e) => e.key === "Enter" && signUp()}
                  />
                </div>
              </div>
              <Button onClick={signUp} disabled={busy} className="w-full">
                {busy ? "Creating…" : "Create Account & Continue"}
              </Button>
              <p className="flex items-center gap-1.5 text-xs text-muted-foreground justify-center">
                <ShieldCheck className="h-3.5 w-3.5" /> No email verification — instant access.
              </p>
            </TabsContent>
          </Tabs>
          <p className="text-center text-xs text-muted-foreground mt-6">Developed by Ramskandh Thirandasu</p>
        </CardContent>
      </Card>
    </div>
  );
}
