"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Watch, Heart, Activity, Moon, Footprints,
  Bluetooth, BluetoothConnected, RefreshCw, Zap,
  TrendingUp, TrendingDown, Minus
} from "lucide-react";

interface VitalMetric {
  id: string;
  label: string;
  value: number;
  unit: string;
  icon: React.ReactNode;
  min: number;
  max: number;
  normalMin: number;
  normalMax: number;
  color: string;
}

const generateVitals = (): VitalMetric[] => [
  {
    id: "heart_rate",
    label: "Heart Rate",
    value: Math.floor(62 + Math.random() * 30),
    unit: "bpm",
    icon: <Heart className="h-4 w-4" />,
    min: 40, max: 200, normalMin: 60, normalMax: 100,
    color: "text-rose-400",
  },
  {
    id: "spo2",
    label: "SpO₂",
    value: Math.floor(95 + Math.random() * 5),
    unit: "%",
    icon: <Activity className="h-4 w-4" />,
    min: 80, max: 100, normalMin: 95, normalMax: 100,
    color: "text-sky-400",
  },
  {
    id: "steps",
    label: "Steps Today",
    value: Math.floor(4000 + Math.random() * 8000),
    unit: "steps",
    icon: <Footprints className="h-4 w-4" />,
    min: 0, max: 20000, normalMin: 6000, normalMax: 15000,
    color: "text-emerald",
  },
  {
    id: "sleep",
    label: "Sleep Score",
    value: Math.floor(55 + Math.random() * 40),
    unit: "/100",
    icon: <Moon className="h-4 w-4" />,
    min: 0, max: 100, normalMin: 70, normalMax: 100,
    color: "text-lavender",
  },
];

function getStatus(metric: VitalMetric): { label: string; color: string; Icon: React.ElementType } {
  if (metric.value < metric.normalMin) return { label: "Low", color: "text-blue-400", Icon: TrendingDown };
  if (metric.value > metric.normalMax) return { label: "High", color: "text-amber-400", Icon: TrendingUp };
  return { label: "Normal", color: "text-emerald", Icon: Minus };
}

function getBar(metric: VitalMetric): number {
  return ((metric.value - metric.min) / (metric.max - metric.min)) * 100;
}

const deviceNames = [
  "Apple Watch Series 10",
  "Samsung Galaxy Watch 7",
  "Fitbit Sense 3",
  "Garmin Fenix 8",
  "Xiaomi Mi Band 9",
];

