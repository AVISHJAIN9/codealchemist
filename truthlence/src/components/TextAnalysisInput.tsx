import { useState } from "react";
import { Search, Clipboard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface TextAnalysisInputProps {
  onAnalyze: (text: string) => void;
  isAnalyzing: boolean;
}

const TextAnalysisInput = ({ onAnalyze, isAnalyzing }: TextAnalysisInputProps) => {
  const [text, setText] = useState("");

  const handlePaste = async () => {
    try {
      const clipboardText = await navigator.clipboard.readText();
      setText(clipboardText);
    } catch {
      // Clipboard access denied
    }
  };

  return (
    <div className="space-y-3">
      <div className="relative">
        <Textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Paste any article text, news paragraph, or claim to verify its credibility..."
          className="min-h-[120px] bg-secondary border-border text-foreground placeholder:text-muted-foreground resize-none font-sans text-sm"
          disabled={isAnalyzing}
        />
        <button
          onClick={handlePaste}
          className="absolute top-2 right-2 text-muted-foreground hover:text-primary transition-colors p-1"
          title="Paste from clipboard"
        >
          <Clipboard className="w-4 h-4" />
        </button>
      </div>
      <Button
        onClick={() => text.trim() && onAnalyze(text.trim())}
        disabled={!text.trim() || isAnalyzing}
        className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-mono text-sm"
      >
        <Search className="w-4 h-4 mr-2" />
        {isAnalyzing ? "Analyzing..." : "Check Credibility"}
      </Button>
    </div>
  );
};

export default TextAnalysisInput;
