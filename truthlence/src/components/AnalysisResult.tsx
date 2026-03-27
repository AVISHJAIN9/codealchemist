import { motion } from "framer-motion";
import { ShieldCheck, ShieldAlert, AlertTriangle, Clock, FileText, ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export interface FactCheckSource {
  source: string;
  rating: string;
  url?: string;
}

export interface AnalysisData {
  id: string;
  fileName: string;
  fileType: string;
  verdict: "authentic" | "suspicious" | "fake";
  confidence: number;
  summary: string;
  details: string[];
  factCheckSources?: FactCheckSource[];
  analyzedAt: string;
}

interface AnalysisResultProps {
  data: AnalysisData;
}

const verdictConfig = {
  authentic: {
    icon: ShieldCheck,
    label: "AUTHENTIC",
    colorClass: "text-success",
    bgClass: "bg-success/10 border-success/30",
    badgeClass: "bg-success/20 text-success border-success/40",
    glowClass: "glow-success",
  },
  suspicious: {
    icon: AlertTriangle,
    label: "SUSPICIOUS",
    colorClass: "text-warning",
    bgClass: "bg-warning/10 border-warning/30",
    badgeClass: "bg-warning/20 text-warning border-warning/40",
    glowClass: "",
  },
  fake: {
    icon: ShieldAlert,
    label: "FAKE DETECTED",
    colorClass: "text-accent",
    bgClass: "bg-accent/10 border-accent/30",
    badgeClass: "bg-accent/20 text-accent border-accent/40",
    glowClass: "glow-accent",
  },
};

const AnalysisResult = ({ data }: AnalysisResultProps) => {
  const config = verdictConfig[data.verdict];
  const Icon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.4 }}
      className={`rounded-lg border p-5 ${config.bgClass} ${config.glowClass}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <Icon className={`w-7 h-7 ${config.colorClass}`} />
          <div>
            <h3 className={`font-mono text-lg font-bold ${config.colorClass}`}>
              {config.label}
            </h3>
            <p className="text-muted-foreground text-xs flex items-center gap-1 mt-0.5">
              <FileText className="w-3 h-3" />
              {data.fileName}
            </p>
          </div>
        </div>
        <Badge variant="outline" className={config.badgeClass}>
          {data.confidence}% confidence
        </Badge>
      </div>

      {/* Confidence bar */}
      <div className="w-full h-1.5 bg-secondary rounded-full mb-4 overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${data.confidence}%` }}
          transition={{ duration: 1, delay: 0.3 }}
          className={`h-full rounded-full ${
            data.verdict === "authentic"
              ? "bg-success"
              : data.verdict === "suspicious"
              ? "bg-warning"
              : "bg-accent"
          }`}
        />
      </div>

      {/* Summary */}
      <p className="text-foreground text-sm mb-3">{data.summary}</p>

      {/* Details */}
      <div className="space-y-1.5">
        {data.details.map((detail, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 + i * 0.1 }}
            className="flex items-start gap-2 text-xs text-muted-foreground"
          >
            <span className={`mt-1 w-1.5 h-1.5 rounded-full flex-shrink-0 ${
              data.verdict === "authentic" ? "bg-success" : data.verdict === "suspicious" ? "bg-warning" : "bg-accent"
            }`} />
            {detail}
          </motion.div>
        ))}
      </div>

      {/* Fact-Check Sources */}
      {data.factCheckSources && data.factCheckSources.length > 0 && (
        <div className="mt-3 pt-3 border-t border-border/50">
          <p className="text-xs font-mono text-muted-foreground mb-2">VERIFIED SOURCES:</p>
          <div className="space-y-1.5">
            {data.factCheckSources.map((src, i) => (
              <div key={i} className="flex items-center gap-2 text-xs">
                <Badge variant="outline" className="text-[10px] px-1.5 py-0 border-primary/30 text-primary">
                  {src.rating}
                </Badge>
                <span className="text-muted-foreground">{src.source}</span>
                {src.url && (
                  <a href={src.url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline ml-auto">
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Timestamp */}
      <div className="flex items-center gap-1 text-muted-foreground text-xs mt-4 pt-3 border-t border-border/50">
        <Clock className="w-3 h-3" />
        {new Date(data.analyzedAt).toLocaleString()}
      </div>
    </motion.div>
  );
};

export default AnalysisResult;
