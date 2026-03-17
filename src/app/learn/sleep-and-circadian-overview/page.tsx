import { MoonStar } from "lucide-react";
import ArticlePageShell from "@/components/learn/ArticlePageShell";

export default function SleepCircadianOverviewPage() {
  return (
    <ArticlePageShell
      eyebrow="External guide summary"
      icon={<MoonStar className="h-3 w-3" />}
      title="Sleep and circadian overview"
      intro="Sleep timing and circadian rhythm are closely linked. If users want to understand why they feel more awake at some times and more drained at others, this is one of the most useful foundations."
      sections={[
        {
          title: "Why sleep timing matters",
          content: [
            "Sleep is not only about duration. Timing can matter too. A person may sleep for many hours and still feel misaligned if the timing of that sleep regularly clashes with their natural rhythm or daily demands.",
            "This is one reason ChronoFlow should not only ask how much users sleep, but also when they feel naturally alert or sleepy.",
          ],
        },
        {
          title: "What this means for the product",
          content: [
            "The product can use sleep-related questions to make rhythm insights more realistic. Even simple prompts about bedtime, wake patterns, and mental sharpness can give users a clearer picture of their timing.",
            "Later on, the system could also remind users that recovery habits influence the next day’s performance rather than treating sleep as separate from planning.",
          ],
        },
      ]}
      takeaway="Sleep timing is not a side topic. It is one of the foundations of how energy and attention behave during the day."
      nextHref="/learn/chronotype-and-sleep-education"
      nextLabel="Next: Chronotype and sleep education"
      resources={[
        {
          label: "Original sleep overview source",
          href: "https://www.nhlbi.nih.gov/health/sleep",
          external: true,
        },
      ]}
    />
  );
}