export default function WearableHub() {
  const [isConnected, setIsConnected] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [vitals, setVitals] = useState<VitalMetric[]>([]);
  const [deviceName, setDeviceName] = useState(deviceNames[0]);
  const [lastSyncTime, setLastSyncTime] = useState<Date | null>(null);
  const [batteryLevel, setBatteryLevel] = useState(85);

  const handleSync = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setVitals(generateVitals());
      setLastSyncTime(new Date());
      setIsSyncing(false);
      if (!isConnected) setIsConnected(true);
    }, 2200);
  };

  const handleConnect = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setDeviceName(deviceNames[Math.floor(Math.random() * deviceNames.length)]);
      setBatteryLevel(Math.floor(30 + Math.random() * 65));
      setIsConnected(true);
      setVitals(generateVitals());
      setLastSyncTime(new Date());
      setIsSyncing(false);
    }, 2500);
  };

  // Auto-pulse vitals when connected
  useEffect(() => {
    if (!isConnected) return;
    const interval = setInterval(() => {
      setVitals(prev => prev.map(v =>
        v.id === "heart_rate"
          ? { ...v, value: Math.max(v.min, Math.min(v.max, v.value + Math.floor(Math.random() * 5 - 2))) }
          : v
      ));
    }, 5000);
    return () => clearInterval(interval);
  }, [isConnected]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="surface-card overflow-hidden"
    >
      {/* Header */}
      <div className="px-8 pt-8 pb-6 flex items-center justify-between border-b border-outline-variant/10">
        <div className="flex items-center gap-4">
          <div className="w-11 h-11 rounded-xl bg-sky-500/10 flex items-center justify-center">
            <Watch className="h-5 w-5 text-sky-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-heading font-extrabold text-foreground text-lg">Wearable Health Hub</h3>
              <span className="px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-500 text-[9px] font-heading font-bold uppercase tracking-[0.1em]">Demo Mode</span>
            </div>
            <p className="text-on-surface-variant text-xs mt-0.5">
              {isConnected ? deviceName : "Connect your smartwatch to sync vitals"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {isConnected && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald/8 text-emerald text-[10px] font-heading font-bold uppercase tracking-[0.1em]">
              <BluetoothConnected className="h-3 w-3" />
              Live
            </div>
          )}
          {isConnected && batteryLevel && (
            <div className="text-[10px] text-on-surface-variant font-heading font-bold">
              🔋 {batteryLevel}%
            </div>
          )}
        </div>
      </div>

      <div className="p-8 space-y-6">
        {/* Connect / Sync Button */}
        <div className="flex gap-3">
          {!isConnected ? (
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={handleConnect}
              disabled={isSyncing}
              className="flex-1 flex items-center justify-center gap-2.5 py-4 rounded-2xl bg-sky-500/10 hover:bg-sky-500/20 text-sky-400 font-heading font-bold text-sm transition-all disabled:opacity-50"
            >
              {isSyncing ? (
                <><RefreshCw className="h-4 w-4 animate-spin" /> Connecting...</>
              ) : (
                <><Bluetooth className="h-4 w-4" /> Connect Device</>
              )}
            </motion.button>
          ) : (
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={handleSync}
              disabled={isSyncing}
              className="flex-1 flex items-center justify-center gap-2.5 py-4 rounded-2xl bg-emerald/8 hover:bg-emerald/15 text-emerald font-heading font-bold text-sm transition-all disabled:opacity-50"
            >
              {isSyncing ? (
                <><RefreshCw className="h-4 w-4 animate-spin" /> Syncing Data...</>
              ) : (
                <><Zap className="h-4 w-4" /> Sync Now</>
              )}
            </motion.button>
          )}
        </div>

        {lastSyncTime && (
          <p className="text-[10px] text-outline font-heading font-bold uppercase tracking-[0.1em] text-center">
            Last synced: {lastSyncTime.toLocaleTimeString()}
          </p>
        )}

        {/* Vitals Grid */}
        <AnimatePresence>
          {vitals.length > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="grid grid-cols-1 sm:grid-cols-2 gap-4"
            >
              {vitals.map((metric, idx) => {
                const { label: statusLabel, color: statusColor, Icon: StatusIcon } = getStatus(metric);
                const barPct = getBar(metric);

                return (
                  <motion.div
                    key={metric.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: idx * 0.08 }}
                    className="p-5 rounded-2xl bg-surface-container-low space-y-4"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className={`${metric.color}`}>{metric.icon}</div>
                        <span className="text-[11px] font-heading font-bold text-on-surface-variant uppercase tracking-[0.1em]">
                          {metric.label}
                        </span>
                      </div>
                      <div className={`flex items-center gap-1 text-[10px] font-heading font-bold uppercase tracking-[0.1em] ${statusColor}`}>
                        <StatusIcon className="h-3 w-3" />
                        {statusLabel}
                      </div>
                    </div>

                    <div className="flex items-end gap-1.5">
                      <motion.span
                        key={metric.value}
                        initial={{ opacity: 0.5, y: 3 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`text-3xl font-heading font-extrabold ${metric.color} leading-none`}
                      >
                        {metric.value}
                      </motion.span>
                      <span className="text-on-surface-variant text-xs font-heading font-bold mb-1">{metric.unit}</span>
                    </div>

                    {/* Progress bar */}
                    <div className="h-1.5 rounded-full bg-outline-variant/10 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${barPct}%` }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        className="h-full rounded-full"
                        style={{
                          background: statusLabel === "Normal"
                            ? "var(--color-emerald)"
                            : statusLabel === "High"
                            ? "#f59e0b"
                            : "#60a5fa",
                        }}
                      />
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Placeholder when not connected */}
        {!isConnected && !isSyncing && (
          <div className="py-12 text-center space-y-3">
            <Watch className="h-10 w-10 text-outline/20 mx-auto" />
            <p className="text-on-surface-variant text-xs font-heading font-bold uppercase tracking-[0.1em]">
              No Device Connected
            </p>
            <p className="text-outline text-xs max-w-xs mx-auto">
              Connect a smartwatch or fitness tracker to view real-time health metrics
            </p>
          </div>
        )}
        {/* Demo disclaimer */}
        <div className="mt-2 p-3 rounded-xl bg-amber-500/5 border border-amber-500/15 flex items-start gap-2">
          <span className="text-amber-500 text-[10px] mt-0.5">⚠</span>
          <p className="text-[10px] text-on-surface-variant leading-relaxed">
            <span className="font-heading font-bold text-amber-500">Demo Mode:</span> Vitals shown are simulated for demonstration. Real smartwatch BLE integration requires a native mobile app (iOS/Android Health APIs).
          </p>
        </div>
      </div>
    </motion.div>
  );
}
