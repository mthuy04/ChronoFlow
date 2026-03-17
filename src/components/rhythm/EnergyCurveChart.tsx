"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import type { EnergyPoint } from "@/types/chronotype";

interface EnergyCurveChartProps {
  curve: EnergyPoint[];
  stroke: string;
  gradientId?: string;
  title?: string;
  description?: string;
}

export default function EnergyCurveChart({
  curve,
  stroke,
  gradientId = "energyGradient",
  title = "Energy pattern",
  description = "Your curve shows when your cognitive energy rises, peaks, and softens.",
}: EnergyCurveChartProps) {
  return (
    <div className="bg-white rounded-[2.5rem] border border-[#F0EBE1] shadow-sm p-8 md:p-12 text-left">
      <h2 className="text-3xl font-serif mb-3">{title}</h2>
      <p className="text-[#8C7A6B] font-light mb-8">{description}</p>

      <div className="h-[320px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={curve} margin={{ top: 20, right: 0, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={stroke} stopOpacity={0.2} />
                <stop offset="100%" stopColor={stroke} stopOpacity={0} />
              </linearGradient>
            </defs>

            <XAxis
              dataKey="time"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#A39C93", fontSize: 13 }}
              dy={10}
            />
            <YAxis hide domain={[0, 100]} />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="bg-[#3A3836] text-white px-4 py-2 rounded-xl text-xs font-light shadow-xl">
                      Energy: {payload[0].value}%
                    </div>
                  );
                }
                return null;
              }}
            />
            <Area
              type="monotone"
              dataKey="energy"
              stroke={stroke}
              strokeWidth={4}
              fill={`url(#${gradientId})`}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}