import { useState } from "react";
import { Globe, Search, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface UrlAnalysisInputProps {
  onAnalyze: (text: string, url: string) => void;
  isAnalyzing: boolean;
}

const UrlAnalysisInput = ({ onAnalyze, isAnalyzing }: UrlAnalysisInputProps) => {
  const [url, setUrl] = useState("");
  const [fetching, setFetching] = useState(false);
  const [error, setError] = useState("");

  const handleAnalyze = async () => {
    if (!url.trim()) return;
    setError("");
    setFetching(true);

    try {
      // Use a CORS proxy or direct fetch for article text
      const res = await fetch(url.trim());
      if (!res.ok) throw new Error("Could not fetch URL");
      const html = await res.text();

      // Extract text content from HTML
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, "text/html");

      // Remove scripts, styles, navs
      doc.querySelectorAll("script, style, nav, footer, header, aside, iframe").forEach(el => el.remove());

      // Get article body or main content
      const article = doc.querySelector("article") || doc.querySelector("main") || doc.body;
      const text = article?.textContent?.replace(/\s+/g, " ").trim().slice(0, 5000) || "";

      if (text.length < 20) {
        throw new Error("Could not extract meaningful text from this URL. Try pasting the text directly.");
      }

      onAnalyze(text, url.trim());
    } catch (err: any) {
      setError(err.message || "Failed to fetch article. Try pasting the text directly.");
    } finally {
      setFetching(false);
    }
  };

  const loading = fetching || isAnalyzing;

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            value={url}
            onChange={(e) => { setUrl(e.target.value); setError(""); }}
            placeholder="https://example.com/news-article"
            className="pl-9 bg-secondary border-border text-foreground placeholder:text-muted-foreground text-sm"
            disabled={loading}
            onKeyDown={(e) => e.key === "Enter" && handleAnalyze()}
          />
        </div>
      </div>
      {error && (
        <p className="text-xs text-accent">{error}</p>
      )}
      <Button
        onClick={handleAnalyze}
        disabled={!url.trim() || loading}
        className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-mono text-sm"
      >
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            {fetching ? "Fetching article..." : "Analyzing..."}
          </>
        ) : (
          <>
            <Search className="w-4 h-4 mr-2" />
            Fetch & Analyze
          </>
        )}
      </Button>
      <p className="text-muted-foreground text-[11px] text-center">
        Paste any news article, blog post, or social media URL to check its credibility
      </p>
    </div>
  );
};

export default UrlAnalysisInput;
