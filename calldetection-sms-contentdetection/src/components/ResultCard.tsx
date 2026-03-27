import { motion } from "framer-motion";
import { ShieldCheck, ShieldAlert, ShieldQuestion, AlertTriangle } from "lucide-react";

interface ResultCardProps {
  result: {
    verdict: "fake" | "legitimate" | "suspicious";
    confidence: number;
    analysis: string;
    indicators: string[];
  };
  type: "call" | "sms" | "content";
}

const verdictConfig = {
  fake: {
    icon: ShieldAlert,
    label: "FAKE DETECTED",
    bg: "bg-nv-danger/10",
    border: "border-nv-danger/30",
    text: "text-nv-danger",
    barColor: "bg-nv-danger",
  },
  legitimate: {
    icon: ShieldCheck,
    label: "LIKELY LEGITIMATE",
    bg: "bg-nv-safe/10",
    border: "border-nv-safe/30",
    text: "text-nv-safe",
    barColor: "bg-nv-safe",
  },
  suspicious: {
    icon: ShieldQuestion,
    label: "SUSPICIOUS",
    bg: "bg-nv-warning/10",
    border: "border-nv-warning/30",
    text: "text-nv-warning",
    barColor: "bg-nv-warning",
  },
};

const ResultCard = ({ result, type }: ResultCardProps) => {
  const config = verdictConfig[result.verdict] || verdictConfig.suspicious;
  const Icon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className={`mt-6 rounded-xl border ${config.border} ${config.bg} p-6`}
    >
      <div className="flex items-center gap-3 mb-4">
        <Icon className={`h-8 w-8 ${config.text}`} />
        <div>
          <div className={`text-sm font-bold tracking-wider ${config.text}`}>{config.label}</div>
          <div className="text-xs text-muted-foreground">
            Confidence: {Math.round(result.confidence)}%
          </div>
        </div>
      </div>

      {/* Confidence bar */}
      <div className="w-full h-2 bg-muted rounded-full mb-5 overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${result.confidence}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
          className={`h-full rounded-full ${config.barColor}`}
        />
      </div>

      <div className="mb-4">
        <h4 className="text-sm font-semibold text-foreground mb-2">Analysis</h4>
        <p className="text-sm text-muted-foreground leading-relaxed">{result.analysis}</p>
      </div>

      {result.indicators && result.indicators.length > 0 && (
        <div>
          <h4 className="text-sm font-semibold text-foreground mb-2">Key Indicators</h4>
          <ul className="space-y-2">
            {result.indicators.map((indicator, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                <AlertTriangle className={`h-4 w-4 mt-0.5 shrink-0 ${config.text}`} />
                {indicator}
              </li>
            ))}
          </ul>
        </div>
      )}
    </motion.div>
  );
};

export default ResultCard;
