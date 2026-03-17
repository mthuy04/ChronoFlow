"use client";

import { useState } from "react";
import AssessmentShell from "@/components/assessment/AssessmentShell";
import ChoiceGridQuestion from "@/components/assessment/ChoiceGridQuestion";
import ScaleQuestion from "@/components/assessment/ScaleQuestion";

export default function AssessmentPage() {
  const [selected, setSelected] = useState<string>("bear");
  const [stress, setStress] = useState<number>(3);

  return (
    <AssessmentShell
      step={3}
      total={12}
      title="When do you usually feel most mentally clear?"
      subtitle="Choose the option that feels most natural for your day-to-day rhythm."
    >
      <ChoiceGridQuestion
        selected={selected}
        onSelect={setSelected}
        options={[
          {
            value: "lion",
            label: "Early morning",
            description: "I wake up fairly alert and do my best thinking before midday.",
          },
          {
            value: "bear",
            label: "Late morning to midday",
            description: "I ramp up steadily and usually peak before or around lunchtime.",
          },
          {
            value: "wolf",
            label: "Afternoon to evening",
            description: "I am slow to warm up, but I become more focused later in the day.",
          },
          {
            value: "dolphin",
            label: "It varies a lot",
            description: "My energy feels irregular and harder to predict consistently.",
          },
        ]}
      />

      <div className="mt-8">
        <ScaleQuestion
          value={stress}
          onChange={setStress}
          leftLabel="Not stressed"
          rightLabel="Highly stressed"
        />
      </div>

      <div className="mt-8 flex justify-end">
        <button className="cf-btn-primary">Continue</button>
      </div>
    </AssessmentShell>
  );
}