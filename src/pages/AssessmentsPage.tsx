import { useState } from "react";
import { Clock, BookOpen, Plus, ChevronRight, Brain, Target, Lightbulb } from "lucide-react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { differenceInDays, format, addDays } from "date-fns";
import { cn } from "@/lib/utils";

interface Assessment {
  id: string;
  title: string;
  subject: string;
  date: Date;
  preparationProgress: number;
  topics: string[];
  resources: string[];
  notes: string;
}

const initialAssessments: Assessment[] = [
  {
    id: "1", title: "Pre-Algebra Unit 5 Test", subject: "Mathematics", date: addDays(new Date(), 3), preparationProgress: 45,
    topics: ["Linear Equations", "Slope-Intercept Form", "Graphing on Coordinate Plane", "Systems of Equations"],
    resources: ["Textbook Ch. 5 (pg 160-195)", "Khan Academy: Linear Equations", "Practice worksheet from Mr. Thompson"],
    notes: "Focus on word problems with slope — need more practice graphing. Review quiz corrections from last week.",
  },
  {
    id: "2", title: "Life Science Quiz – Cell Division", subject: "Science", date: addDays(new Date(), 5), preparationProgress: 70,
    topics: ["Mitosis Phases", "Cell Organelles & Functions", "Plant vs. Animal Cells", "Osmosis & Diffusion"],
    resources: ["CK-12 Textbook Ch. 3", "Cell diagram flashcards", "Dr. Williams' review packet"],
    notes: "Memorize all organelle functions. Review the microscope lab drawings. Know the difference between mitosis and meiosis.",
  },
  {
    id: "3", title: "ELA Essay – To Kill a Mockingbird", subject: "English Language Arts", date: addDays(new Date(), 7), preparationProgress: 20,
    topics: ["Theme Analysis (Justice, Prejudice)", "Character Development (Scout, Atticus)", "Literary Devices", "MLA Citation Format"],
    resources: ["Novel with annotations", "Essay outline template from Ms. Rivera", "Purdue OWL MLA guide"],
    notes: "Thesis: How does Harper Lee use Scout's perspective to explore racial injustice? Need 3 body paragraphs with textual evidence.",
  },
  {
    id: "4", title: "American Revolution Test", subject: "U.S. History", date: addDays(new Date(), 10), preparationProgress: 15,
    topics: ["Causes of the Revolution (1765-1775)", "Key Figures (Washington, Jefferson, Adams)", "Declaration of Independence", "Major Battles & Treaty of Paris"],
    resources: ["Class notes Chapters 4-6", "CrashCourse US History Ep. 5-8", "Review packet from Mr. Chen"],
    notes: "Create a timeline from Stamp Act to Treaty of Paris. Focus on cause-and-effect chains. Study map of 13 colonies.",
  },
  {
    id: "5", title: "Spanish I – Vocabulary & Conjugation Quiz", subject: "Spanish", date: addDays(new Date(), 4), preparationProgress: 55,
    topics: ["Common -AR Verb Conjugations", "Family & Classroom Vocabulary", "Question Formation", "Basic Sentence Structure"],
    resources: ["Quizlet flashcard set", "Conjugation chart handout", "Sra. García's practice worksheet"],
    notes: "Practice: hablar, estudiar, trabajar, caminar in all present tense forms. Review question words (qué, cómo, dónde, cuándo).",
  },
];

