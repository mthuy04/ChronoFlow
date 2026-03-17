export type Chronotype = "Lion" | "Bear" | "Wolf" | "Dolphin";

export interface ChronotypeInfo {
  name: string;
  greeting: string;
  description: string;
  windows: {
    peak: string;
    medium: string;
    rest: string;
  };
  tips: {
    label: string;
    value: string;
  }[];
  curve: {
    time: string;
    energy: number;
  }[];
  theme: {
    text: string;
    bg: string;
    stroke: string;
  };
  splineUrl: string;
}

export const CHRONOTYPES: Record<Chronotype, ChronotypeInfo> = {
  Lion: {
    name: "The Lion",
    greeting: "You greet the dawn.",
    description:
      "You wake with clarity and momentum. Your strongest cognitive hours usually appear in the morning, making early deep work your natural advantage.",
    windows: {
      peak: "8:00 AM - 12:00 PM",
      medium: "1:00 PM - 4:00 PM",
      rest: "4:00 PM onwards",
    },
    tips: [
      { label: "Deep Work", value: "08:00 - 11:00" },
      { label: "Caffeine Stop", value: "14:00" },
      { label: "Movement", value: "17:00" },
    ],
    curve: [
      { time: "6 AM", energy: 80 },
      { time: "9 AM", energy: 100 },
      { time: "12 PM", energy: 75 },
      { time: "3 PM", energy: 45 },
      { time: "6 PM", energy: 30 },
      { time: "9 PM", energy: 15 },
    ],
    theme: {
      text: "text-amber-700",
      bg: "bg-amber-50",
      stroke: "#d97706",
    },
    splineUrl:
      "https://sketchfab.com/models/fd372a596ba94dc191dc2621c1cc35fb/embed",
  },

  Bear: {
    name: "The Bear",
    greeting: "You move with the sun.",
    description:
      "You follow a balanced rhythm. Your energy tends to stabilize well in the daytime, which makes you naturally compatible with common daytime structures.",
    windows: {
      peak: "10:00 AM - 2:00 PM",
      medium: "3:00 PM - 6:00 PM",
      rest: "7:00 PM onwards",
    },
    tips: [
      { label: "Deep Work", value: "10:00 - 13:00" },
      { label: "Caffeine Stop", value: "15:00" },
      { label: "Movement", value: "18:00" },
    ],
    curve: [
      { time: "7 AM", energy: 40 },
      { time: "11 AM", energy: 100 },
      { time: "2 PM", energy: 80 },
      { time: "4 PM", energy: 45 },
      { time: "7 PM", energy: 65 },
      { time: "10 PM", energy: 25 },
    ],
    theme: {
      text: "text-emerald-700",
      bg: "bg-emerald-50",
      stroke: "#059669",
    },
    splineUrl:
      "https://sketchfab.com/models/3befd34f44924848a75c3217c0bf3d3e/embed",
  },

  Wolf: {
    name: "The Wolf",
    greeting: "You find your flow in the evening.",
    description:
      "Mornings are slower. As the day quiets down, your focus sharpens. Your strongest work often appears later than people expect.",
    windows: {
      peak: "3:00 PM - 7:00 PM",
      medium: "11:00 AM - 3:00 PM",
      rest: "8:00 AM - 11:00 AM",
    },
    tips: [
      { label: "Deep Work", value: "16:00 - 20:00" },
      { label: "Caffeine Stop", value: "12:00" },
      { label: "Movement", value: "08:00" },
    ],
    curve: [
      { time: "8 AM", energy: 25 },
      { time: "12 PM", energy: 55 },
      { time: "3 PM", energy: 68 },
      { time: "6 PM", energy: 90 },
      { time: "9 PM", energy: 100 },
      { time: "11 PM", energy: 72 },
    ],
    theme: {
      text: "text-indigo-700",
      bg: "bg-indigo-50",
      stroke: "#4f46e5",
    },
    splineUrl:
      "https://sketchfab.com/models/31d0c4bcad9f4bc5a115754814b8cc52/embed",
  },

  Dolphin: {
    name: "The Dolphin",
    greeting: "You thrive in focused bursts.",
    description:
      "Your rhythm can feel more sensitive and less linear. You often work best through shorter bursts of concentration supported by softer recovery.",
    windows: {
      peak: "2:00 PM - 6:00 PM",
      medium: "10:00 AM - 2:00 PM",
      rest: "7:00 PM onwards",
    },
    tips: [
      { label: "Deep Work", value: "14:00 - 17:00" },
      { label: "Caffeine Stop", value: "11:00" },
      { label: "Movement", value: "19:00" },
    ],
    curve: [
      { time: "6 AM", energy: 35 },
      { time: "10 AM", energy: 75 },
      { time: "1 PM", energy: 45 },
      { time: "4 PM", energy: 95 },
      { time: "7 PM", energy: 55 },
      { time: "11 PM", energy: 25 },
    ],
    theme: {
      text: "text-teal-700",
      bg: "bg-teal-50",
      stroke: "#0d9488",
    },
    splineUrl:
      "https://sketchfab.com/models/289d77f1c12c49b682260dbc0f91cb54/embed",
  },
};