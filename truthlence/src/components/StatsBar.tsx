import { Shield, ShieldAlert, AlertTriangle, Activity } from "lucide-react";
import { motion } from "framer-motion";

interface StatsBarProps {
  total: number;
  authentic: number;
  suspicious: number;
  fake: number;
}

const StatsBar = ({ total, authentic, suspicious, fake }: StatsBarProps) => {
  const stats = [
    { label: "Total Scans", value: total, icon: Activity, color: "text-primary" },
    { label: "Authentic", value: authentic, icon: Shield, color: "text-success" },
    { label: "Suspicious", value: suspicious, icon: AlertTriangle, color: "text-warning" },
    { label: "Fake", value: fake, icon: ShieldAlert, color: "text-accent" },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {stats.map((stat, i) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
          className="bg-card border border-border rounded-lg p-3 text-center"
        >
          <stat.icon className={`w-5 h-5 mx-auto mb-1 ${stat.color}`} />
          <p className={`font-mono text-xl font-bold ${stat.color}`}>{stat.value}</p>
          <p className="text-muted-foreground text-xs">{stat.label}</p>
        </motion.div>
      ))}
    </div>
  );
};

export default StatsBar;
