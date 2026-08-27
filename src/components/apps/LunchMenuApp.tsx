import { Flame, Leaf } from "lucide-react";

const MENU = [
  { day: "Monday", entree: "Grilled Chicken Sandwich", side: "Sweet Potato Fries", veg: false, hot: true, dessert: "Apple Crisp", calories: 520 },
  { day: "Tuesday", entree: "Vegetable Stir Fry", side: "Brown Rice", veg: true, hot: true, dessert: "Fresh Fruit Cup", calories: 380 },
  { day: "Wednesday", entree: "Beef Tacos", side: "Mexican Rice & Beans", veg: false, hot: true, dessert: "Churro Bites", calories: 550 },
  { day: "Thursday", entree: "Caesar Salad", side: "Garlic Bread", veg: true, hot: false, dessert: "Yogurt Parfait", calories: 340 },
  { day: "Friday", entree: "Pepperoni Pizza", side: "Caesar Salad", veg: false, hot: true, dessert: "Cookie", calories: 580 },
];

export function LunchMenuApp() {
  return (
    <div className="flex flex-col h-full">
      <div className="px-4 py-3 border-b border-border/60 bg-muted/20">
        <h3 className="text-sm font-bold text-foreground">Edison Middle School — Lunch Menu</h3>
        <p className="text-[10px] text-muted-foreground">This week's cafeteria menu</p>
      </div>
      <div className="flex-1 overflow-y-auto p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {MENU.map((m) => (
            <div key={m.day} className="p-4 rounded-xl bg-card border border-border/40">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-bold text-foreground">{m.day}</p>
                <div className="flex gap-1">
                  {m.veg && <span className="flex items-center gap-0.5 px-1.5 py-0.5 bg-emerald-500/10 text-emerald-500 rounded text-[9px] font-medium"><Leaf className="h-2.5 w-2.5" /> Veg</span>}
                  {m.hot && <span className="flex items-center gap-0.5 px-1.5 py-0.5 bg-red-500/10 text-red-500 rounded text-[9px] font-medium"><Flame className="h-2.5 w-2.5" /> Hot</span>}
                </div>
              </div>
              <p className="text-xs font-medium text-foreground">{m.entree}</p>
              <p className="text-[10px] text-muted-foreground">Side: {m.side}</p>
              <p className="text-[10px] text-muted-foreground">Dessert: {m.dessert}</p>
              <p className="text-[10px] text-muted-foreground mt-1">{m.calories} cal</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
