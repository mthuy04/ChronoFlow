export interface KitFeature {
    id: string;
    label: string;
  }
  
  export interface KitFlowStep {
    step: string;
    title: string;
    description: string;
  }
  
  export interface KitData {
    name: string;
    price: string;
    badge: string;
    shortDescription: string;
    features: KitFeature[];
    shippingNote: string;
    usageFlow: KitFlowStep[];
  }
  
  export const KIT_DATA: KitData = {
    name: "The Bio-Aligned Planner Kit",
    price: "$45.00",
    badge: "In Stock",
    shortDescription:
      "Bring biological focus to your physical desk. The ChronoFlow Planner Kit helps turn digital rhythm insight into real-world execution.",
    features: [
      {
        id: "feature-1",
        label: "90-day undated daily layouts",
      },
      {
        id: "feature-2",
        label: "Energy mapping templates",
      },
      {
        id: "feature-3",
        label: "Premium tactile paper and elegant desk presence",
      },
    ],
    shippingNote: "Free shipping for university students",
    usageFlow: [
      {
        step: "01",
        title: "Take the assessment",
        description:
          "Discover your chronotype and energy pattern digitally.",
      },
      {
        step: "02",
        title: "Map your day",
        description:
          "Use the planner kit to translate peak windows into real tasks.",
      },
      {
        step: "03",
        title: "Reflect weekly",
        description:
          "Bring your observations back into ChronoFlow for better adjustment.",
      },
    ],
  };