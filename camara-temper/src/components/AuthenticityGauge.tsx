import { motion } from 'framer-motion';
import { ShieldCheck, ShieldAlert, ShieldX } from 'lucide-react';
import type { AnalysisFlag } from '@/lib/fileAnalyzer';

interface Props {
  score: number;
  flags: AnalysisFlag[];
}

const AuthenticityGauge = ({ score, flags }: Props) => {
  const getColor = () => {
    if (score >= 70) return 'text-primary';
    if (score >= 40) return 'text-yellow-500';
    return 'text-destructive';
  };

  const getIcon = () => {
    if (score >= 70) return ShieldCheck;
    if (score >= 40) return ShieldAlert;
    return ShieldX;
  };

  const getLabel = () => {
    if (score >= 85) return 'HIGHLY AUTHENTIC';
    if (score >= 70) return 'LIKELY AUTHENTIC';
    if (score >= 40) return 'SUSPICIOUS';
    return 'LIKELY MANIPULATED';
  };

  const Icon = getIcon();
  const circumference = 2 * Math.PI * 54;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-card border border-border rounded-xl p-6"
    >
      <h3 className="font-display text-xs tracking-widest text-primary mb-6 text-center">AUTHENTICITY ANALYSIS</h3>

      <div className="flex justify-center mb-6">
        <div className="relative w-36 h-36">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
            <circle cx="60" cy="60" r="54" fill="none" stroke="hsl(var(--muted))" strokeWidth="6" />
            <motion.circle
              cx="60" cy="60" r="54" fill="none"
              stroke={score >= 70 ? 'hsl(var(--primary))' : score >= 40 ? '#eab308' : 'hsl(var(--destructive))'}
              strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray={circumference}
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset: circumference * (1 - score / 100) }}
              transition={{ duration: 1.5, ease: 'easeOut' }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <motion.span
              className={`font-display text-3xl font-bold ${getColor()}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              {score}
            </motion.span>
            <span className="text-xs text-muted-foreground">/ 100</span>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center gap-2 mb-6">
        <Icon className={`w-5 h-5 ${getColor()}`} />
        <span className={`font-display text-sm tracking-wider ${getColor()}`}>{getLabel()}</span>
      </div>

      <div className="space-y-2">
        {flags.map((flag, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.8 + i * 0.1 }}
            className={`flex items-start gap-2 text-xs p-2 rounded border ${
              flag.type === 'success' ? 'border-primary/30 bg-primary/5 text-primary' :
              flag.type === 'warning' ? 'border-yellow-500/30 bg-yellow-500/5 text-yellow-500' :
              flag.type === 'danger' ? 'border-destructive/30 bg-destructive/5 text-destructive' :
              'border-border bg-muted/30 text-muted-foreground'
            }`}
          >
            <span className="mt-0.5">●</span>
            <div>
              <span className="font-semibold">{flag.message}</span>
              {flag.detail && <span className="block opacity-75">{flag.detail}</span>}
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default AuthenticityGauge;
