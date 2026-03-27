import { useState } from "react";
import { motion } from "framer-motion";
import { Phone, Loader2, ShieldCheck, ShieldAlert, ShieldQuestion } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import ResultCard from "@/components/ResultCard";

const CallDetection = () => {
  const [transcript, setTranscript] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const { toast } = useToast();

  const analyze = async () => {
    if (!transcript.trim()) {
      toast({ title: "Please enter a call transcript", variant: "destructive" });
      return;
    }
    setLoading(true);
    setResult(null);
    try {
      const { data, error } = await supabase.functions.invoke("analyze-content", {
        body: { type: "call", content: transcript },
      });
      if (error) throw error;
      setResult(data);
    } catch (e: any) {
      toast({ title: "Analysis failed", description: e.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen nv-gradient-bg pt-24 pb-16">
      <div className="container max-w-3xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Phone className="h-5 w-5 text-primary" />
            </div>
            <h1 className="text-3xl font-bold text-foreground">Fake Call Detection</h1>
          </div>
          <p className="text-muted-foreground mb-8 ml-[52px]">
            Paste a call transcript to detect deepfake voices, social engineering, and AI-generated speech patterns.
          </p>

          <div className="bg-card border border-border rounded-xl p-6">
            <label className="block text-sm font-medium text-foreground mb-2">Call Transcript</label>
            <textarea
              value={transcript}
              onChange={(e) => setTranscript(e.target.value)}
              placeholder={`Paste the call transcript here...\n\nExample:\nCaller: "Hi, this is John from your bank. We've detected suspicious activity on your account..."\nYou: "What kind of activity?"\nCaller: "Someone tried to withdraw $5,000. I need to verify your identity with your SSN and account number..."`}
              className="w-full h-48 bg-muted border border-border rounded-lg p-4 text-foreground placeholder:text-muted-foreground resize-none focus:outline-none focus:ring-2 focus:ring-ring text-sm"
            />
            <Button
              variant="hero"
              className="mt-4 w-full"
              onClick={analyze}
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Analyzing...
                </>
              ) : (
                <>
                  <ShieldCheck className="h-4 w-4 mr-2" />
                  Analyze Call
                </>
              )}
            </Button>
          </div>

          {result && <ResultCard result={result} type="call" />}
        </motion.div>
      </div>
    </div>
  );
};

export default CallDetection;
