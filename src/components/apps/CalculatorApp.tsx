import { useState } from "react";
import { Delete } from "lucide-react";

export function CalculatorApp() {
  const [display, setDisplay] = useState("0");
  const [prev, setPrev] = useState<number | null>(null);
  const [op, setOp] = useState<string | null>(null);
  const [fresh, setFresh] = useState(true);

  const inputDigit = (d: string) => {
    if (fresh) {
      setDisplay(d === "." ? "0." : d);
      setFresh(false);
    } else {
      if (d === "." && display.includes(".")) return;
      setDisplay(display === "0" && d !== "." ? d : display + d);
    }
  };

  const handleOp = (nextOp: string) => {
    const current = parseFloat(display);
    if (prev !== null && op && !fresh) {
      const result = calc(prev, current, op);
      setDisplay(String(result));
      setPrev(result);
    } else {
      setPrev(current);
    }
    setOp(nextOp);
    setFresh(true);
  };

  const equals = () => {
    if (prev === null || !op) return;
    const current = parseFloat(display);
    const result = calc(prev, current, op);
    setDisplay(String(result));
    setPrev(null);
    setOp(null);
    setFresh(true);
  };

  const clear = () => {
    setDisplay("0");
    setPrev(null);
    setOp(null);
    setFresh(true);
  };

  const backspace = () => {
    if (display.length === 1 || (display.length === 2 && display[0] === "-")) {
      setDisplay("0");
      setFresh(true);
    } else {
      setDisplay(display.slice(0, -1));
    }
  };

  const percent = () => {
    setDisplay(String(parseFloat(display) / 100));
  };

  const negate = () => {
    setDisplay(String(-parseFloat(display)));
  };

  const btn = "h-14 rounded-xl text-base font-medium transition-all active:scale-95 flex items-center justify-center";
  const num = "bg-muted/50 hover:bg-muted text-foreground";
  const opBtn = "bg-primary/15 hover:bg-primary/25 text-primary";
  const fn = "bg-muted/30 hover:bg-muted/50 text-muted-foreground";

  return (
    <div className="flex flex-col h-full bg-muted/10">
      {/* Display */}
      <div className="px-5 pt-6 pb-4">
        <div className="text-right">
          {prev !== null && op && (
            <p className="text-xs text-muted-foreground mb-1">{prev} {op}</p>
          )}
          <p className="text-4xl font-light text-foreground tabular-nums overflow-hidden text-ellipsis">
            {formatDisplay(display)}
          </p>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex-1 grid grid-cols-4 gap-1.5 p-3">
        <button onClick={clear} className={`${btn} ${fn}`}>AC</button>
        <button onClick={negate} className={`${btn} ${fn}`}>+/−</button>
        <button onClick={percent} className={`${btn} ${fn}`}>%</button>
        <button onClick={() => handleOp("÷")} className={`${btn} ${opBtn} ${op === "÷" && fresh ? "ring-2 ring-primary" : ""}`}>÷</button>

        <button onClick={() => inputDigit("7")} className={`${btn} ${num}`}>7</button>
        <button onClick={() => inputDigit("8")} className={`${btn} ${num}`}>8</button>
        <button onClick={() => inputDigit("9")} className={`${btn} ${num}`}>9</button>
        <button onClick={() => handleOp("×")} className={`${btn} ${opBtn} ${op === "×" && fresh ? "ring-2 ring-primary" : ""}`}>×</button>

        <button onClick={() => inputDigit("4")} className={`${btn} ${num}`}>4</button>
        <button onClick={() => inputDigit("5")} className={`${btn} ${num}`}>5</button>
        <button onClick={() => inputDigit("6")} className={`${btn} ${num}`}>6</button>
        <button onClick={() => handleOp("−")} className={`${btn} ${opBtn} ${op === "−" && fresh ? "ring-2 ring-primary" : ""}`}>−</button>

        <button onClick={() => inputDigit("1")} className={`${btn} ${num}`}>1</button>
        <button onClick={() => inputDigit("2")} className={`${btn} ${num}`}>2</button>
        <button onClick={() => inputDigit("3")} className={`${btn} ${num}`}>3</button>
        <button onClick={() => handleOp("+")} className={`${btn} ${opBtn} ${op === "+" && fresh ? "ring-2 ring-primary" : ""}`}>+</button>

        <button onClick={() => inputDigit("0")} className={`${btn} ${num} col-span-2`}>0</button>
        <button onClick={() => inputDigit(".")} className={`${btn} ${num}`}>.</button>
        <button onClick={equals} className={`${btn} bg-primary text-primary-foreground`}>="</button>
      </div>

      {/* Backspace floating */}
      <button onClick={backspace} className="absolute top-14 right-4 w-8 h-8 rounded-lg bg-muted/40 flex items-center justify-center hover:bg-muted/60">
        <Delete className="h-4 w-4 text-muted-foreground" />
      </button>
    </div>
  );
}

function calc(a: number, b: number, op: string): number {
  switch (op) {
    case "+": return a + b;
    case "−": return a - b;
    case "×": return a * b;
    case "÷": return b !== 0 ? a / b : 0;
    default: return b;
  }
}

function formatDisplay(s: string): string {
  const n = parseFloat(s);
  if (isNaN(n)) return s;
  if (s.includes(".") && s.endsWith(".")) return s;
  if (s.includes(".")) return s;
  return n.toLocaleString();
}
