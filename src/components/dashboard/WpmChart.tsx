"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface WpmDataPoint {
  date: string;
  wpm: number;
}

export function WpmChart({ data }: { data: WpmDataPoint[] }) {
  if (data.length === 0) {
    return (
      <p className="py-8 text-center text-sm text-muted-foreground">
        Complete an RSVP session to see your WPM trend.
      </p>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={220}>
      <LineChart data={data} margin={{ top: 4, right: 8, bottom: 0, left: -16 }}>
        <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
        <XAxis
          dataKey="date"
          tick={{ fontSize: 11 }}
          tickLine={false}
          axisLine={false}
        />
        <YAxis tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
        <Tooltip
          contentStyle={{
            fontSize: 12,
            borderRadius: 6,
            border: "1px solid hsl(var(--border))",
          }}
        />
        <Line
          type="monotone"
          dataKey="wpm"
          name="WPM"
          strokeWidth={2}
          dot={data.length < 15}
          activeDot={{ r: 4 }}
          className="stroke-primary"
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
