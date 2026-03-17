import { Brain } from "lucide-react";
import ArticlePageShell from "@/components/learn/ArticlePageShell";

export default function GeneralCircadianBackgroundPage() {
  return (
    <ArticlePageShell
      eyebrow="External guide summary"
      icon={<Brain className="h-3 w-3" />}
      title="General circadian background"
      intro="Circadian rhythm is the broader biological context behind daily timing. ChronoFlow does not need to turn users into scientists, but it should give them enough understanding to make the product feel credible and useful."
      sections={[
        {
          title: "Why this background helps",
          content: [
            "When users understand that timing has a biological dimension, it becomes easier for them to accept that energy changes are not random. That can make the product feel more trustworthy and less like generic motivation advice.",
            "This is especially useful for users who are skeptical. The more they see that rhythm is grounded in real daily variation, the more likely they are to take planning suggestions seriously.",
          ],
        },
        {
          title: "How much science is enough",
          content: [
            "ChronoFlow should explain enough to be credible, but not so much that the experience becomes academic or heavy. The right amount is usually just enough for the user to connect the idea to their own life.",
            "In practice, that means short explainers, clear examples, and optional links for deeper reading are better than long technical walls of text.",
          ],
        },
      ]}
      takeaway="Circadian background gives the product context, but practical usefulness should always stay at the center."
      nextHref="/learn"
      nextLabel="Back to the learning hub"
      resources={[
        {
          label: "NIGMS circadian rhythm overview",
          href: "https://www.nigms.nih.gov/education/fact-sheets/Pages/circadian-rhythms.aspx",
          external: true,
        },
      ]}
    />
  );
}