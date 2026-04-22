import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { KeyRound, Eye, EyeOff } from "lucide-react";

export default function LockerPage() {
  const [show, setShow] = useState(false);
  const [combo, setCombo] = useState(localStorage.getItem("locker_combo") || "");
  const [num, setNum] = useState(localStorage.getItem("locker_num") || "247");
  return (
    <MainLayout>
      <div className="max-w-xl space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-accent/20 flex items-center justify-center"><KeyRound className="h-6 w-6 text-accent" /></div>
          <div><h1 className="text-3xl font-bold">Locker Vault</h1><p className="text-muted-foreground">Stored only in your browser</p></div>
        </div>
        <Card>
          <CardHeader><CardTitle>Your Locker</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div><Label>Locker Number</Label><Input value={num} onChange={e => { setNum(e.target.value); localStorage.setItem("locker_num", e.target.value); }} /></div>
            <div>
              <Label>Combination</Label>
              <div className="flex gap-2">
                <Input type={show ? "text" : "password"} value={combo} onChange={e => { setCombo(e.target.value); localStorage.setItem("locker_combo", e.target.value); }} placeholder="e.g. 12-24-36" />
                <Button variant="outline" size="icon" onClick={() => setShow(!show)}>{show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</Button>
              </div>
            </div>
            <p className="text-xs text-muted-foreground">🔒 Saved locally — never sent to any server.</p>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
