import { useState } from "react";
import { motion } from "framer-motion";
import { FileText, Loader2, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import ResultCard from "@/components/ResultCard";

const ContentDetection = () => {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const { toast } = useToast();

  const analyze = async () => {
    if (!content.trim()) {
      toast({ title: "Please enter some content", variant: "destructive" });
      return;
    }
    setLoading(true);
    setResult(null);
    try {
      const { data, error } = await supabase.functions.invoke("analyze-content", {
        body: { type: "content", content },
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
              <FileText className="h-5 w-5 text-primary" />
            </div>
            <h1 className="text-3xl font-bold text-foreground">AI Content Detection</h1>
          </div>
          <p className="text-muted-foreground mb-8 ml-[52px]">
            Paste any text to determine if it was written by AI or a human.
          </p>

          <div className="bg-card border border-border rounded-xl p-6">
            <label className="block text-sm font-medium text-foreground mb-2">Text Content</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Paste an article, essay, email, or any text you want to analyze for AI generation..."
              className="w-full h-56 bg-muted border border-border rounded-lg p-4 text-foreground placeholder:text-muted-foreground resize-none focus:outline-none focus:ring-2 focus:ring-ring text-sm"
            />
            <Button variant="hero" className="mt-4 w-full" onClick={analyze} disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Analyzing...
                </>
              ) : (
                <>
                  <ShieldCheck className="h-4 w-4 mr-2" />
                  Analyze Content
                </>
              )}
            </Button>
          </div>

          {result && <ResultCard result={result} type="content" />}
        </motion.div>
      </div>
    </div>
  );
};

export default ContentDetection;
