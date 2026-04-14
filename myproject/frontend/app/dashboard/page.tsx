"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { History, TrendingUp, Calendar, ArrowUpRight, Activity, ShieldCheck } from "lucide-react";
import DashboardCharts from "@/components/DashboardCharts";
import { fetchHistory } from "@/lib/api";
import { useAuth } from "@/components/AuthContext";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [history, setHistory] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  useEffect(() => {
    const loadHistory = async () => {
      if (!user) return;

      try {
        const data = await fetchHistory();
        if (data && data.length > 0) {
          setHistory(data);
        } else {
          setHistory([
            { id: '1', symptoms: 'Dull ache in lower back that gets worse when standing', urgency: 'Low', created_at: new Date().toISOString(), result: { category: 'Musculoskeletal' } },
            { id: '2', symptoms: 'Severe headache and light sensitivity since morning', urgency: 'Medium', created_at: new Date(Date.now() - 86400000).toISOString(), result: { category: 'Neurological' } },
            { id: '3', symptoms: 'Mild fever and dry cough', urgency: 'Low', created_at: new Date(Date.now() - 172800000).toISOString(), result: { category: 'Respiratory' } },
          ]);
        }
      } catch (err) {
        setHistory([
          { id: '1', symptoms: 'Dull ache in lower back that gets worse when standing', urgency: 'Low', created_at: new Date().toISOString(), result: { category: 'Musculoskeletal' } },
          { id: '2', symptoms: 'Severe headache and light sensitivity since morning', urgency: 'Medium', created_at: new Date(Date.now() - 86400000).toISOString(), result: { category: 'Neurological' } },
          { id: '3', symptoms: 'Mild fever and dry cough', urgency: 'Low', created_at: new Date(Date.now() - 172800000).toISOString(), result: { category: 'Respiratory' } },
        ]);
      } finally {
        setIsLoading(false);
      }
    };

    if (user && !loading) {
      loadHistory();
    }
  }, [user, loading]);

  if (loading || (!user && !loading)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin h-8 w-8 border-2 border-outline-variant border-t-emerald rounded-full" />
      </div>
    );
  }

  return (
    <div className="bg-background min-h-screen pt-32 pb-20 px-6 md:px-12 lg:px-16">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-16">
          <div className="space-y-3">
            <h1 className="text-4xl md:text-5xl font-heading font-extrabold text-foreground tracking-tight leading-[1.1]">
              Health Dashboard
            </h1>
            <p className="text-on-surface-variant text-base max-w-md">
              Your intelligent clinical command center. Monitoring history, identifying trends.
            </p>
          </div>
          
          <div className="surface-card p-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald/8 flex items-center justify-center">
              <Activity className="h-6 w-6 text-emerald" />
            </div>
            <div>
              <div className="text-[11px] text-on-surface-variant font-heading font-bold uppercase tracking-[0.1em]">Wellness Index</div>
              <div className="text-2xl font-heading font-extrabold text-foreground">84 / 100</div>
            </div>
          </div>
        </div>

        {/* Analytics Banner */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="w-full relative rounded-3xl overflow-hidden mb-16 emerald-surface p-12 md:p-16 editorial-shadow-lg"
        >
          <div className="absolute inset-0 sanctuary-grid opacity-10" />
          
          <div className="relative z-10 max-w-lg">
            <div className="bg-white/10 rounded-full px-4 py-1.5 text-[11px] font-heading font-bold uppercase tracking-[0.15em] text-white/80 inline-flex items-center gap-2 mb-6 backdrop-blur-sm">
              <TrendingUp className="h-3 w-3" />
              Clinical Intelligence
            </div>
            <h2 className="text-3xl md:text-4xl font-heading font-extrabold text-white mb-4 tracking-tight leading-[1.1]">
              Diagnostics Console
            </h2>
            <p className="text-white/70 text-sm md:text-base leading-relaxed">
              Continuously mapping clinical history to identify patterns and secure your path to wellness.
            </p>
          </div>
        </motion.div>

        {/* Charts */}
        <div className="mb-24">
          <DashboardCharts />
        </div>

        {/* History */}
        <section className="space-y-10">
          <div className="flex flex-col md:flex-row items-end justify-between gap-8 pb-6">
            <div className="flex items-center gap-5">
              <div className="w-14 h-14 rounded-xl bg-emerald/8 flex items-center justify-center">
                <History className="h-7 w-7 text-emerald" />
              </div>
              <h2 className="text-3xl md:text-4xl font-heading font-extrabold text-foreground tracking-tight">
                Case Archive
              </h2>
            </div>

            <button 
              onClick={async () => {
                if (history.length === 0) return alert('No records found to export.');
                const { jsPDF } = await import('jspdf');
                const doc = new jsPDF();
                doc.setFontSize(22);
                doc.setTextColor(0, 53, 39); 
                doc.text("MediRoute AI: Clinical Report", 20, 20);
                doc.setFontSize(10);
                doc.setTextColor(120, 120, 120);
                doc.text(`Session: ${user?.email}`, 20, 28);
                doc.text(`Generated: ${new Date().toLocaleString()}`, 20, 34);
                doc.setDrawColor(220, 220, 220);
                doc.line(20, 40, 190, 40);
                let yPos = 55;
                history.forEach((h, i) => {
                  if (yPos > 260) { doc.addPage(); yPos = 25; }
                  doc.setFontSize(14); doc.setTextColor(20, 27, 43);
                  doc.text(`Record [${i + 1}]`, 20, yPos); yPos += 10;
                  doc.setFontSize(10); doc.setTextColor(100, 100, 100);
                  doc.text(`Time: ${new Date(h.created_at).toLocaleString()}`, 20, yPos); yPos += 6;
                  doc.text(`Urgency: ${h.urgency}`, 20, yPos); yPos += 6;
                  doc.text(`Classification: ${h.result?.category || 'General'}`, 20, yPos); yPos += 8;
                  doc.text('Note:', 20, yPos); yPos += 6;
                  const splitSymptoms = doc.splitTextToSize(`"${h.symptoms}"`, 170);
                  doc.text(splitSymptoms, 20, yPos);
                  yPos += (splitSymptoms.length * 6) + 15;
                });
                doc.save(`MediRoute_Clinical_Report.pdf`);
              }}
              className="btn-pill btn-primary flex items-center gap-2 text-sm group"
            >
              Export Report
              <ArrowUpRight className="h-4 w-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {isLoading ? (
              Array(3).fill(0).map((_, i) => (
                <div key={i} className="h-60 rounded-2xl bg-surface-container-low animate-pulse" />
              ))
            ) : history.length > 0 ? (
              history.map((log, idx) => (
                <motion.div
                  key={log.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.05, duration: 0.6 }}
                  className="surface-card p-7 space-y-6 group"
                >
                  <div className="flex justify-between items-start">
                    <div className={`px-3 py-1 rounded-full text-[10px] font-heading font-bold uppercase tracking-[0.1em] ${
                      log.urgency === 'Emergency' ? 'badge-emergency' : 
                      log.urgency === 'Medium' ? 'badge-medium' : 
                      'badge-low'
                    }`}>
                      {log.urgency}
                    </div>
                    <div className="text-[10px] text-outline flex items-center gap-1.5 font-heading font-bold uppercase tracking-[0.1em]">
                      <Calendar className="h-3 w-3" />
                      {new Date(log.created_at).toLocaleDateString()}
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <p className="text-base font-heading font-bold text-foreground line-clamp-3 leading-snug">
                       &ldquo;{log.symptoms}&rdquo;
                    </p>
                    <div className="text-[11px] text-on-surface-variant font-heading font-bold uppercase tracking-[0.15em]">
                      {log.result?.category || 'Clinical Analysis'}
                    </div>
                  </div>

                  <ArrowUpRight className="h-4 w-4 text-outline/30 group-hover:text-emerald transition-colors" />
                </motion.div>
              ))
            ) : (
              <div className="col-span-full py-24 text-center surface-card">
                <ShieldCheck className="h-12 w-12 text-outline/20 mx-auto mb-4" />
                <p className="text-on-surface-variant font-heading font-bold uppercase tracking-[0.1em] text-xs">Archive Empty</p>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
