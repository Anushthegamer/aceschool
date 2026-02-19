import { useState } from "react";
import { Plus, Target, Flame, CheckCircle2, Trophy, TrendingUp, Star, Trash2 } from "lucide-react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

interface Habit {
  id: string;
  name: string;
  icon: string;
  streak: number;
  completedToday: boolean;
  weeklyLog: boolean[]; // last 7 days
}

interface Goal {
  id: string;
  title: string;
  description: string;
  category: "academic" | "personal" | "health" | "skill";
  progress: number;
  target: number;
  unit: string;
  deadline: Date;
}

const initialHabits: Habit[] = [
  { id: "1", name: "Study for 1 hour", icon: "📚", streak: 12, completedToday: false, weeklyLog: [true, true, true, false, true, true, false] },
  { id: "2", name: "Review flashcards", icon: "🃏", streak: 5, completedToday: false, weeklyLog: [true, false, true, true, true, false, false] },
  { id: "3", name: "Read 20 pages", icon: "📖", streak: 8, completedToday: true, weeklyLog: [true, true, true, true, true, true, true] },
  { id: "4", name: "Exercise 30 min", icon: "🏃", streak: 3, completedToday: false, weeklyLog: [false, true, false, true, false, true, false] },
  { id: "5", name: "Practice coding", icon: "💻", streak: 15, completedToday: false, weeklyLog: [true, true, true, true, true, true, true] },
  { id: "6", name: "Drink 8 glasses water", icon: "💧", streak: 20, completedToday: true, weeklyLog: [true, true, true, true, true, true, true] },
];

const initialGoals: Goal[] = [
  { id: "1", title: "Achieve A in Mathematics", description: "Maintain an A grade throughout the semester", category: "academic", progress: 85, target: 100, unit: "%", deadline: new Date(Date.now() + 86400000 * 60) },
  { id: "2", title: "Complete 50 Practice Problems", description: "Solve algebra and calculus problems", category: "academic", progress: 32, target: 50, unit: "problems", deadline: new Date(Date.now() + 86400000 * 30) },
  { id: "3", title: "Read 10 Books This Year", description: "Read books from the recommended reading list", category: "personal", progress: 4, target: 10, unit: "books", deadline: new Date(Date.now() + 86400000 * 180) },
  { id: "4", title: "Learn Python Basics", description: "Complete online Python course", category: "skill", progress: 60, target: 100, unit: "%", deadline: new Date(Date.now() + 86400000 * 45) },
];

const categoryColors = {
  academic: "bg-primary/10 text-primary border-primary/20",
  personal: "bg-info/10 text-info border-info/20",
  health: "bg-success/10 text-success border-success/20",
  skill: "bg-warning/10 text-warning border-warning/20",
};

