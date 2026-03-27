import { motion } from "framer-motion";
import { Shield, Phone, MessageSquare, FileText, Zap, Lock, Eye } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const features = [
  {
    icon: Phone,
    title: "Fake Call Detection",
    description: "Analyze call transcripts and audio patterns to detect AI-generated voice calls, deepfake impersonations, and social engineering attempts.",
    link: "/call-detection",
    color: "text-nv-green",
  },
  {
    icon: MessageSquare,
    title: "Fake SMS Detection",
    description: "Identify phishing SMS, AI-generated text messages, and fraudulent communication patterns in real-time.",
    link: "/sms-detection",
    color: "text-nv-green",
  },
  {
    icon: FileText,
    title: "AI Content Detection",
    description: "Detect AI-generated text, articles, and documents. Distinguish between human and machine-written content with high accuracy.",
    link: "/content-detection",
    color: "text-nv-green",
  },
];

const stats = [
  { value: "99.7%", label: "Detection Accuracy" },
  { value: "< 2s", label: "Analysis Time" },
  { value: "50M+", label: "Threats Detected" },
  { value: "24/7", label: "Real-time Protection" },
];

const Index = () => {
  return (
    <div className="min-h-screen nv-gradient-bg">
      {/* Hero */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 nv-grid-bg opacity-30" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl" />
        
        <div className="container relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 bg-primary/5 mb-8">
              <Zap className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-primary">AI-Powered Threat Detection</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-6">
              <span className="text-foreground">Detect </span>
              <span className="text-primary nv-text-glow">Deepfakes</span>
              <br />
              <span className="text-foreground">Before They Strike</span>
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
              Advanced AI analysis for fake calls, fraudulent SMS, and AI-generated content. 
              Protect yourself from digital deception with military-grade detection.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/call-detection">
                <Button variant="hero" size="lg" className="text-base px-8 py-6">
                  <Shield className="h-5 w-5 mr-2" />
                  Start Scanning
                </Button>
              </Link>
              <Link to="/content-detection">
                <Button variant="outline-glow" size="lg" className="text-base px-8 py-6">
                  <Eye className="h-5 w-5 mr-2" />
                  Try Content Detection
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 border-y border-border">
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="text-center"
              >
                <div className="text-3xl md:text-4xl font-black text-primary nv-text-glow mb-2">{stat.value}</div>
                <div className="text-sm text-muted-foreground font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">Detection Capabilities</h2>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">
              Three powerful detection modules powered by advanced AI models.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: i * 0.15 }}
              >
                <Link to={feature.link}>
                  <div className="group relative p-8 rounded-xl bg-card border border-border hover:nv-border-glow transition-all duration-300 h-full">
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-b from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="relative z-10">
                      <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-5">
                        <feature.icon className={`h-6 w-6 ${feature.color}`} />
                      </div>
                      <h3 className="text-xl font-bold mb-3 text-foreground group-hover:text-primary transition-colors">
                        {feature.title}
                      </h3>
                      <p className="text-muted-foreground leading-relaxed text-sm">{feature.description}</p>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 border-t border-border">
        <div className="container text-center">
          <Lock className="h-10 w-10 text-primary mx-auto mb-6" />
          <h2 className="text-3xl font-bold text-foreground mb-4">Stay Protected</h2>
          <p className="text-muted-foreground max-w-lg mx-auto mb-8">
            Our AI models are continuously trained on the latest deepfake techniques to keep you safe.
          </p>
          <Link to="/call-detection">
            <Button variant="hero" size="lg" className="text-base px-8 py-6">
              Get Started Free
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-border">
        <div className="container flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Shield className="h-4 w-4 text-primary" />
            <span>DeepGuard © 2026. AI-Powered Threat Detection.</span>
          </div>
          <div className="flex gap-6 text-sm text-muted-foreground">
            <span>Privacy</span>
            <span>Terms</span>
            <span>Contact</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
