import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

const AnalyzingOverlay = () => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="rounded-lg border border-primary/30 bg-primary/5 p-6 text-center glow-primary"
  >
    <Loader2 className="w-8 h-8 text-primary mx-auto mb-3 animate-spin" />
    <p className="font-mono text-primary text-sm font-semibold">ANALYZING MEDIA</p>
    <p className="text-muted-foreground text-xs mt-1">Running deepfake detection & credibility checks...</p>
    <div className="mt-4 space-y-1">
      {["Extracting metadata", "Spectral analysis", "AI pattern detection", "Cross-referencing sources"].map((step, i) => (
        <motion.div
          key={step}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: i * 0.5 }}
          className="flex items-center gap-2 text-xs text-muted-foreground justify-center"
        >
          <motion.div
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.3 }}
            className="w-1.5 h-1.5 rounded-full bg-primary"
          />
          {step}
        </motion.div>
      ))}
    </div>
  </motion.div>
);

export default AnalyzingOverlay;