const GoalsPage = () => {
  const [habits, setHabits] = useState<Habit[]>(initialHabits);
  const [goals, setGoals] = useState<Goal[]>(initialGoals);
  const [showAddHabit, setShowAddHabit] = useState(false);
  const [showAddGoal, setShowAddGoal] = useState(false);
  const [newHabitName, setNewHabitName] = useState("");
  const [newGoal, setNewGoal] = useState({ title: "", description: "", category: "academic" as Goal["category"], target: 100, unit: "%" });

  const toggleHabit = (id: string) => {
    setHabits(habits.map((h) => {
      if (h.id !== id) return h;
      const completing = !h.completedToday;
      return { ...h, completedToday: completing, streak: completing ? h.streak + 1 : Math.max(0, h.streak - 1) };
    }));
  };

  const addHabit = () => {
    if (!newHabitName) return;
    setHabits([...habits, { id: Date.now().toString(), name: newHabitName, icon: "✨", streak: 0, completedToday: false, weeklyLog: [false, false, false, false, false, false, false] }]);
    setNewHabitName("");
    setShowAddHabit(false);
  };

  const addGoal = () => {
    if (!newGoal.title) return;
    setGoals([...goals, { ...newGoal, id: Date.now().toString(), progress: 0, deadline: new Date(Date.now() + 86400000 * 30) }]);
    setNewGoal({ title: "", description: "", category: "academic", target: 100, unit: "%" });
    setShowAddGoal(false);
  };

  const completedHabits = habits.filter((h) => h.completedToday).length;
  const longestStreak = Math.max(...habits.map((h) => h.streak));
  const dayNames = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  return (
    <MainLayout>
      <div className="space-y-6 animate-fade-in">
        <header className="pt-8 lg:pt-0">
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Goals & Habits</h1>
          <p className="text-muted-foreground mt-1">Build consistency and track your progress</p>
        </header>

        {/* Stats Row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card variant="elevated" className="bg-primary/5 border-primary/20">
            <CardContent className="p-4 text-center">
              <Flame className="h-8 w-8 text-primary mx-auto mb-2" />
              <div className="text-2xl font-bold text-foreground">{longestStreak}</div>
              <p className="text-xs text-muted-foreground">Longest Streak</p>
            </CardContent>
          </Card>
          <Card variant="elevated" className="bg-success/5 border-success/20">
            <CardContent className="p-4 text-center">
              <CheckCircle2 className="h-8 w-8 text-success mx-auto mb-2" />
              <div className="text-2xl font-bold text-foreground">{completedHabits}/{habits.length}</div>
              <p className="text-xs text-muted-foreground">Done Today</p>
            </CardContent>
          </Card>
          <Card variant="elevated" className="bg-warning/5 border-warning/20">
            <CardContent className="p-4 text-center">
              <Trophy className="h-8 w-8 text-warning mx-auto mb-2" />
              <div className="text-2xl font-bold text-foreground">{goals.filter((g) => g.progress >= g.target).length}</div>
              <p className="text-xs text-muted-foreground">Goals Achieved</p>
            </CardContent>
          </Card>
          <Card variant="elevated" className="bg-info/5 border-info/20">
            <CardContent className="p-4 text-center">
              <TrendingUp className="h-8 w-8 text-info mx-auto mb-2" />
              <div className="text-2xl font-bold text-foreground">{Math.round((completedHabits / habits.length) * 100)}%</div>
              <p className="text-xs text-muted-foreground">Daily Completion</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="habits" className="space-y-4">
          <TabsList>
            <TabsTrigger value="habits" className="gap-2"><Flame className="h-4 w-4" />Daily Habits</TabsTrigger>
            <TabsTrigger value="goals" className="gap-2"><Target className="h-4 w-4" />Goals</TabsTrigger>
          </TabsList>

          {/* Habits Tab */}
          <TabsContent value="habits" className="space-y-4">
            <div className="flex justify-end">
              <Dialog open={showAddHabit} onOpenChange={setShowAddHabit}>
                <DialogTrigger asChild>
                  <Button variant="calm" className="gap-2"><Plus className="h-4 w-4" />Add Habit</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader><DialogTitle>New Daily Habit</DialogTitle></DialogHeader>
                  <div className="space-y-4 pt-4">
                    <Input placeholder="e.g., Study for 1 hour" value={newHabitName} onChange={(e) => setNewHabitName(e.target.value)} />
                    <div className="flex gap-3">
                      <Button variant="outline" className="flex-1" onClick={() => setShowAddHabit(false)}>Cancel</Button>
                      <Button variant="calm" className="flex-1" onClick={addHabit}>Add</Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              {habits.map((habit) => (
                <Card key={habit.id} variant="elevated" className={cn("transition-all", habit.completedToday && "border-success/30 bg-success/5")}>
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <Checkbox checked={habit.completedToday} onCheckedChange={() => toggleHabit(habit.id)} className="mt-1" />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-lg">{habit.icon}</span>
                          <h4 className={cn("font-medium", habit.completedToday && "line-through text-muted-foreground")}>{habit.name}</h4>
                        </div>
                        <div className="flex items-center gap-3">
                          <Badge variant={habit.streak >= 7 ? "success" : "muted"} className="gap-1">
                            <Flame className="h-3 w-3" />{habit.streak} day streak
                          </Badge>
                        </div>
                        {/* Weekly dots */}
                        <div className="flex gap-1.5 mt-3">
                          {habit.weeklyLog.map((done, i) => (
                            <div key={i} className="flex flex-col items-center gap-1">
                              <div className={cn("w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs",
                                done ? "bg-success border-success text-success-foreground" : "border-border"
                              )}>
                                {done && "✓"}
                              </div>
                              <span className="text-[10px] text-muted-foreground">{dayNames[i]}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Goals Tab */}
          <TabsContent value="goals" className="space-y-4">
            <div className="flex justify-end">
              <Dialog open={showAddGoal} onOpenChange={setShowAddGoal}>
                <DialogTrigger asChild>
                  <Button variant="calm" className="gap-2"><Plus className="h-4 w-4" />Add Goal</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader><DialogTitle>New Goal</DialogTitle></DialogHeader>
                  <div className="space-y-4 pt-4">
                    <Input placeholder="Goal title" value={newGoal.title} onChange={(e) => setNewGoal({ ...newGoal, title: e.target.value })} />
                    <Input placeholder="Description" value={newGoal.description} onChange={(e) => setNewGoal({ ...newGoal, description: e.target.value })} />
                    <div className="grid grid-cols-2 gap-4">
                      <Select value={newGoal.category} onValueChange={(v) => setNewGoal({ ...newGoal, category: v as Goal["category"] })}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="academic">📚 Academic</SelectItem>
                          <SelectItem value="personal">🌟 Personal</SelectItem>
                          <SelectItem value="health">💪 Health</SelectItem>
                          <SelectItem value="skill">🎯 Skill</SelectItem>
                        </SelectContent>
                      </Select>
                      <div className="flex gap-2">
                        <Input type="number" placeholder="Target" value={newGoal.target} onChange={(e) => setNewGoal({ ...newGoal, target: parseInt(e.target.value) || 0 })} />
                        <Input placeholder="Unit" value={newGoal.unit} onChange={(e) => setNewGoal({ ...newGoal, unit: e.target.value })} className="w-20" />
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <Button variant="outline" className="flex-1" onClick={() => setShowAddGoal(false)}>Cancel</Button>
                      <Button variant="calm" className="flex-1" onClick={addGoal}>Create</Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              {goals.map((goal) => {
                const progressPercent = Math.min(100, (goal.progress / goal.target) * 100);
                const isComplete = progressPercent >= 100;
                return (
                  <Card key={goal.id} variant="elevated" className={cn(isComplete && "border-success/30")}>
                    <CardContent className="p-5">
                      <div className="flex items-start justify-between mb-3">
                        <Badge className={cn("text-xs", categoryColors[goal.category])}>{goal.category}</Badge>
                        {isComplete && <Star className="h-5 w-5 text-warning fill-warning" />}
                      </div>
                      <h4 className="font-semibold text-foreground mb-1">{goal.title}</h4>
                      <p className="text-sm text-muted-foreground mb-4">{goal.description}</p>
                      <div className="flex items-center justify-between text-sm mb-2">
                        <span className="text-muted-foreground">{goal.progress} / {goal.target} {goal.unit}</span>
                        <span className="font-medium text-foreground">{Math.round(progressPercent)}%</span>
                      </div>
                      <Progress value={progressPercent} className="h-2 mb-3" />
                      {!isComplete && (
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" onClick={() => setGoals(goals.map((g) => g.id === goal.id ? { ...g, progress: Math.max(0, g.progress - 1) } : g))}>-1</Button>
                          <Button variant="calm" size="sm" onClick={() => setGoals(goals.map((g) => g.id === goal.id ? { ...g, progress: g.progress + 1 } : g))}>+1</Button>
                          <Button variant="outline" size="sm" onClick={() => setGoals(goals.map((g) => g.id === goal.id ? { ...g, progress: g.progress + 5 } : g))}>+5</Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default GoalsPage;
