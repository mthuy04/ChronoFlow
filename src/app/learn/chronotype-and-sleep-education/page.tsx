import { BookOpen } from "lucide-react";
import ArticlePageShell from "@/components/learn/ArticlePageShell";

export default function ChronotypeSleepEducationPage() {
  return (
    <ArticlePageShell
      eyebrow="External guide summary"
      icon={<BookOpen className="h-3 w-3" />}
      title="Chronotype and sleep education"
      intro="Good educational content should help users understand timing without making them feel boxed in. That is especially important for ChronoFlow, because the product is meant to be practical rather than overly deterministic."
      sections={[
        {
          title: "What good education should do",
          content: [
            "A good educational page should reduce confusion, not add jargon. Users should leave with a clearer sense of why they feel different at different times and how those differences can be used in planning.",
            "This means ChronoFlow should explain concepts simply, connect them to real daily choices, and avoid sounding like a personality test dressed in scientific clothing.",
          ],
        },
        {
          title: "How to keep the tone right",
          content: [
            "The tone should be calm, practical, and slightly science-inspired. It should avoid overclaiming. It should also avoid making people feel defective if their rhythm is irregular or different from what seems normal.",
            "That is why pages like this matter. They keep the product grounded and help users trust the experience.",
          ],
        },
      ]}
      takeaway="Educational pages are part of the product experience. They help turn a quiz result into something users can actually understand and apply."
      nextHref="/learn/general-circadian-background"
      nextLabel="Next: General circadian background"
      resources={[
        {
          label: "Sleep Foundation",
          href: "https://www.sleepfoundation.org/",
          external: true,
        },
      ]}
    />
  );
}