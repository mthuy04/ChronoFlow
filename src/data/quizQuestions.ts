import { Chronotype } from "./chronotypes";

export interface QuizOption {
  text: string;
  type: Chronotype;
}

export interface QuizQuestion {
  question: string;
  options: QuizOption[];
}

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    question: "When do you naturally feel most alert and clear-headed?",
    options: [
      {
        text: "Early morning, right after waking up.",
        type: "Lion",
      },
      {
        text: "Mid-morning to early afternoon.",
        type: "Bear",
      },
      {
        text: "Late afternoon or into the evening.",
        type: "Wolf",
      },
      {
        text: "It comes in intense but unpredictable bursts.",
        type: "Dolphin",
      },
    ],
  },
  {
    question: "If you had zero obligations tomorrow, what time would you wake up?",
    options: [
      {
        text: "Before 6:30 AM, feeling refreshed.",
        type: "Lion",
      },
      {
        text: "Around 7:30 AM or 8:00 AM.",
        type: "Bear",
      },
      {
        text: "Happily past 9:00 AM.",
        type: "Wolf",
      },
      {
        text: "It fluctuates; my sleep is easily disturbed.",
        type: "Dolphin",
      },
    ],
  },
  {
    question: "How do you usually feel right after lunch?",
    options: [
      {
        text: "Still pretty sharp.",
        type: "Lion",
      },
      {
        text: "I notice a slump, then recover.",
        type: "Bear",
      },
      {
        text: "I’m just starting to wake up.",
        type: "Wolf",
      },
      {
        text: "Tired, but my brain still races.",
        type: "Dolphin",
      },
    ],
  },
  {
    question: "When do you usually feel mentally foggy or drained?",
    options: [
      {
        text: "Late afternoon.",
        type: "Lion",
      },
      {
        text: "Right after lunch.",
        type: "Bear",
      },
      {
        text: "Mornings are rough for me.",
        type: "Wolf",
      },
      {
        text: "It comes in random waves.",
        type: "Dolphin",
      },
    ],
  },
];