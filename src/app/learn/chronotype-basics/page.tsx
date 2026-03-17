import { MoonStar } from "lucide-react";
import ArticlePageShell from "@/components/learn/ArticlePageShell";

export default function ChronotypeBasicsPage() {
  return (
    <ArticlePageShell
      eyebrow="Foundations"
      icon={<MoonStar className="h-3 w-3" />}
      title="What exactly is a chronotype?"
      intro="A chronotype is a simple way to describe when someone naturally tends to feel more awake, more focused, and more ready to rest. It is not a strict identity, but it can be a useful pattern for thinking about timing."
      sections={[
        {
          title: "Why chronotypes matter",
          content: [
            "People often assume that everyone should work, study, and recover on the same schedule. In reality, many people experience their strongest focus and their lowest energy at different times of the day.",
            "The idea of chronotypes helps make that difference easier to describe. It gives people a practical language for understanding why one person may feel sharp in the morning while another only feels fully awake later on.",
          ],
        },
        {
          title: "A useful pattern, not a perfect label",
          content: [
            "Chronotypes are helpful because they simplify a complex reality. Most people are not extreme cases, and many factors can affect daily energy, including sleep quality, stress, age, health, work conditions, and habits.",
            "That means a chronotype should be treated as a planning aid, not a fixed rule. It can help users notice patterns, but it should not be used to force a rigid identity.",
          ],
        },
        {
          title: "How ChronoFlow uses the idea",
          content: [
            "ChronoFlow uses chronotypes as a starting point for reflection. The goal is not to tell users exactly who they are forever. The goal is to give them a clearer way to think about timing, energy, and planning.",
            "Once users see a likely chronotype, they can connect that result to an energy curve, a focus window, and practical planning choices.",
          ],
        },
      ]}
      takeaway="Chronotypes are useful because they turn vague feelings about timing into a pattern you can reflect on and use."
      nextHref="/learn/energy-rhythm"
      nextLabel="Next: Why your energy rises and falls"
      resources={[
        {
          label: "Read about circadian rhythm next",
          href: "/learn/energy-rhythm",
        },
        {
          label: "Sleep Foundation",
          href: "https://www.sleepfoundation.org/",
          external: true,
        },
      ]}
    />
  );
}