"use client";

import { motion } from "framer-motion";
import { 
  LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, 
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
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 w-full">
      {/* Risk Trend Chart */}
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="glass p-8 rounded-[2.5rem] border-white/5 h-[400px]"
      >
        <div className="flex flex-col mb-8">
          <h3 className="text-xl font-bold">Symptom Risk Trend</h3>
          <p className="text-sm text-foreground/40">Aggregated urgency levels over the past 7 days.</p>
        </div>
        <div className="w-full h-full pb-12">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="colorRisk" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <Tooltip 
                contentStyle={{ backgroundColor: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px' }}
                itemStyle={{ color: '#fff' }}
              />
              <Area 
                type="monotone" 
                dataKey="risk" 
                stroke="#3b82f6" 
                strokeWidth={4}
                fillOpacity={1} 
                fill="url(#colorRisk)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Health Vitals Chart */}
      <motion.div 
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="glass p-8 rounded-[2.5rem] border-white/5 h-[400px]"
      >
        <div className="flex flex-col mb-8">
          <h3 className="text-xl font-bold">Health Score</h3>
          <p className="text-sm text-foreground/40">Overall wellness score based on symptom history.</p>
        </div>
        <div className="w-full h-full pb-12">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <Tooltip 
                contentStyle={{ backgroundColor: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px' }}
              />
              <Bar 
                dataKey="vitals" 
                fill="#8b5cf6" 
                radius={[10, 10, 0, 0]} 
                barSize={40}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>
    </div>
  );
};

export default DashboardCharts;
