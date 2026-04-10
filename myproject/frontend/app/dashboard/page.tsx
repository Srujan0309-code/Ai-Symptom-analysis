"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { History, TrendingUp, Calendar, ArrowUpRight, Activity, ShieldCheck } from "lucide-react";
import DashboardCharts from "@/components/DashboardCharts";
import { fetchHistory } from "@/lib/api";

export default function DashboardPage() {
  const [history, setHistory] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadHistory = async () => {
      try {
        const data = await fetchHistory("user-123");
        setHistory(data);
      } catch (err) {
        // Fallback mock history
        setHistory([
          { id: '1', symptoms: 'Dull ache in lower back', urgency: 'Low', created_at: '2026-04-09T10:00:00Z', result: { category: 'Musculoskeletal' } },
          { id: '2', symptoms: 'Severe headache and light sensitivity', urgency: 'Medium', created_at: '2026-04-05T14:30:00Z', result: { category: 'Neurological' } },
        ]);
      } finally {
        setIsLoading(false);
      }
    };
    loadHistory();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 py-16">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-16">
        <div>
          <h1 className="text-4xl md:text-5xl font-black mb-2 tracking-tight">Health <span className="text-gradient">Dashboard</span></h1>
          <p className="text-foreground/50">Tracking your medical journey and symptom trends.</p>
        </div>
        <div className="flex gap-4">
          <div className="flex items-center gap-3 glass px-6 py-4 rounded-3xl border-primary-500/20">
            <Activity className="h-6 w-6 text-primary-400" />
            <div>
              <div className="text-[10px] text-foreground/40 font-bold uppercase">Health Score</div>
              <div className="text-lg font-bold">84/100</div>
            </div>
          </div>
        </div>
      </div>

      {/* Analytics Grid */}
      <DashboardCharts />

      {/* History Section */}
      <div className="mt-20">
        <div className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-primary-500/10 rounded-2xl flex items-center justify-center text-primary-400">
              <History className="h-6 w-6" />
            </div>
            <h2 className="text-2xl font-bold">Symptom History</h2>
          </div>
          <button className="text-sm font-bold text-primary-500 flex items-center gap-1 hover:gap-2 transition-all">
            Export Report <ArrowUpRight className="h-4 w-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading ? (
            Array(3).fill(0).map((_, i) => (
              <div key={i} className="h-40 rounded-3xl bg-white/5 animate-shimmer" />
            ))
          ) : history.length > 0 ? (
            history.map((log) => (
              <motion.div
                key={log.id}
                whileHover={{ y: -5 }}
                className="glass p-6 rounded-3xl border-white/5 relative group"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${log.urgency === 'Emergency' ? 'bg-rose-500/10 text-rose-500' : log.urgency === 'Medium' ? 'bg-amber-400/10 text-amber-500' : 'bg-emerald-400/10 text-emerald-500'}`}>
                    {log.urgency}
                  </div>
                  <div className="text-[10px] text-foreground/30 flex items-center gap-1 font-medium">
                    <Calendar className="h-3 w-3" />
                    {new Date(log.created_at).toLocaleDateString()}
                  </div>
                </div>
                <p className="text-sm font-bold mb-2 line-clamp-2 leading-relaxed">"{log.symptoms}"</p>
                <div className="text-xs text-foreground/40 font-medium">{log.result?.category || 'General Analysis'}</div>
                
                <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity">
                  <ArrowUpRight className="h-5 w-5 text-primary-500" />
                </div>
              </motion.div>
            ))
          ) : (
            <div className="col-span-full py-20 text-center glass rounded-3xl border-dashed border-white/10">
              <ShieldCheck className="h-12 w-12 text-foreground/10 mx-auto mb-4" />
              <p className="text-foreground/40">No symptom checks performed yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
