import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Sparkles, AtSign, Lock, User as UserIcon, ShieldCheck, UserRound } from "lucide-react";
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

  const guestSignIn = async () => {
    setBusy(true);
    const { error } = await supabase.auth.signInAnonymously();
    setBusy(false);
    if (error) return toast.error(error.message);
    toast.success("Signed in as guest — your data stays on this device session.");
    navigate("/");
  };

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
    <div className="min-h-[100dvh] flex items-center justify-center p-4 sm:p-6 bg-background relative overflow-hidden safe-area">
      {/* Ambient ornament */}
      <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-[120px] opacity-40 bg-primary/15" />

      <div className="relative z-10 w-full max-w-[460px] bg-card rounded-3xl border border-border/60 shadow-medium p-8 sm:p-10">
        {/* Brand header */}
        <div className="flex flex-col items-center text-center mb-7">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5 bg-primary-soft">
            <Sparkles className="w-7 h-7 text-primary" strokeWidth={2} />
          </div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight">The Planner</h1>
          <p className="mt-1.5 text-[11px] font-semibold text-muted-foreground uppercase tracking-[0.12em]">
            Edison Township Public Schools · 8th Grade
          </p>
        </div>

        {/* Google OAuth */}
        <Button
          variant="outline"
          className="w-full h-12 rounded-xl border-border bg-card hover:bg-secondary/60 font-medium text-foreground shadow-soft"
          disabled={busy}
          onClick={async () => {
            setBusy(true);
            const result = await lovable.auth.signInWithOAuth("google", {
              redirect_uri: window.location.origin,
              extraParams: { hd: "edison.k12.nj.us", prompt: "select_account" },
            });
            if (result.error) {
              setBusy(false);
              toast.error(result.error.message || "Google sign-in failed");
            }
          }}
        >
          <svg className="h-5 w-5 mr-3" viewBox="0 0 24 24">
            <path fill="#EA4335" d="M12 5.04c1.94 0 3.48.83 4.22 1.54l3.15-3.15C17.45 1.58 14.99 1 12 1 7.35 1 3.46 3.65 1.57 7.5l3.65 2.84c.86-2.58 3.28-4.3 6.78-4.3z"/>
            <path fill="#4285F4" d="M23.49 12.27c0-.79-.07-1.54-.19-2.27H12v4.51h6.47c-.29 1.48-1.14 2.73-2.4 3.58l3.65 2.84c2.13-1.96 3.37-4.85 3.37-8.66z"/>
            <path fill="#FBBC05" d="M5.22 14.74c-.24-.71-.37-1.47-.37-2.24s.13-1.53.37-2.24L1.57 7.5C.57 9.53 0 11.75 0 14c0 2.25.57 4.47 1.57 6.5l3.65-2.76z"/>
            <path fill="#34A853" d="M12 23c3.01 0 5.53-.99 7.37-2.69l-3.65-2.84c-1.03.69-2.35 1.1-3.72 1.1-3.5 0-5.92-2.32-6.78-4.9l-3.65 2.84C3.46 20.35 7.35 23 12 23z"/>
          </svg>
          Continue with Google
        </Button>

        {/* Guest / test access */}
        <Button
          variant="secondary"
          className="w-full h-12 rounded-xl font-medium mt-3 active:scale-[0.98] transition-all"
          disabled={busy}
          onClick={guestSignIn}
        >
          <UserRound className="h-5 w-5 mr-2" />
          Try as Guest — no account needed
        </Button>
        <p className="text-center text-[11px] text-muted-foreground mt-2">
          Explore the full app instantly. Guest data is temporary.
        </p>

        {/* Divider */}
        <div className="relative my-7">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-border" /></div>
          <div className="relative flex justify-center">
            <span className="px-3 bg-card text-[10px] font-bold text-muted-foreground uppercase tracking-[0.18em]">Or with username</span>
          </div>
        </div>

        <Tabs defaultValue="signin">
          <TabsList className="grid w-full grid-cols-2 h-11 p-1 bg-secondary rounded-xl">
            <TabsTrigger value="signin" className="rounded-lg data-[state=active]:bg-card data-[state=active]:shadow-soft data-[state=active]:text-foreground font-semibold">Sign In</TabsTrigger>
            <TabsTrigger value="signup" className="rounded-lg data-[state=active]:bg-card data-[state=active]:shadow-soft data-[state=active]:text-foreground font-semibold">Sign Up</TabsTrigger>
          </TabsList>

          <TabsContent value="signin" className="space-y-5 pt-6">
            <div className="space-y-2">
              <Label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-[0.14em] px-1">Edison Username</Label>
              <div className="flex items-stretch rounded-xl border border-border bg-card overflow-hidden shadow-sm focus-within:border-primary focus-within:ring-4 focus-within:ring-primary/10 transition-all">
                <span className="px-3 flex items-center text-muted-foreground bg-secondary/60 border-r border-border"><AtSign className="h-4 w-4" /></span>
                <Input
                  className="border-0 focus-visible:ring-0 rounded-none flex-1 min-w-0 h-12 bg-transparent"
                  value={signinLocal}
                  onChange={(e) => setSigninLocal(e.target.value)}
                  placeholder="jack.williams"
                  autoCapitalize="none"
                  autoCorrect="off"
                  spellCheck={false}
                />
                <span className="px-2 sm:px-3 flex items-center text-[11px] font-medium text-muted-foreground bg-secondary/60 border-l border-border whitespace-nowrap">{EDISON_DOMAIN}</span>
              </div>
            </div>
            <div className="space-y-2">
              <Label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-[0.14em] px-1">Password</Label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="password"
                  placeholder="••••••••"
                  className="h-12 pl-11 rounded-xl border-border focus-visible:border-primary focus-visible:ring-4 focus-visible:ring-primary/10"
                  value={signinPw}
                  onChange={(e) => setSigninPw(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && signIn()}
                />
              </div>
            </div>
            <Button onClick={signIn} disabled={busy} className="w-full h-12 rounded-xl font-semibold text-base shadow-glow active:scale-[0.98] transition-all">
              {busy ? "Signing in…" : "Sign In"}
            </Button>
          </TabsContent>

          <TabsContent value="signup" className="space-y-5 pt-6">
            <div className="space-y-2">
              <Label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-[0.14em] px-1">Full Name</Label>
              <div className="relative">
                <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input className="h-12 pl-11 rounded-xl border-border focus-visible:border-primary focus-visible:ring-4 focus-visible:ring-primary/10" value={name} onChange={(e) => setName(e.target.value)} />
              </div>
            </div>
            <div className="space-y-2">
              <Label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-[0.14em] px-1">Edison Username</Label>
              <div className="flex items-stretch rounded-xl border border-border bg-card overflow-hidden shadow-sm focus-within:border-primary focus-within:ring-4 focus-within:ring-primary/10 transition-all">
                <span className="px-3 flex items-center text-muted-foreground bg-secondary/60 border-r border-border"><AtSign className="h-4 w-4" /></span>
                <Input
                  className="border-0 focus-visible:ring-0 rounded-none flex-1 min-w-0 h-12 bg-transparent"
                  value={signupLocal}
                  onChange={(e) => setSignupLocal(e.target.value)}
                  placeholder="first.last"
                  autoCapitalize="none"
                  autoCorrect="off"
                  spellCheck={false}
                />
                <span className="px-2 sm:px-3 flex items-center text-[11px] font-medium text-muted-foreground bg-secondary/60 border-l border-border whitespace-nowrap">{EDISON_DOMAIN}</span>
              </div>
            </div>
            <div className="space-y-2">
              <Label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-[0.14em] px-1">Password</Label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="password"
                  placeholder="At least 6 characters"
                  className="h-12 pl-11 rounded-xl border-border focus-visible:border-primary focus-visible:ring-4 focus-visible:ring-primary/10"
                  value={signupPw}
                  onChange={(e) => setSignupPw(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && signUp()}
                />
              </div>
            </div>
            <Button onClick={signUp} disabled={busy} className="w-full h-12 rounded-xl font-semibold text-base shadow-glow active:scale-[0.98] transition-all">
              {busy ? "Creating…" : "Create Account & Continue"}
            </Button>
            <p className="flex items-center gap-1.5 text-xs text-muted-foreground justify-center">
              <ShieldCheck className="h-3.5 w-3.5" /> No email verification — instant access.
            </p>
          </TabsContent>
        </Tabs>

        <p className="text-center text-[11px] text-muted-foreground mt-8">
          Developed by <span className="font-medium text-foreground">Ramskandh Thirandasu</span>
        </p>
      </div>
    </div>
  );
}
