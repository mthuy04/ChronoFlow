export interface ArticleItem {
    slug: string;
    title: string;
    category: string;
    read: string;
    color: string;
    intro: string;
    body: string[];
    related: {
      slug: string;
      title: string;
    }[];
  }
  
  export const ARTICLES: ArticleItem[] = [
    {
      slug: "sleep-cycle-basics",
      title: "The Anatomy of a Better Sleep Cycle",
      category: "Sleep Science",
      read: "5 min read",
      color: "bg-[#E8F0EA]",
      intro:
        "Understanding sleep architecture helps users stop treating rest like dead time and start seeing it as biological infrastructure.",
      body: [
        "Sleep is not a single uniform state. It moves through cycles that support restoration, memory consolidation, and recovery. If your planning system ignores sleep, it is already working with incomplete information.",
        "For many users, the real issue is not laziness or lack of discipline. It is a mismatch between biological reality and the structure of the day they are trying to force themselves into.",
        "ChronoFlow is built on the idea that rhythm matters. Better planning begins not just with tasks, but with timing.",
      ],
      related: [
        { slug: "afternoon-slump", title: "Why the 3 PM Slump Happens" },
        { slug: "caffeine-chronotype", title: "Caffeine Timing by Chronotype" },
      ],
    },
    {
      slug: "afternoon-slump",
      title: "Why the 3 PM Slump Happens (And What to Do)",
      category: "Energy Management",
      read: "3 min read",
      color: "bg-[#F4EBE6]",
      intro:
        "The afternoon dip is common, but its shape and intensity differ depending on rhythm, sleep quality, and task load.",
      body: [
        "Many people assume a drop in afternoon energy means they are unproductive. In reality, this dip is often predictable and manageable.",
        "The problem becomes worse when users stack difficult cognitive tasks into a low-energy window and then blame themselves when performance drops.",
        "A rhythm-aware system does not eliminate every slump, but it reduces unnecessary friction by placing the right task into the right window.",
      ],
      related: [
        { slug: "sleep-cycle-basics", title: "The Anatomy of a Better Sleep Cycle" },
        { slug: "gentle-recovery", title: "Gentle Recovery for High-Cognitive Days" },
      ],
    },
    {
      slug: "caffeine-chronotype",
      title: "Caffeine Timing by Chronotype",
      category: "Nutrition",
      read: "4 min read",
      color: "bg-[#E6EEF4]",
      intro:
        "Caffeine is not just about quantity. Timing changes whether it supports focus or quietly sabotages sleep later.",
      body: [
        "Chronotype influences when users are most naturally alert, which means caffeine timing should not be identical for everyone.",
        "For some users, caffeine too late in the day pushes bedtime back and weakens recovery. For others, taking it too early creates a false sense of support when the real issue is poor timing of work.",
        "ChronoFlow treats alertness as a rhythm, not as something that must always be chemically forced upward.",
      ],
      related: [
        { slug: "afternoon-slump", title: "Why the 3 PM Slump Happens" },
        { slug: "gentle-recovery", title: "Gentle Recovery for High-Cognitive Days" },
      ],
    },
    {
      slug: "gentle-recovery",
      title: "Gentle Recovery for High-Cognitive Days",
      category: "Recovery",
      read: "7 min read",
      color: "bg-[#F4E6ED]",
      intro:
        "Recovery is not the opposite of productivity. It is part of the system that makes sustained productivity possible.",
      body: [
        "Users often overestimate how much output can be forced from a single day and underestimate how much recovery determines tomorrow’s clarity.",
        "A rhythm-aware planner includes not only deep work windows, but also softer windows for decompression, lower-load tasks, and mental reset.",
        "ChronoFlow is strongest when it helps users build realistic pacing, not just more ambitious task lists.",
      ],
      related: [
        { slug: "sleep-cycle-basics", title: "The Anatomy of a Better Sleep Cycle" },
        { slug: "caffeine-chronotype", title: "Caffeine Timing by Chronotype" },
      ],
    },
  ];
  
  export const ARTICLE_MAP: Record<string, ArticleItem> = ARTICLES.reduce(
    (acc, article) => {
      acc[article.slug] = article;
      return acc;
    },
    {} as Record<string, ArticleItem>
  );