import { Brain } from "lucide-react";
import ArticlePageShell from "@/components/learn/ArticlePageShell";

export default function EnergyRhythmPage() {
  return (
    <ArticlePageShell
      eyebrow="Biology"
      icon={<Brain className="h-3 w-3" />}
      title="Why your energy rises and falls"
      intro="Your energy is not flat. Attention, motivation, and mental clarity tend to move through the day in changing patterns rather than staying constant from morning to night."
      sections={[
        {
          title: "Why a flat schedule often fails",
          content: [
            "Many schedules assume that every hour can hold the same type of work. That is one reason why people often blame themselves when a plan looks good on paper but feels impossible in reality.",
            "If your energy naturally shifts, then your task difficulty should shift too. The problem is often not discipline alone. The problem is a mismatch between the task and the timing.",
          ],
        },
        {
          title: "What affects energy rhythm",
          content: [
            "Daily energy can be influenced by sleep timing, sleep quality, light exposure, stress, meals, routines, environment, and individual biological tendencies.",
            "That is why ChronoFlow should not pretend to predict every day perfectly. Instead, it tries to help users notice the general rhythm that appears often enough to matter in planning.",
          ],
        },
        {
          title: "What ChronoFlow does with this idea",
          content: [
            "ChronoFlow translates rhythm into practical signals: when focus is likely to be stronger, when the day may support lighter work, and when recovery should be protected.",
            "This creates a more useful planning system than one that treats every block of time as interchangeable.",
          ],
        },
      ]}
      takeaway="A rhythm-aware schedule works better because it respects the fact that attention and energy change across the day."
      nextHref="/learn/rhythm-based-planning"
      nextLabel="Next: How to plan your day with rhythm"
      resources={[
        {
          label: "Read practical rhythm-based planning",
          href: "/learn/rhythm-based-planning",
        },
        {
          label: "NIGMS overview of circadian rhythms",
          href: "https://www.nigms.nih.gov/education/fact-sheets/Pages/circadian-rhythms.aspx",
          external: true,
        },
      ]}
    />
  );
}