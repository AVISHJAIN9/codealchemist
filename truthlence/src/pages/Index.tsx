import { useState, useCallback } from "react";
import { Shield, Download, ExternalLink, Globe } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import FileUploadZone from "@/components/FileUploadZone";
import TextAnalysisInput from "@/components/TextAnalysisInput";
import UrlAnalysisInput from "@/components/UrlAnalysisInput";
import AnalysisResult, { type AnalysisData } from "@/components/AnalysisResult";
import AnalyzingOverlay from "@/components/AnalyzingOverlay";
import AnalysisHistory from "@/components/AnalysisHistory";
import StatsBar from "@/components/StatsBar";

const Index = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [currentResult, setCurrentResult] = useState<AnalysisData | null>(null);
  const [history, setHistory] = useState<AnalysisData[]>([]);
  const { toast } = useToast();

  const stats = {
    total: history.length,
    authentic: history.filter((h) => h.verdict === "authentic").length,
    suspicious: history.filter((h) => h.verdict === "suspicious").length,
    fake: history.filter((h) => h.verdict === "fake").length,
  };

  const analyzeContent = useCallback(
    async (content: string, fileName: string, fileType: string) => {
      setIsAnalyzing(true);
      setCurrentResult(null);

      try {
        const { data, error } = await supabase.functions.invoke("analyze-media", {
          body: { content, fileName, fileType },
        });

        if (error) throw error;

        const result: AnalysisData = {
          id: crypto.randomUUID(),
          fileName,
          fileType,
          verdict: data.verdict,
          confidence: data.confidence,
          summary: data.summary,
          details: data.details,
          factCheckSources: data.factCheckSources,
          analyzedAt: new Date().toISOString(),
        };

        setCurrentResult(result);
        setHistory((prev) => [result, ...prev]);
      } catch (err) {
        console.error("Analysis error:", err);
        toast({
          title: "Analysis Failed",
          description: "Could not complete the analysis. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsAnalyzing(false);
      }
    },
    [toast]
  );

  const handleFileSelect = useCallback(
    async (file: File) => {
      if (file.type.startsWith("text/") || file.type === "application/pdf") {
        const text = await file.text();
        analyzeContent(text.slice(0, 5000), file.name, file.type);
      } else {
        analyzeContent(
          `[Media file: ${file.name}, type: ${file.type}, size: ${(file.size / 1024 / 1024).toFixed(2)}MB]`,
          file.name,
          file.type
        );
      }
    },
    [analyzeContent]
  );

  const handleTextAnalyze = useCallback(
    (text: string) => {
      analyzeContent(text, "Text Input", "text/plain");
    },
    [analyzeContent]
  );

  const handleUrlAnalyze = useCallback(
    (text: string, url: string) => {
      analyzeContent(text, url, "text/html");
    },
    [analyzeContent]
  );

  const downloadExtension = () => {
    fetch("/truthlens-extension.zip")
      .then((res) => {
        if (!res.ok) throw new Error("Download failed");
        return res.blob();
      })
      .then((blob) => {
        const a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = "truthlens-extension.zip";
        a.click();
        URL.revokeObjectURL(a.href);
      })
      .catch(() =>
        toast({
          title: "Download unavailable",
          description: "Extension package is being prepared.",
        })
      );
  };

  return (
    <div className="min-h-screen bg-background grid-bg">
      {/* Header */}
      <header className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="w-6 h-6 text-primary" />
            <h1 className="font-mono text-lg font-bold text-foreground tracking-tight">
              TRUTH<span className="text-primary">LENS</span>
            </h1>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={downloadExtension}
            className="text-xs font-mono border-border text-muted-foreground hover:text-primary hover:border-primary"
          >
            <Download className="w-3 h-3 mr-1" />
            Chrome Extension
          </Button>
        </div>
      </header>

      <main className="container max-w-6xl mx-auto px-4 py-6">
        {/* Stats */}
        <StatsBar {...stats} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
          {/* Left: Input */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-card border border-border rounded-lg p-5">
              <h2 className="font-mono text-sm font-semibold text-foreground mb-4">
                &#47;&#47; ANALYZE CONTENT
              </h2>

              <Tabs defaultValue="upload" className="w-full">
                <TabsList className="grid w-full grid-cols-3 bg-secondary">
                  <TabsTrigger value="upload" className="font-mono text-xs">
                    File Upload
                  </TabsTrigger>
                  <TabsTrigger value="text" className="font-mono text-xs">
                    Paste Text
                  </TabsTrigger>
                  <TabsTrigger value="url" className="font-mono text-xs">
                    URL Check
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="upload" className="mt-4">
                  <FileUploadZone onFileSelect={handleFileSelect} isAnalyzing={isAnalyzing} />
                </TabsContent>
                <TabsContent value="text" className="mt-4">
                  <TextAnalysisInput onAnalyze={handleTextAnalyze} isAnalyzing={isAnalyzing} />
                </TabsContent>
                <TabsContent value="url" className="mt-4">
                  <UrlAnalysisInput onAnalyze={handleUrlAnalyze} isAnalyzing={isAnalyzing} />
                </TabsContent>
              </Tabs>
            </div>

            {/* Results */}
            <AnimatePresence mode="wait">
              {isAnalyzing && <AnalyzingOverlay />}
              {currentResult && !isAnalyzing && (
                <AnalysisResult data={currentResult} />
              )}
            </AnimatePresence>
          </div>

          {/* Right: History */}
          <div className="bg-card border border-border rounded-lg p-5">
            <h2 className="font-mono text-sm font-semibold text-foreground mb-4">
              &#47;&#47; HISTORY
            </h2>
            <AnalysisHistory history={history} onSelect={setCurrentResult} />
          </div>
        </div>

        {/* Extension promo */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-8 bg-card border border-primary/20 rounded-lg p-5 text-center"
        >
          <div className="flex items-center justify-center gap-2 mb-2">
            <ExternalLink className="w-4 h-4 text-primary" />
            <p className="font-mono text-sm text-primary font-semibold">
              CHECK CONTENT ON ANY WEBPAGE
            </p>
          </div>
          <p className="text-muted-foreground text-sm max-w-lg mx-auto">
            Install the TruthLens Chrome Extension to right-click any text or video on the web
            and instantly check its credibility — works on Google, WhatsApp Web, news sites, and more.
          </p>
          <Button
            onClick={downloadExtension}
            className="mt-3 bg-primary text-primary-foreground hover:bg-primary/90 font-mono text-xs"
            size="sm"
          >
            <Download className="w-3 h-3 mr-1" />
            Download Extension
          </Button>
        </motion.div>
      </main>
    </div>
  );
};

export default Index;
