"use client";

import { motion } from "framer-motion";
import { 
  AreaChart, Area, XAxis, YAxis, 
  Tooltip, ResponsiveContainer, BarChart, Bar 
} from "recharts";

const data = [
  { name: "Mon", risk: 20, vitals: 80 },
  { name: "Tue", risk: 25, vitals: 75 },
  { name: "Wed", risk: 45, vitals: 85 },
  { name: "Thu", risk: 30, vitals: 90 },
  { name: "Fri", risk: 55, vitals: 70 },
  { name: "Sat", risk: 40, vitals: 95 },
  { name: "Sun", risk: 20, vitals: 88 },
];

const DashboardCharts = () => {
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
          <p className="text-[11px] text-on-surface-variant font-heading uppercase tracking-[0.1em] font-bold">Aggregated urgency over 7 days</p>
        </div>
        <div className="w-full h-full pb-12 relative z-10">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="colorRiskLight" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#064e3b" stopOpacity={0.15}/>
                  <stop offset="95%" stopColor="#064e3b" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="name" stroke="#bfc9c3" fontSize={11} tickLine={false} axisLine={false} />
              <YAxis stroke="#bfc9c3" fontSize={11} tickLine={false} axisLine={false} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#f9f9ff', 
                  border: 'none', 
                  borderRadius: '12px', 
                  boxShadow: '0 4px 30px rgba(20,27,43,0.08)',
                  fontSize: '12px'
                }}
                itemStyle={{ color: '#064e3b' }}
              />
              <Area 
                type="monotone" 
                dataKey="risk" 
                stroke="#064e3b" 
                strokeWidth={2.5}
                fillOpacity={1} 
                fill="url(#colorRiskLight)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Health Score Chart */}
      <motion.div 
        initial={{ opacity: 0, x: 20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        className="surface-card p-8 h-[380px] relative overflow-hidden"
      >
        <div className="flex flex-col mb-6 relative z-10">
          <h3 className="text-lg font-heading font-bold text-foreground">Health Score</h3>
          <p className="text-[11px] text-on-surface-variant font-heading uppercase tracking-[0.1em] font-bold">Overall wellness mapping</p>
        </div>
        <div className="w-full h-full pb-12 relative z-10">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <XAxis dataKey="name" stroke="#bfc9c3" fontSize={11} tickLine={false} axisLine={false} />
              <YAxis stroke="#bfc9c3" fontSize={11} tickLine={false} axisLine={false} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#f9f9ff', 
                  border: 'none', 
                  borderRadius: '12px', 
                  boxShadow: '0 4px 30px rgba(20,27,43,0.08)',
                  fontSize: '12px'
                }}
                itemStyle={{ color: '#6b38d4' }}
              />
              <Bar 
                dataKey="vitals" 
                fill="#6b38d4" 
                radius={[8, 8, 0, 0]} 
                barSize={28}
                opacity={0.85}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>
    </div>
  );
};

export default DashboardCharts;
