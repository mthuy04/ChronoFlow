import { Clock3 } from "lucide-react";
import ArticlePageShell from "@/components/learn/ArticlePageShell";

export default function RhythmBasedPlanningPage() {
  return (
    <ArticlePageShell
      eyebrow="Practical guide"
      icon={<Clock3 className="h-3 w-3" />}
      title="How to plan your day with rhythm"
      intro="Rhythm-based planning means placing different kinds of work into the parts of the day that fit them best, instead of forcing the same level of intensity all day long."
      sections={[
        {
          title: "Start with task types",
          content: [
            "Not every task asks for the same kind of energy. Deep work, meetings, admin, creative thinking, exercise, and recovery all make different demands on the brain and body.",
            "A strong planning system should recognize those differences instead of treating everything as one generic to-do list.",
          ],
        },
        {
          title: "Match energy to task",
          content: [
            "High-focus windows are often better used for writing, analysis, studying, problem-solving, or concentrated creation. Lower-energy periods may be better for admin, lighter communication, or routine maintenance tasks.",
            "That does not mean lower-energy periods are useless. It means they may be better suited for different kinds of work.",
          ],
        },
        {
          title: "Protect recovery too",
          content: [
            "Recovery is not outside performance. Sleep, decompression, and task pacing are part of what makes focus possible in the first place.",
            "ChronoFlow treats recovery as a planning decision, not as something that only happens after productivity is finished.",
          ],
        },
      ]}
      takeaway="The value of rhythm-based planning is not perfection. It is building a day that feels more realistic, more repeatable, and less punishing."
      nextHref="/learn/sleep-and-circadian-overview"
      nextLabel="Continue: Sleep and circadian overview"
      resources={[
        {
          label: "Sleep and heart health overview",
          href: "https://www.nhlbi.nih.gov/health/sleep",
          external: true,
        },
        {
          label: "Back to learning hub",
          href: "/learn",
        },
      ]}
    />
  );
}