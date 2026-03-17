export type Chronotype = "Lion" | "Bear" | "Wolf" | "Dolphin";

export interface ChronotypeTip {
  label: string;
  value: string;
}

export interface EnergyPoint {
  time: string;
  energy: number;
}

export interface ChronotypeWindows {
  peak: string;
  medium: string;
  rest: string;
}

export interface ChronotypeTheme {
  text: string;
  bg: string;
  stroke: string;
}

export interface ChronotypeInfo {
  name: string;
  greeting: string;
  description: string;
  windows: ChronotypeWindows;
  tips: ChronotypeTip[];
  curve: EnergyPoint[];
  theme: ChronotypeTheme;
  splineUrl: string;
}