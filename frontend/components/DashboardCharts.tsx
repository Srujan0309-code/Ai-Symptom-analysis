"use client";

import { motion } from "framer-motion";
import {
  AreaChart, Area, XAxis, YAxis,
  Tooltip, ResponsiveContainer, BarChart, Bar, Cell
} from "recharts";

const URGENCY_SCORE: Record<string, number> = {
  Emergency: 100,
  High: 80,
  Medium: 50,
  Low: 20,
};

const URGENCY_COLOR: Record<string, string> = {
  Emergency: "#ef4444",
  High: "#f97316",
  Medium: "#f59e0b",
  Low: "#059669",
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function DashboardCharts({ history }: { history?: any[] }) {
  // Build last-7-days chart from real history or use placeholder
  const today = new Date();
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const chartData = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() - (6 - i));
    const dayLabel = days[d.getDay()];
    const dateStr = d.toISOString().split("T")[0];

    if (history && history.length > 0) {
      // Find entries for this day
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const dayEntries = history.filter((h: any) => {
        const entryDate = new Date(h.created_at).toISOString().split("T")[0];
        return entryDate === dateStr;
      });

      const avgRisk = dayEntries.length > 0
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ? Math.round(dayEntries.reduce((sum: number, h: any) => sum + (URGENCY_SCORE[h.urgency] || 20), 0) / dayEntries.length)
        : 0;

      return { name: dayLabel, risk: avgRisk, sessions: dayEntries.length };
    }

    // Placeholder data when no history
    return { name: dayLabel, risk: 0, sessions: 0 };
  });

  const hasRealData = history && history.length > 0;

  // Category breakdown for bar chart
  const categoryMap: Record<string, number> = {};
  if (hasRealData) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    history!.forEach((h: any) => {
      const cat = h.result?.category || "General";
      const short = cat.split(" ")[0]; // First word only
      categoryMap[short] = (categoryMap[short] || 0) + 1;
    });
  }

  const categoryData = hasRealData
    ? Object.entries(categoryMap)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 6)
        .map(([name, count]) => ({ name, count }))
    : [
        { name: "General", count: 0 },
        { name: "Respiratory", count: 0 },
        { name: "Cardiac", count: 0 },
      ];

  const BAR_COLORS = ["#059669", "#6b38d4", "#f59e0b", "#ef4444", "#0ea5e9", "#ec4899"];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
      {/* Risk Trend Chart */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        className="surface-card p-8 h-[380px] relative overflow-hidden"
      >
        <div className="flex flex-col mb-6 relative z-10">
          <h3 className="text-lg font-heading font-bold text-foreground">Symptom Risk Trend</h3>
          <p className="text-[11px] text-on-surface-variant font-heading uppercase tracking-[0.1em] font-bold">
            {hasRealData ? "Your urgency scores over past 7 days" : "No triage history yet — start a session"}
          </p>
        </div>
        <div className="w-full h-full pb-12 relative z-10">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorRisk" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#059669" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#059669" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="name" stroke="#bfc9c3" fontSize={11} tickLine={false} axisLine={false} />
              <YAxis stroke="#bfc9c3" fontSize={11} tickLine={false} axisLine={false} domain={[0, 100]} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#f9f9ff",
                  border: "none",
                  borderRadius: "12px",
                  boxShadow: "0 4px 30px rgba(20,27,43,0.08)",
                  fontSize: "12px",
                }}
                formatter={(value: unknown) => [`${value ?? 0}`, "Risk Score"]}
              />
              <Area
                type="monotone"
                dataKey="risk"
                stroke="#059669"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#colorRisk)"
                dot={{ r: 4, fill: "#059669", strokeWidth: 0 }}
                activeDot={{ r: 6 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        {!hasRealData && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/60 backdrop-blur-[2px] rounded-2xl">
            <p className="text-on-surface-variant text-xs font-heading font-bold uppercase tracking-widest">
              Complete a triage session to see data
            </p>
          </div>
        )}
      </motion.div>

      {/* Category Breakdown */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        className="surface-card p-8 h-[380px] relative overflow-hidden"
      >
        <div className="flex flex-col mb-6 relative z-10">
          <h3 className="text-lg font-heading font-bold text-foreground">Health Categories</h3>
          <p className="text-[11px] text-on-surface-variant font-heading uppercase tracking-[0.1em] font-bold">
            {hasRealData ? "Breakdown of your medical concerns" : "No sessions recorded yet"}
          </p>
        </div>
        <div className="w-full h-full pb-12 relative z-10">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={categoryData} layout="vertical">
              <XAxis type="number" stroke="#bfc9c3" fontSize={11} tickLine={false} axisLine={false} />
              <YAxis dataKey="name" type="category" stroke="#bfc9c3" fontSize={11} tickLine={false} axisLine={false} width={80} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#f9f9ff",
                  border: "none",
                  borderRadius: "12px",
                  boxShadow: "0 4px 30px rgba(20,27,43,0.08)",
                  fontSize: "12px",
                }}
                formatter={(value: unknown) => [`${value ?? 0} sessions`, "Count"]}
              />
              <Bar dataKey="count" radius={[0, 8, 8, 0]} barSize={22}>
                {categoryData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={BAR_COLORS[index % BAR_COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        {!hasRealData && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/60 backdrop-blur-[2px] rounded-2xl">
            <p className="text-on-surface-variant text-xs font-heading font-bold uppercase tracking-widest">
              Complete a triage session to see data
            </p>
          </div>
        )}
      </motion.div>
    </div>
  );
}
