import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Utensils, Leaf, Flame } from "lucide-react";

const week = [
  { day: "Monday", entree: "Cheese pizza & garlic knot", side: "Caesar salad", veg: true, hot: true, dessert: "Apple slices", calories: 720 },
  { day: "Tuesday", entree: "Chicken tenders w/ honey mustard", side: "Tater tots", veg: false, hot: true, dessert: "Chocolate chip cookie", calories: 810 },
  { day: "Wednesday", entree: "Beef tacos (2)", side: "Spanish rice & black beans", veg: false, hot: true, dessert: "Orange wedges", calories: 760 },
  { day: "Thursday", entree: "Pasta marinara", side: "Steamed broccoli & garlic bread", veg: true, hot: true, dessert: "Strawberry yogurt cup", calories: 690 },
  { day: "Friday", entree: "Buffalo chicken wrap", side: "Sweet potato fries", veg: false, hot: false, dessert: "Brownie", calories: 850 },
];

export default function LunchPage() {
  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl gradient-warm flex items-center justify-center"><Utensils className="h-6 w-6 text-white" /></div>
          <div>
            <h1 className="text-3xl font-bold">Cafeteria Menu</h1>
            <p className="text-muted-foreground">Edison Middle School • This week</p>
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {week.map(d => (
            <Card key={d.day} className="hover-lift">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">{d.day}</CardTitle>
                  <div className="flex gap-1">
                    {d.veg && <Badge variant="secondary" className="gap-1"><Leaf className="h-3 w-3" />Veg</Badge>}
                    {d.hot && <Badge variant="outline" className="gap-1"><Flame className="h-3 w-3" />Hot</Badge>}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div><span className="text-muted-foreground">Entrée:</span> <span className="font-medium">{d.entree}</span></div>
                <div><span className="text-muted-foreground">Side:</span> {d.side}</div>
                <div><span className="text-muted-foreground">Dessert:</span> {d.dessert}</div>
                <div className="pt-2 text-xs text-muted-foreground">~{d.calories} cal • Lunch period 5 (11:45 AM)</div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </MainLayout>
  );
}
