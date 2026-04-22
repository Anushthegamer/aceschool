import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const EDISON_DISTRICT = `
EDISON TOWNSHIP PUBLIC SCHOOLS (NJ) — DISTRICT INFO
• Website: edison.k12.nj.us  • One of NJ's largest K-12 districts (~16,000 students, Middlesex County)
• Superintendent's office, Board of Education meetings posted on district site.
• Key parent/student systems:
  - Genesis Parent Portal (parents.edison.k12.nj.us/genesis/parents) — grades, attendance, schedules, report cards.
  - ParentSquare — district-wide communications and class messaging.
  - HIB Reporting (Harassment, Intimidation, Bullying) via Hibster reporting portal.
  - Help Desk for tech / Chromebook / login issues.
• Food Services: free/reduced lunch applications via district Food Services page; menus published monthly.
• Transportation: bus routes & eligibility on district Transportation page; questions to Transportation Office.
• Academies (high school magnet programs): STEM, Performing Arts, Humanities, etc. — application-based for incoming 9th graders.
• District calendar: posted yearly; includes marking period dates, half-days, holidays (Rosh Hashanah, Yom Kippur, Diwali observed), spring break, and last day of school.
• Middle Schools include: Herbert Hoover, John Adams, Thomas Jefferson, Woodrow Wilson. High Schools: Edison HJ Schools and JP Stevens HS.
• Summer programs (K-11): enrichment, sports, academic recovery — registration opens spring.

When Jack asks about district policies, calendar, Genesis, lunch menus, buses, HIB, or his parent portal, give helpful guidance and point him to the right page on edison.k12.nj.us.
`;

const EDISON_CURRICULUM = `
EDISON MIDDLE SCHOOL — 8TH GRADE CURRICULUM (2025-2026)

CORE SUBJECTS:
• Pre-Algebra (Ms. Chen): Linear equations, slope-intercept form, systems of equations, exponents, scientific notation, the Pythagorean theorem, functions, and intro to quadratics. Textbook: Big Ideas Math 8.
• English Language Arts (Mr. Patel): Novels — "To Kill a Mockingbird" (Harper Lee), "The Outsiders" (S.E. Hinton), "Anne Frank: Diary of a Young Girl". Skills: theme analysis, character development, MLA citations, argumentative essays, public speaking.
• Science / Life Science (Dr. Ortiz): Cell biology (mitosis, meiosis, organelles), genetics & Punnett squares, evolution, ecosystems & energy flow, human body systems. NGSS-aligned, weekly labs.
• U.S. History (Ms. Klein): Colonial America → Civil War. Units: Causes of the American Revolution, Constitution & Bill of Rights, Westward Expansion, slavery & abolition, Civil War & Reconstruction.
• Spanish I (Sra. Rivera): Greetings, AR/ER/IR verb conjugation (present), numbers, family vocabulary, telling time, food & culture of Spanish-speaking countries.

ELECTIVES & SPECIALS:
• Art & Design (Mr. Brooks): Perspective drawing, color theory, ceramics, digital design.
• Physical Education (Coach Lee): Team sports rotations, fitness testing, health units.
• Music / Band (varies)

CLUBS:
• Robotics Club (Tue/Thu 3-4:30 PM) • Math League (Wed) • Student Council • Drama Club • Science Olympiad • Yearbook

DAILY SCHEDULE (8-A):
Period 1 8:00 — Pre-Algebra | P2 8:50 — ELA | P3 9:40 — Spanish | P4 10:30 — Science
Period 5 11:20 — Lunch (11:45) | P6 12:30 — U.S. History | P7 1:20 — Elective | P8 2:10 — P.E.
Dismissal 3:00 PM

GRADING SCALE: A 93-100 / A- 90-92 / B+ 87-89 / B 83-86 / B- 80-82 / C+ 77-79 / C 73-76
Marking periods: MP1 Sep-Nov, MP2 Nov-Jan, MP3 Jan-Apr, MP4 Apr-Jun
`;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { messages } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    // Authenticated user context
    const authHeader = req.headers.get("Authorization");
    let studentContext = "";
    if (authHeader) {
      const supabase = createClient(
        Deno.env.get("SUPABASE_URL")!,
        Deno.env.get("SUPABASE_PUBLISHABLE_KEY")!,
        { global: { headers: { Authorization: authHeader } } }
      );
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const [{ data: notes }, { data: assignments }, { data: grades }, { data: profile }] = await Promise.all([
          supabase.from("notes").select("title,subject,content_html,updated_at").order("updated_at", { ascending: false }).limit(20),
          supabase.from("assignments").select("title,subject,due_date,priority,completed").order("due_date", { ascending: true }).limit(30),
          supabase.from("grades").select("subject,assignment_name,score,max_score,marking_period").order("recorded_on", { ascending: false }).limit(40),
          supabase.from("profiles").select("full_name,grade,section,school").eq("id", user.id).maybeSingle(),
        ]);

        const stripHtml = (h: string) => h.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim().slice(0, 400);
        studentContext = `
STUDENT PROFILE: ${profile?.full_name || "Jack Williams"} • Grade ${profile?.grade || 8} • Section ${profile?.section || "8-A"} • ${profile?.school || "Edison Middle School"}

JACK'S RECENT NOTES (${notes?.length || 0}):
${(notes || []).map(n => `• [${n.subject || "general"}] "${n.title}" — ${stripHtml(n.content_html || "")}`).join("\n") || "(no notes yet)"}

JACK'S CURRENT ASSIGNMENTS (${assignments?.length || 0}):
${(assignments || []).map(a => `• [${a.subject}] ${a.title} — due ${a.due_date || "TBD"} • ${a.priority} priority • ${a.completed ? "✓ done" : "pending"}`).join("\n") || "(no assignments)"}

JACK'S RECENT GRADES:
${(grades || []).map(g => `• [${g.subject}] ${g.assignment_name}: ${g.score}/${g.max_score} (MP${g.marking_period})`).join("\n") || "(no grades recorded)"}
`;
      }
    }

    const systemPrompt = `You are Jack's personal AI tutor and study buddy in the FocusFlow app. You are friendly, encouraging, and age-appropriate for an 8th grader. Use markdown, emojis sparingly, and short paragraphs.

You have full access to Jack's school data (below) and the Edison Middle School 8th-grade curriculum. Use this context to give specific, personalized help — reference his actual assignments, notes, and grades by name when relevant.

Help Jack with: explaining concepts, breaking down homework, study strategies, summarizing his notes, planning study sessions for upcoming tests, motivation, and answering curriculum questions. Never do his homework for him — guide him to the answer.

${EDISON_CURRICULUM}

${studentContext}

Today is ${new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${LOVABLE_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [{ role: "system", content: systemPrompt }, ...messages],
        stream: true,
      }),
    });

    if (response.status === 429)
      return new Response(JSON.stringify({ error: "Rate limit reached. Try again in a minute." }), { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    if (response.status === 402)
      return new Response(JSON.stringify({ error: "AI credits exhausted. Add funds in Settings → Workspace → Usage." }), { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    if (!response.ok) {
      const t = await response.text();
      console.error("AI gateway error", response.status, t);
      return new Response(JSON.stringify({ error: "AI gateway error" }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    return new Response(response.body, { headers: { ...corsHeaders, "Content-Type": "text/event-stream" } });
  } catch (e) {
    console.error("ai-tutor error", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown" }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});
