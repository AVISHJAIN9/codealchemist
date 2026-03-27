import { ShieldCheck, ShieldAlert, AlertTriangle, Clock } from "lucide-react";
import { motion } from "framer-motion";
import type { AnalysisData } from "./AnalysisResult";

interface AnalysisHistoryProps {
  history: AnalysisData[];
  onSelect: (item: AnalysisData) => void;
}

const verdictIcon = {
  authentic: { icon: ShieldCheck, color: "text-success" },
  suspicious: { icon: AlertTriangle, color: "text-warning" },
  fake: { icon: ShieldAlert, color: "text-accent" },
};

const AnalysisHistory = ({ history, onSelect }: AnalysisHistoryProps) => {
  if (history.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground text-sm">
        <Clock className="w-8 h-8 mx-auto mb-2 opacity-50" />
        No analysis history yet
      </div>
    );
  }

  return (
    <div className="space-y-2 max-h-[400px] overflow-y-auto pr-1">
      {history.map((item, i) => {
        const v = verdictIcon[item.verdict];
        const Icon = v.icon;
        return (
          <motion.button
            key={item.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
            onClick={() => onSelect(item)}
            className="w-full flex items-center gap-3 p-3 rounded-md bg-secondary/50 hover:bg-secondary border border-transparent hover:border-border transition-all text-left"
          >
            <Icon className={`w-4 h-4 flex-shrink-0 ${v.color}`} />
            <div className="min-w-0 flex-1">
              <p className="text-foreground text-sm font-medium truncate">{item.fileName}</p>
              <p className="text-muted-foreground text-xs">{item.confidence}% • {new Date(item.analyzedAt).toLocaleDateString()}</p>
            </div>
          </motion.button>
        );
      })}
    </div>
  );
};

export default AnalysisHistory;