const AssessmentsPage = () => {
  const [assessments, setAssessments] = useState<Assessment[]>(initialAssessments);
  const [selectedAssessment, setSelectedAssessment] = useState<Assessment | null>(null);

  const sortedAssessments = [...assessments].sort((a, b) => a.date.getTime() - b.date.getTime());
  const upcomingAssessments = sortedAssessments.filter(a => differenceInDays(a.date, new Date()) >= 0);

  const updateProgress = (id: string, progress: number) => {
    setAssessments(assessments.map(a => 
      a.id === id ? { ...a, preparationProgress: Math.min(100, Math.max(0, progress)) } : a
    ));
    if (selectedAssessment?.id === id) {
      setSelectedAssessment({ ...selectedAssessment, preparationProgress: Math.min(100, Math.max(0, progress)) });
    }
  };

  return (
    <MainLayout>
      <div className="space-y-6 animate-fade-in">
        <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-8 lg:pt-0">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Assessments</h1>
            <p className="text-muted-foreground mt-1">Prepare for tests and track your study progress</p>
          </div>
          <Button variant="calm" className="gap-2"><Plus className="h-5 w-5" />Add Assessment</Button>
        </header>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 space-y-4">
            <Card variant="elevated">
              <CardHeader>
                <CardTitle className="text-lg">Upcoming</CardTitle>
                <CardDescription>{upcomingAssessments.length} assessments scheduled</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {upcomingAssessments.map(assessment => {
                  const daysUntil = differenceInDays(assessment.date, new Date());
                  const isUrgent = daysUntil <= 3;
                  const isSelected = selectedAssessment?.id === assessment.id;
                  return (
                    <button key={assessment.id} onClick={() => setSelectedAssessment(assessment)}
                      className={cn("w-full p-4 rounded-lg border text-left transition-all duration-200",
                        isSelected ? "border-primary bg-primary/5 shadow-glow" : isUrgent ? "border-warning/50 bg-warning/5 hover:border-warning" : "border-border hover:border-primary/50 hover:bg-muted/50"
                      )}>
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-semibold text-foreground line-clamp-1">{assessment.title}</h4>
                        <ChevronRight className={cn("h-4 w-4 text-muted-foreground transition-transform", isSelected && "rotate-90")} />
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                        <BookOpen className="h-3.5 w-3.5" />{assessment.subject}
                      </div>
                      <div className="flex items-center justify-between">
                        <Badge variant={isUrgent ? "warning" : "muted"} className="text-xs">
                          <Clock className="h-3 w-3 mr-1" />
                          {daysUntil === 0 ? "Today!" : daysUntil === 1 ? "Tomorrow" : `${daysUntil} days`}
                        </Badge>
                        <span className="text-xs text-muted-foreground">{assessment.preparationProgress}% ready</span>
                      </div>
                      <Progress value={assessment.preparationProgress} className="mt-2 h-1.5" />
                    </button>
                  );
                })}
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-2">
            {selectedAssessment ? (
              <Card variant="elevated">
                <CardHeader className="border-b border-border">
                  <div className="flex items-start justify-between">
                    <div>
                      <Badge variant="subject" className="mb-2">{selectedAssessment.subject}</Badge>
                      <CardTitle className="text-xl">{selectedAssessment.title}</CardTitle>
                      <CardDescription className="mt-1">{format(selectedAssessment.date, "EEEE, MMMM d, yyyy")}</CardDescription>
                    </div>
                    <Badge variant={differenceInDays(selectedAssessment.date, new Date()) <= 3 ? "warning" : "info"} className="text-sm">
                      {differenceInDays(selectedAssessment.date, new Date())} days left
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="pt-6">
                  <Tabs defaultValue="topics" className="space-y-4">
                    <TabsList>
                      <TabsTrigger value="topics" className="gap-2"><Brain className="h-4 w-4" />Topics</TabsTrigger>
                      <TabsTrigger value="resources" className="gap-2"><BookOpen className="h-4 w-4" />Resources</TabsTrigger>
                      <TabsTrigger value="notes" className="gap-2"><Lightbulb className="h-4 w-4" />Notes</TabsTrigger>
                    </TabsList>
                    <TabsContent value="topics" className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium text-foreground">Topics to Study</h4>
                        <Badge variant="muted">{selectedAssessment.topics.length} topics</Badge>
                      </div>
                      <div className="grid sm:grid-cols-2 gap-2">
                        {selectedAssessment.topics.map((topic, index) => (
                          <div key={index} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 border border-border">
                            <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-medium text-primary">{index + 1}</div>
                            <span className="text-foreground">{topic}</span>
                          </div>
                        ))}
                      </div>
                    </TabsContent>
                    <TabsContent value="resources" className="space-y-4">
                      <h4 className="font-medium text-foreground">Study Resources</h4>
                      <div className="space-y-2">
                        {selectedAssessment.resources.map((resource, index) => (
                          <div key={index} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 border border-border">
                            <Target className="h-4 w-4 text-primary" />
                            <span className="text-foreground">{resource}</span>
                          </div>
                        ))}
                      </div>
                    </TabsContent>
                    <TabsContent value="notes" className="space-y-4">
                      <h4 className="font-medium text-foreground">Your Notes</h4>
                      <div className="p-4 rounded-lg bg-muted/50 border border-border">
                        <p className="text-foreground whitespace-pre-wrap">{selectedAssessment.notes || "No notes yet."}</p>
                      </div>
                    </TabsContent>
                  </Tabs>
                  <div className="mt-6 pt-6 border-t border-border">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium text-foreground">Preparation Progress</h4>
                      <span className="text-lg font-bold text-primary">{selectedAssessment.preparationProgress}%</span>
                    </div>
                    <Progress value={selectedAssessment.preparationProgress} className="h-3 mb-4" />
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => updateProgress(selectedAssessment.id, selectedAssessment.preparationProgress - 10)}>-10%</Button>
                      <Button variant="calm" size="sm" onClick={() => updateProgress(selectedAssessment.id, selectedAssessment.preparationProgress + 10)}>+10%</Button>
                      <Button variant="success" size="sm" onClick={() => updateProgress(selectedAssessment.id, 100)} className="ml-auto">Mark Ready</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card variant="elevated" className="h-full flex items-center justify-center">
                <CardContent className="text-center py-12">
                  <Brain className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="font-semibold text-foreground mb-2">Select an Assessment</h3>
                  <p className="text-muted-foreground">Click on an assessment to view details and track your preparation</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default AssessmentsPage;
