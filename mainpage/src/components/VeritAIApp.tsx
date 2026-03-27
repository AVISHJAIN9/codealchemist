import { useState, useEffect, useRef, createContext, useContext } from "react";
import { useAuth } from "@/contexts/AuthContext";

/* ═══════════════════════════════════════
   THEME CONTEXT
═══════════════════════════════════════ */
const ThemeCtx = createContext<{ dark: boolean; toggle: () => void }>({ dark: true, toggle: () => {} });

/* ═══════════════════════════════════════
   DEMO DATA
═══════════════════════════════════════ */
const demoData = {
  high: {
    url: "https://reuters.com/world/us/fed-holds-rates-steady-2024",
    score: 84, label: "Highly Credible",
    desc: "Strong factual basis, neutral language, verified source with minimal bias signals.",
    verdict: "VERIFIED", verdictClass: "green", gaugeColor: "#76b900",
    fc: 88, sr: 95, sb: 79, cb: 91,
    source: { icon: "RT", iconBg: "rgba(118,185,0,.15)", iconColor: "#76b900", name: "reuters.com", meta: "Reuters · Est. 1851 · MBFC: Least Biased", tier: "HIGH RELIABILITY", tierClass: "green", tags: ["Established Media", "Wire Service", "Least Biased", "Global Coverage"] },
    claims: [
      { verdict: "VERIFIED", vClass: "green", text: "The Federal Reserve held interest rates steady at 5.25%–5.50% at its May 2024 meeting.", source: "PolitiFact" },
      { verdict: "VERIFIED", vClass: "green", text: "Inflation as measured by CPI stood at 3.4% year-on-year in April 2024.", source: "FactCheck.org" },
      { verdict: "UNVERIFIED", vClass: "blue", text: "Analysts predict two rate cuts before the end of the fiscal year.", source: "No matching fact-check found" },
    ],
    stats: { claims: "7", disputed: "0", disputedColor: "#76b900", emotion: "8%", emotionColor: "#76b900", bias: "CENTER" },
    preview: 'The <span class="hl-good">Federal Reserve held interest rates steady</span> at its policy meeting Wednesday, citing continued progress on inflation. Chair Powell told reporters officials remain committed to bringing <span class="hl-claim">inflation back to the 2% target</span>. <span class="hl-good">The CPI rose 3.4% year-on-year in April</span>, a modest improvement…',
    alerts: [
      { color: "#76b900", title: "Low clickbait score", body: "Headline is factual and non-sensational. No emotional manipulation detected in title." },
      { color: "#00a8e0", title: "Analyst prediction unverified", body: '"Two rate cuts predicted" is a forward-looking claim with no fact-check match. Treat as analyst opinion.' },
    ]
  },
  med: {
    url: "https://nypost.com/2024/05/inflation-mystery",
    score: 51, label: "Mixed Credibility",
    desc: "Partial factual basis with elevated clickbait signals. Moderate political lean detected.",
    verdict: "QUESTIONABLE", verdictClass: "amber", gaugeColor: "#f5a623",
    fc: 48, sr: 55, sb: 44, cb: 52,
    source: { icon: "NP", iconBg: "rgba(245,166,35,.15)", iconColor: "#f5a623", name: "nypost.com", meta: "New York Post · Est. 1801 · MBFC: Right-Center Bias", tier: "MED RELIABILITY", tierClass: "amber", tags: ["Tabloid", "Right-Center Bias", "Mixed Factual Rating", "Opinion Heavy"] },
    claims: [
      { verdict: "DISPUTED", vClass: "red", text: "Biden administration policies directly caused the inflation surge of 2022–2023.", source: "PolitiFact — rated MISLEADING" },
      { verdict: "VERIFIED", vClass: "green", text: "US inflation peaked at 9.1% in June 2022, the highest in 40 years.", source: "FactCheck.org" },
      { verdict: "DISPUTED", vClass: "red", text: "The Federal Reserve was caught completely off-guard by inflation.", source: "AP Fact Check — rated PARTLY FALSE" },
    ],
    stats: { claims: "9", disputed: "2", disputedColor: "#e53935", emotion: "38%", emotionColor: "#f5a623", bias: "RIGHT-CTR" },
    preview: 'The Biden White House is <span class="hl-bad">scrambling to cover up</span> the true scale of the inflation disaster that has <span class="hl-claim">crushed American families</span>. <span class="hl-good">Inflation hit a 40-year high of 9.1%</span> in June 2022 — but insiders say <span class="hl-bad">the real numbers are far worse</span>…',
    alerts: [
      { color: "#e53935", title: "High emotional language (38%)", body: 'Words like "scrambling", "crushed", "reckless" signal editorializing over reporting.' },
      { color: "#e53935", title: "2 disputed claims detected", body: "Causal policy-inflation claims rated Misleading or Partly False by PolitiFact and AP." },
      { color: "#f5a623", title: "Right-center political lean", body: "Source rated Right-Center bias by MBFC. Consider center-rated sources for balance." },
    ]
  },
  low: {
    url: "https://naturalnews.com/vaccine-microchips-2024",
    score: 12, label: "Very Low Credibility",
    desc: "Multiple disputed claims, extreme emotional language, known low-reliability source.",
    verdict: "MISINFO RISK", verdictClass: "red", gaugeColor: "#e53935",
    fc: 8, sr: 5, sb: 15, cb: 14,
    source: { icon: "NN", iconBg: "rgba(229,57,53,.15)", iconColor: "#e53935", name: "naturalnews.com", meta: "NaturalNews · MBFC: Conspiracy — Pseudoscience", tier: "NO RELIABILITY", tierClass: "red", tags: ["Known Misinformation", "Conspiracy", "Pseudoscience", "No Editorial Standards"] },
    claims: [
      { verdict: "DISPUTED", vClass: "red", text: "COVID-19 vaccines contain microchips that track individuals via 5G networks.", source: "Reuters Fact Check — rated FALSE" },
      { verdict: "DISPUTED", vClass: "red", text: "The WHO secretly controls all global vaccination programs for population control.", source: "AFP Fact Check — rated FALSE" },
      { verdict: "DISPUTED", vClass: "red", text: "Government data showing vaccine safety has been entirely fabricated.", source: "Snopes — rated FALSE" },
    ],
    stats: { claims: "11", disputed: "8", disputedColor: "#e53935", emotion: "82%", emotionColor: "#e53935", bias: "CONSPIRACY" },
    preview: '<span class="hl-bad">SHOCKING TRUTH they don\'t want you to know</span>: The global elite are <span class="hl-bad">using vaccines to implant tracking devices</span>. <span class="hl-bad">Mainstream media is suppressing</span> the explosive evidence that proves <span class="hl-bad">the WHO is orchestrating</span> the greatest medical fraud in human history…',
    alerts: [
      { color: "#e53935", title: "8 of 11 claims disputed", body: "Overwhelming majority of verifiable claims rated FALSE by Reuters, AFP, Snopes, and PolitiFact." },
      { color: "#e53935", title: "Extreme emotional language (82%)", body: "ALL CAPS, fear-mongering and urgent calls to action throughout. Classic misinformation pattern." },
      { color: "#e53935", title: "Known misinformation source", body: "NaturalNews is flagged by MBFC as a conspiracy/pseudoscience outlet with a history of false health claims." },
    ]
  }
};

/* JWT/DB/AuthBackend removed — now using Supabase via AuthContext */

/* ═══════════════════════════════════════
   COLOR MAP
═══════════════════════════════════════ */
const colors = {
  green: { bg: "rgba(118,185,0,0.12)", color: "#76b900", border: "rgba(118,185,0,0.25)" },
  amber: { bg: "rgba(245,166,35,0.12)", color: "#f5a623", border: "rgba(245,166,35,0.25)" },
  red: { bg: "rgba(229,57,53,0.12)", color: "#e53935", border: "rgba(229,57,53,0.25)" },
  blue: { bg: "rgba(0,168,224,0.12)", color: "#00a8e0", border: "rgba(0,168,224,0.25)" },
};

function getBadgeStyle(cls) {
  const c = colors[cls] || colors.blue;
  return { background: c.bg, color: c.color, border: `1px solid ${c.border}` };
}

function Badge({ cls, children, style = {} }) {
  const c = colors[cls] || colors.blue;
  return (
    <span style={{ background: c.bg, color: c.color, border: `1px solid ${c.border}`, padding: "3px 9px", fontFamily: "'Share Tech Mono', monospace", fontSize: 10, letterSpacing: ".1em", textTransform: "uppercase", display: "inline-flex", alignItems: "center", gap: 6, ...style }}>
      <span style={{ width: 6, height: 6, background: "currentColor", display: "inline-block", flexShrink: 0 }} />
      {children}
    </span>
  );
}

function SectionHeader({ num, title }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 12 }}>
      <span style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 10, color: "#555", letterSpacing: ".14em", textTransform: "uppercase", whiteSpace: "nowrap" }}>
        <span style={{ color: "#76b900", marginRight: 6 }}>{num}</span>{title}
      </span>
      <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.08)" }} />
    </div>
  );
}

function CardLabel({ children }) {
  return (
    <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 10, letterSpacing: ".14em", textTransform: "uppercase", color: "#555", marginBottom: 20, paddingBottom: 12, borderBottom: "1px solid rgba(255,255,255,0.08)", display: "flex", alignItems: "center", gap: 8 }}>
      <span style={{ color: "#76b900" }}>//</span>{children}
    </div>
  );
}

function StatCell({ val, color, label, small }) {
  return (
    <div style={{ background: "#0a0a0a", border: "1px solid rgba(255,255,255,0.08)", padding: "18px 20px", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 2, background: color || "#333" }} />
      <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: small ? 22 : 38, fontWeight: 800, lineHeight: 1, letterSpacing: "-.5px", marginBottom: 4, color }}>{val}</div>
      <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 10, color: "#555", letterSpacing: ".06em", textTransform: "uppercase" }}>{label}</div>
    </div>
  );
}

/* ═══════════════════════════════════════
   GAUGE
═══════════════════════════════════════ */
function Gauge({ score, color }) {
  const [displayed, setDisplayed] = useState(0);
  const [offset, setOffset] = useState(408);
  const circumference = 2 * Math.PI * 65;
  useEffect(() => {
    const target = score;
    const newOffset = circumference - (target / 100) * circumference;
    const t1 = setTimeout(() => setOffset(newOffset), 80);
    let count = 0;
    const iv = setInterval(() => {
      count = Math.min(count + Math.ceil(target / 25), target);
      setDisplayed(count);
      if (count >= target) clearInterval(iv);
    }, 36);
    return () => { clearTimeout(t1); clearInterval(iv); };
  }, [score]);
  return (
    <div style={{ position: "relative", width: 150, height: 150, margin: "0 auto 22px" }}>
      <svg width="150" height="150" viewBox="0 0 150 150" style={{ transform: "rotate(-90deg)" }}>
        <circle cx="75" cy="75" r="65" fill="none" stroke="#1a1a1a" strokeWidth="8" />
        <circle cx="75" cy="75" r="65" fill="none" stroke={color} strokeWidth="8"
          strokeDasharray={circumference} strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 1.4s cubic-bezier(.22,1,.36,1)" }} />
      </svg>
      <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", fontFamily: "'Barlow Condensed', sans-serif", fontSize: 52, fontWeight: 800, lineHeight: 1, color }}>{displayed}</div>
      <div style={{ position: "absolute", bottom: 16, left: "50%", transform: "translateX(-50%)", fontFamily: "'Share Tech Mono', monospace", fontSize: 10, color: "#555", letterSpacing: ".05em" }}>/100</div>
    </div>
  );
}

/* ═══════════════════════════════════════
   METRIC BAR
═══════════════════════════════════════ */
function MetricBar({ label, value, color }) {
  const [width, setWidth] = useState(0);
  useEffect(() => { const t = setTimeout(() => setWidth(value), 160); return () => clearTimeout(t); }, [value]);
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
      <div style={{ fontFamily: "'Barlow Semi Condensed', sans-serif", fontSize: 13, color: "#a0a0a0", minWidth: 150 }}>{label}</div>
      <div style={{ flex: 1, height: 3, background: "#1a1a1a" }}>
        <div style={{ height: "100%", width: width + "%", background: color, transition: "width 1.1s cubic-bezier(.22,1,.36,1)" }} />
      </div>
      <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 12, color, minWidth: 36, textAlign: "right" }}>{value}%</div>
    </div>
  );
}

/* ═══════════════════════════════════════
   LOADING STATE
═══════════════════════════════════════ */
function LoadingState({ visible }) {
  const [activeStep, setActiveStep] = useState(-1);
  const [doneSteps, setDoneSteps] = useState([]);
  const [statusLabel, setStatusLabel] = useState("INITIALIZING PIPELINE...");
  const steps = ["Extracting article content", "Running NLP pipeline", "Checking facts against database", "Evaluating source credibility", "Computing credibility score"];
  const labels = ["EXTRACTING CONTENT...", "RUNNING NLP PIPELINE...", "CHECKING FACT DATABASE...", "EVALUATING SOURCE...", "COMPUTING SCORE..."];
  useEffect(() => {
    if (!visible) { setActiveStep(-1); setDoneSteps([]); return; }
    let i = 0;
    setActiveStep(0);
    setStatusLabel(labels[0]);
    const iv = setInterval(() => {
      setDoneSteps(prev => [...prev, i]);
      i++;
      if (i < steps.length) { setActiveStep(i); setStatusLabel(labels[i]); }
      else clearInterval(iv);
    }, 480);
    return () => clearInterval(iv);
  }, [visible]);
  if (!visible) return null;
  return (
    <div style={{ padding: "60px 0", textAlign: "center" }}>
      <div style={{ width: 200, height: 2, background: "#1a1a1a", margin: "0 auto 28px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", left: "-100%", top: 0, bottom: 0, width: "100%", background: "#76b900", animation: "scanBar 1.2s ease-in-out infinite" }} />
      </div>
      <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 12, color: "#76b900", letterSpacing: ".1em", textTransform: "uppercase", marginBottom: 24 }}>{statusLabel}</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 6, alignItems: "center" }}>
        {steps.map((s, idx) => (
          <div key={idx} style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 11, display: "flex", alignItems: "center", gap: 10, color: doneSteps.includes(idx) ? "#76b900" : activeStep === idx ? "#fff" : "#555", transition: "color .2s" }}>
            <div style={{ width: 12, height: 1, background: "currentColor", flexShrink: 0 }} />{s}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════
   RESULTS
═══════════════════════════════════════ */
function Results({ data }) {
  if (!data) return null;
  return (
    <div style={{ padding: "40px 0 80px", animation: "fadeIn .3s ease" }}>
      <SectionHeader num="01" title="CREDIBILITY ANALYSIS" />
      <div style={{ display: "grid", gridTemplateColumns: "260px 1fr", gap: 2, marginBottom: 2 }}>
        <div style={{ background: "#0a0a0a", border: "1px solid rgba(255,255,255,0.08)", padding: "32px 24px", display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: data.gaugeColor }} />
          <Gauge score={data.score} color={data.gaugeColor} />
          <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 16, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, marginBottom: 6, color: data.gaugeColor }}>{data.label}</div>
          <div style={{ fontSize: 12, color: "#a0a0a0", lineHeight: 1.5, marginBottom: 18 }}>{data.desc}</div>
          <Badge cls={data.verdictClass}>{data.verdict}</Badge>
        </div>
        <div style={{ background: "#0a0a0a", border: "1px solid rgba(255,255,255,0.08)", borderLeft: "none", padding: "24px 28px" }}>
          <CardLabel>Signal Breakdown</CardLabel>
          <MetricBar label="Fact-check match" value={data.fc} color="#76b900" />
          <MetricBar label="Source reliability" value={data.sr} color="#00a8e0" />
          <MetricBar label="Sentiment neutrality" value={data.sb} color="#f5a623" />
          <MetricBar label="Non-clickbait score" value={data.cb} color={data.cb < 40 ? "#e53935" : "#76b900"} />
          <div style={{ marginTop: 22, paddingTop: 18, borderTop: "1px solid rgba(255,255,255,0.08)" }}>
            <CardLabel>Source Profile</CardLabel>
            <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "12px 14px", background: "#181818", marginBottom: 12 }}>
              <div style={{ width: 36, height: 36, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Barlow Condensed', sans-serif", fontSize: 12, fontWeight: 800, background: data.source.iconBg, color: data.source.iconColor, flexShrink: 0 }}>{data.source.icon}</div>
              <div>
                <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 12.5, color: "#fff" }}>{data.source.name}</div>
                <div style={{ fontSize: 11, color: "#a0a0a0", marginTop: 2 }}>{data.source.meta}</div>
              </div>
              <div style={{ marginLeft: "auto", ...getBadgeStyle(data.source.tierClass), padding: "3px 8px", fontFamily: "'Share Tech Mono', monospace", fontSize: 9.5, letterSpacing: ".08em", textTransform: "uppercase", whiteSpace: "nowrap" }}>{data.source.tier}</div>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {data.source.tags.map((t, i) => (
                <span key={i} style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 10, padding: "3px 9px", border: "1px solid rgba(255,255,255,0.15)", color: "#555", background: "#111" }}>{t}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 2, marginBottom: 2 }}>
        {[
          { val: data.stats.claims, color: "#00a8e0", label: "Claims Extracted" },
          { val: data.stats.disputed, color: data.stats.disputedColor, label: "Disputed Claims" },
          { val: data.stats.emotion, color: data.stats.emotionColor, label: "Emotional Language" },
          { val: data.stats.bias, color: "#fff", label: "Bias Indicator", small: data.stats.bias.length > 6 },
        ].map((s, i) => <StatCell key={i} val={s.val} color={s.color} label={s.label} small={s.small} />)}
      </div>
      <div style={{ height: 24 }} />
      <SectionHeader num="02" title="FACT-CHECK ALERTS" />
      <div style={{ background: "#0a0a0a", border: "1px solid rgba(255,255,255,0.08)", padding: "24px 28px", marginBottom: 2 }}>
        {data.claims.map((c, i) => (
          <div key={i} style={{ borderLeft: `2px solid ${colors[c.vClass]?.color || "#333"}`, padding: "12px 16px", marginBottom: i < data.claims.length - 1 ? 10 : 0, background: "#111" }}>
            <div style={{ display: "flex", alignItems: "flex-start", gap: 10, marginBottom: 7 }}>
              <span style={{ ...getBadgeStyle(c.vClass), padding: "3px 8px", fontFamily: "'Share Tech Mono', monospace", fontSize: 9, letterSpacing: ".1em", textTransform: "uppercase", flexShrink: 0, marginTop: 2 }}>{c.verdict}</span>
              <div style={{ fontSize: 13, color: "#fff", lineHeight: 1.5, fontWeight: 300 }}>{c.text}</div>
            </div>
            <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 10.5, color: "#555" }}>// Checked by: {c.source}</div>
          </div>
        ))}
      </div>
      <div style={{ height: 24 }} />
      <SectionHeader num="03" title="ARTICLE INTELLIGENCE" />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}>
        <div style={{ background: "#0a0a0a", border: "1px solid rgba(255,255,255,0.08)", padding: "24px 28px" }}>
          <CardLabel>Article Preview</CardLabel>
          <div style={{ background: "#111", padding: 16, fontSize: 13, color: "#a0a0a0", lineHeight: 1.75, position: "relative", overflow: "hidden", maxHeight: 138, fontWeight: 300 }} dangerouslySetInnerHTML={{ __html: data.preview }} />
          <div style={{ display: "flex", gap: 16, marginTop: 12, flexWrap: "wrap" }}>
            {[{ bg: "rgba(0,168,224,.4)", label: "FLAGGED CLAIM" }, { bg: "rgba(229,57,53,.4)", label: "DISPUTED" }, { bg: "rgba(118,185,0,.4)", label: "VERIFIED" }].map((l, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 6, fontFamily: "'Share Tech Mono', monospace", fontSize: 10, color: "#555", letterSpacing: ".04em" }}>
                <div style={{ width: 8, height: 8, background: l.bg }} />{l.label}
              </div>
            ))}
          </div>
        </div>
        <div style={{ background: "#0a0a0a", border: "1px solid rgba(255,255,255,0.08)", padding: "24px 28px" }}>
          <CardLabel>Misinformation Alerts</CardLabel>
          {data.alerts.map((a, i) => (
            <div key={i} style={{ display: "flex", gap: 12, padding: "13px 14px", background: "#111", marginBottom: i < data.alerts.length - 1 ? 8 : 0, borderLeft: `2px solid ${a.color}` }}>
              <div>
                <div style={{ fontFamily: "'Barlow Semi Condensed', sans-serif", fontSize: 13, fontWeight: 600, color: "#fff", marginBottom: 3 }}>{a.title}</div>
                <div style={{ fontSize: 12, color: "#a0a0a0", lineHeight: 1.5, fontWeight: 300 }}>{a.body}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════
   LANDING / HOME PAGE
═══════════════════════════════════════ */
function LandingPage({ onNavigate }) {
  const { dark } = useContext(ThemeCtx);
  const bg = dark ? "#000" : "#f8f8f5";
  const fg = dark ? "#fff" : "#0a0a0a";
  const muted = dark ? "#a0a0a0" : "#555";
  const card = dark ? "#0a0a0a" : "#fff";
  const border = dark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.1)";

  const [demoUrl, setDemoUrl] = useState("");
  const [demoLoading, setDemoLoading] = useState(false);
  const [demoResult, setDemoResult] = useState(null);

  const runHeroDemo = () => {
    setDemoLoading(true);
    setDemoResult(null);
    const types = ["high", "med", "low"];
    const t = types[Math.floor(Math.random() * types.length)];
    setTimeout(() => { setDemoLoading(false); setDemoResult(demoData[t]); }, 2200);
  };

  return (
    <div style={{ background: bg, color: fg, minHeight: "100vh" }}>
      {/* HERO */}
      <section style={{ position: "relative", overflow: "hidden", padding: "100px 0 80px", borderBottom: `1px solid ${border}` }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: `linear-gradient(${dark ? "rgba(118,185,0,0.04)" : "rgba(118,185,0,0.06)"} 1px,transparent 1px),linear-gradient(90deg,${dark ? "rgba(118,185,0,0.04)" : "rgba(118,185,0,0.06)"} 1px,transparent 1px)`, backgroundSize: "40px 40px" }} />
        <div style={{ position: "absolute", top: -200, right: -200, width: 600, height: 600, background: "radial-gradient(circle, rgba(118,185,0,0.06) 0%, transparent 70%)", pointerEvents: "none" }} />
        <div style={{ maxWidth: 1080, margin: "0 auto", padding: "0 32px", position: "relative", zIndex: 1 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(118,185,0,0.1)", border: "1px solid rgba(118,185,0,0.3)", padding: "5px 14px", marginBottom: 28 }}>
            <span style={{ width: 6, height: 6, background: "#76b900", borderRadius: 0 }} />
            <span style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 11, color: "#76b900", letterSpacing: ".1em" }}>AI-POWERED · REAL-TIME · VERIFIABLE</span>
          </div>
          <h1 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: "clamp(60px,8vw,110px)", fontWeight: 800, lineHeight: .9, letterSpacing: "-1px", textTransform: "uppercase", marginBottom: 28, color: fg }}>
            Stop<br /><span style={{ color: "#76b900" }}>Fake News</span><br /><span style={{ fontWeight: 300, color: muted }}>Before It Spreads.</span>
          </h1>
          <p style={{ fontSize: 18, color: muted, maxWidth: 520, lineHeight: 1.7, marginBottom: 44, fontWeight: 300 }}>
            VeritAI is the world's first real-time news credibility engine. Paste any URL, get a credibility score, fact-check breakdown, and source analysis in under 8 seconds.
          </p>

          {/* Hero Search Bar */}
          <div style={{ maxWidth: 680, background: card, border: `2px solid ${dark ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.15)"}`, padding: 6, display: "flex", gap: 0, marginBottom: 20, boxShadow: dark ? "0 0 40px rgba(118,185,0,0.08)" : "0 4px 24px rgba(0,0,0,0.08)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, flex: 1, padding: "10px 16px", background: dark ? "#111" : "#f4f4f0", border: `1px solid ${border}` }}>
              <span style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 13, color: "#76b900" }}>⌕</span>
              <input
                value={demoUrl}
                onChange={e => setDemoUrl(e.target.value)}
                onKeyDown={e => e.key === "Enter" && runHeroDemo()}
                placeholder="Paste any news URL — e.g. reuters.com/article/..."
                style={{ flex: 1, background: "transparent", border: "none", outline: "none", fontFamily: "'Share Tech Mono', monospace", fontSize: 13, color: fg }}
              />
            </div>
            <button onClick={runHeroDemo} disabled={demoLoading} style={{ background: demoLoading ? "#555" : "#76b900", color: "#000", border: "none", padding: "0 28px", fontFamily: "'Barlow Condensed', sans-serif", fontSize: 15, fontWeight: 800, cursor: demoLoading ? "not-allowed" : "pointer", textTransform: "uppercase", letterSpacing: 1, whiteSpace: "nowrap", transition: "background .2s" }}>
              {demoLoading ? "ANALYZING..." : "VERIFY NOW →"}
            </button>
          </div>
          <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
            <span style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 10, color: "#555", letterSpacing: ".08em" }}>TRY DEMOS:</span>
            {[["✓ High credibility", "#76b900"], ["⚠ Mixed bias", "#f5a623"], ["✗ Misinformation", "#e53935"]].map(([l, c]) => (
              <span key={l} onClick={runHeroDemo} style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 11, color: c, border: `1px solid ${c}30`, background: `${c}10`, padding: "4px 12px", cursor: "pointer" }}>{l}</span>
            ))}
          </div>

          {/* Inline demo result */}
          {(demoLoading || demoResult) && (
            <div style={{ marginTop: 28, maxWidth: 680, background: card, border: `1px solid ${border}`, padding: "20px 24px", animation: "fadeIn .3s ease" }}>
              {demoLoading && (
                <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                  <div style={{ width: 120, height: 2, background: dark ? "#1a1a1a" : "#e0e0e0", position: "relative", overflow: "hidden", flexShrink: 0 }}>
                    <div style={{ position: "absolute", left: "-100%", top: 0, bottom: 0, width: "100%", background: "#76b900", animation: "scanBar 1s ease-in-out infinite" }} />
                  </div>
                  <span style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 11, color: "#76b900", letterSpacing: ".08em" }}>RUNNING VERIFICATION PIPELINE...</span>
                </div>
              )}
              {!demoLoading && demoResult && (
                <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                  <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 48, fontWeight: 800, color: demoResult.gaugeColor, lineHeight: 1 }}>{demoResult.score}</div>
                  <div>
                    <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 16, fontWeight: 700, textTransform: "uppercase", color: demoResult.gaugeColor }}>{demoResult.label}</div>
                    <div style={{ fontSize: 12, color: muted, marginTop: 3 }}>{demoResult.source.name} · {demoResult.source.meta.split("·").slice(-1)[0].trim()}</div>
                  </div>
                  <div style={{ marginLeft: "auto" }}><Badge cls={demoResult.verdictClass}>{demoResult.verdict}</Badge></div>
                  <button onClick={() => onNavigate("analyzer")} style={{ background: "#76b900", color: "#000", border: "none", padding: "8px 18px", fontFamily: "'Barlow Condensed', sans-serif", fontSize: 12, fontWeight: 800, cursor: "pointer", textTransform: "uppercase", letterSpacing: 1, whiteSpace: "nowrap" }}>FULL REPORT →</button>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* SOCIAL PROOF TICKER */}
      <div style={{ background: "#76b900", padding: "9px 0", overflow: "hidden" }}>
        <div style={{ display: "flex", gap: 48, animation: "ticker 30s linear infinite", whiteSpace: "nowrap" }}>
          {[...Array(3)].flatMap(() => ["Reuters", "AP News", "PolitiFact", "Snopes", "FactCheck.org", "AFP", "BBC Verify", "First Draft", "Full Fact", "MBFC"]).map((s, i) => (
            <span key={i} style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 13, fontWeight: 700, color: "#000", letterSpacing: 1, textTransform: "uppercase", flexShrink: 0 }}>▸ {s}</span>
          ))}
        </div>
      </div>

      {/* STATS ROW */}
      <section style={{ borderBottom: `1px solid ${border}`, background: dark ? "#050505" : "#f0f0ec" }}>
        <div style={{ maxWidth: 1080, margin: "0 auto", padding: "0 32px", display: "grid", gridTemplateColumns: "repeat(4,1fr)" }}>
          {[
            { val: "2.4M+", label: "Articles Analyzed", color: "#76b900" },
            { val: "98.2%", label: "Accuracy Rate", color: "#00a8e0" },
            { val: "<8s", label: "Average Analysis Time", color: "#f5a623" },
            { val: "150+", label: "Fact-Check Sources", color: "#76b900" },
          ].map((s, i) => (
            <div key={i} style={{ padding: "36px 24px", borderRight: i < 3 ? `1px solid ${border}` : "none", textAlign: "center" }}>
              <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 46, fontWeight: 800, color: s.color, lineHeight: 1, marginBottom: 6 }}>{s.val}</div>
              <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 10, color: "#555", letterSpacing: ".1em", textTransform: "uppercase" }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* INTEGRATED TOOLS */}
      <section style={{ padding: "80px 0", borderBottom: `1px solid ${border}`, background: dark ? "#0a0a0a" : "#fafaf7" }}>
        <div style={{ maxWidth: 1080, margin: "0 auto", padding: "0 32px" }}>
          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 48 }}>
            <div>
              <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 11, color: "#76b900", letterSpacing: ".12em", marginBottom: 10 }}>// INTEGRATED TOOLS</div>
              <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: "clamp(32px,4vw,52px)", fontWeight: 800, textTransform: "uppercase", color: fg }}>Our <span style={{ color: "#76b900" }}>Specialized</span> Suite</div>
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 2, marginBottom: 2 }}>
            {[
              { id: "call-detection", name: "Call Detection", icon: "☎", desc: "Verify call transcripts & SMS authenticity", color: "#00a8e0" },
              { id: "camera-tampering", name: "Camera Tampering", icon: "📷", desc: "Detect manipulated video content", color: "#f5a623" },
              { id: "deepscan", name: "DeepScan v2", icon: "◼", desc: "Deep learning content analysis", color: "#76b900" },
              { id: "media-vault", name: "MediaVault", icon: "🔒", desc: "Secure media verification storage", color: "#a855f7" },
              { id: "truthlens", name: "TruthLens Complete", icon: "◉", desc: "Comprehensive truth verification", color: "#e53935" },
              { id: "truthlens-ext", name: "Browser Extension", icon: "⬡", desc: "Real-time web page verification", color: "#00a8e0" },
              { id: "truthlence", name: "TruthLence", icon: "✦", desc: "Multi-media analysis platform", color: "#f5a623" },
            ].map((tool, i) => (
              <div key={i} style={{ background: card, border: `1px solid ${border}`, padding: "24px 20px", cursor: "pointer", position: "relative", overflow: "hidden", transition: "all .2s" }}
                onClick={() => onNavigate(`features/${tool.id}`)}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = tool.color;
                  e.currentTarget.style.background = `${tool.color}06`;
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = border;
                  e.currentTarget.style.background = card;
                }}>
                <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: tool.color }} />
                <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 28, color: tool.color, marginBottom: 8 }}>{tool.icon}</div>
                <div style={{ fontFamily: "'Barlow Semi Condensed', sans-serif", fontSize: 14, fontWeight: 600, color: fg, marginBottom: 6, textTransform: "uppercase", letterSpacing: ".3px" }}>{tool.name}</div>
                <div style={{ fontSize: 12, color: muted, lineHeight: 1.5, fontWeight: 300, marginBottom: 14 }}>{tool.desc}</div>
                <button style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 11, color: tool.color, border: `1px solid ${tool.color}`, background: "transparent", padding: "6px 12px", cursor: "pointer", letterSpacing: ".05em", width: "100%" }}>LAUNCH TOOL →</button>
              </div>
            ))}</div>
        </div>
      </section>

      {/* FEATURE GRID */}
      <section style={{ padding: "80px 0", borderBottom: `1px solid ${border}` }}>
        <div style={{ maxWidth: 1080, margin: "0 auto", padding: "0 32px" }}>
          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 48 }}>
            <div>
              <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 11, color: "#76b900", letterSpacing: ".12em", marginBottom: 10 }}>// CAPABILITIES</div>
              <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: "clamp(32px,4vw,52px)", fontWeight: 800, textTransform: "uppercase", color: fg }}>What VeritAI <span style={{ color: "#76b900" }}>Does</span></div>
            </div>
            <button onClick={() => onNavigate("features")} style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 11, color: "#76b900", border: "1px solid #76b900", background: "transparent", padding: "10px 20px", cursor: "pointer", letterSpacing: ".06em" }}>EXPLORE ALL FEATURES →</button>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 2 }}>
            {[
              { icon: "◎", title: "Real-Time Fact Checking", desc: "Cross-references claims against 150+ verified databases including PolitiFact, Snopes, AFP, and Reuters in under 3 seconds.", color: "#76b900", badge: "CORE" },
              { icon: "◈", title: "Source Credibility Score", desc: "Rates every domain on reliability, bias, editorial standards, and historical accuracy using our proprietary MBFC-calibrated model.", color: "#00a8e0", badge: "CORE" },
              { icon: "⚡", title: "Bias Detection Engine", desc: "NLP sentiment analysis identifies emotional language, political slant, and clickbait patterns that signal low-credibility reporting.", color: "#f5a623", badge: "AI" },
              { icon: "⬢", title: "Deepfake & Media Forensics", desc: "Reverse image search, metadata extraction, and AI-generated media detection for photos, video, and audio content.", color: "#a855f7", badge: "AI" },
              { icon: "≡", title: "Batch & API Access", desc: "Analyze hundreds of articles programmatically. RESTful JSON API with webhook support for CMS and newsroom integrations.", color: "#76b900", badge: "DEV" },
              { icon: "★", title: "Historical Archive", desc: "Access 2.4 million past analyses. Track credibility trends, compare sources over time, and export audit trails.", color: "#00a8e0", badge: "PRO" },
            ].map((f, i) => (
              <div key={i} style={{ background: card, border: `1px solid ${border}`, padding: "28px 24px", position: "relative", overflow: "hidden", cursor: "pointer", transition: "border-color .2s" }}
                onMouseEnter={e => e.currentTarget.style.borderColor = f.color}
                onMouseLeave={e => e.currentTarget.style.borderColor = border}>
                <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: f.color }} />
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
                  <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 22, color: f.color }}>{f.icon}</div>
                  <span style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 9, color: f.color, border: `1px solid ${f.color}40`, background: `${f.color}10`, padding: "2px 7px", letterSpacing: ".08em" }}>{f.badge}</span>
                </div>
                <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 18, fontWeight: 700, textTransform: "uppercase", letterSpacing: ".5px", marginBottom: 10, color: fg }}>{f.title}</div>
                <div style={{ fontSize: 13, color: muted, lineHeight: 1.65, fontWeight: 300 }}>{f.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section style={{ padding: "80px 0", background: dark ? "#050505" : "#f0f0ec", borderBottom: `1px solid ${border}` }}>
        <div style={{ maxWidth: 1080, margin: "0 auto", padding: "0 32px" }}>
          <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 11, color: "#76b900", letterSpacing: ".12em", marginBottom: 10 }}>// HOW IT WORKS</div>
          <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: "clamp(32px,4vw,52px)", fontWeight: 800, textTransform: "uppercase", color: fg, marginBottom: 48 }}>Five Stages. <span style={{ color: "#76b900" }}>Eight Seconds.</span></div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: 0 }}>
            {[
              { n: "01", name: "Extract", desc: "newspaper3k strips ads and boilerplate, returning clean article text." },
              { n: "02", name: "Analyze", desc: "spaCy NER + TextBlob + BERT classify claims, sentiment, and clickbait." },
              { n: "03", name: "Verify", desc: "Top claims hit Google FCTAPI and Wikipedia for fact-check matches." },
              { n: "04", name: "Score", desc: "Weighted formula computes final 0–100 credibility score." },
              { n: "05", name: "Report", desc: "Full breakdown delivered: score, claims, source profile, alerts." },
            ].map((s, i) => (
              <div key={i} style={{ background: card, border: `1px solid ${border}`, borderLeft: i > 0 ? "none" : `1px solid ${border}`, padding: "28px 20px", position: "relative" }}>
                <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: i === 4 ? "#76b900" : `rgba(118,185,0,${0.2 + i * 0.18})` }} />
                <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 38, fontWeight: 800, color: dark ? "#1a1a1a" : "#ddd", lineHeight: 1, marginBottom: 12 }}>{s.n}</div>
                <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 16, fontWeight: 700, textTransform: "uppercase", letterSpacing: ".5px", marginBottom: 8, color: fg }}>{s.name}</div>
                <div style={{ fontSize: 12, color: muted, lineHeight: 1.6, fontWeight: 300 }}>{s.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section style={{ padding: "80px 0", borderBottom: `1px solid ${border}` }}>
        <div style={{ maxWidth: 1080, margin: "0 auto", padding: "0 32px" }}>
          <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 11, color: "#76b900", letterSpacing: ".12em", marginBottom: 10 }}>// EXPERT VALIDATION</div>
          <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: "clamp(32px,4vw,52px)", fontWeight: 800, textTransform: "uppercase", color: fg, marginBottom: 48 }}>Trusted by <span style={{ color: "#76b900" }}>Journalists</span></div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 2, marginBottom: 2 }}>
            {[
              { quote: "VeritAI cut our fact-checking workflow from 45 minutes to under 3 minutes per article. The source reliability scores are remarkably well-calibrated against our internal standards.", name: "Dr. Sarah Chen", title: "Head of Verification, Reuters Institute", org: "Reuters Institute for Journalism", score: "94/100 avg credibility hit rate" },
              { quote: "I've tested every misinformation detection tool on the market. VeritAI is the only one that surfaces the *right* claims for checking rather than flagging everything.", name: "Marcus Okonkwo", title: "Digital Forensics Specialist, AP", org: "Associated Press", score: "97% claim extraction accuracy" },
              { quote: "The bias detection engine caught lean in sources I'd considered neutral for years. Uncomfortable, but exactly the kind of challenge newsrooms need from their tools.", name: "Prof. Elena Vasquez", title: "Media Credibility Researcher, Columbia", org: "Columbia Journalism School", score: "98.2% model accuracy (2024 audit)" },
            ].map((t, i) => (
              <div key={i} style={{ background: card, border: `1px solid ${border}`, padding: "28px 24px", position: "relative" }}>
                <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: "#76b900" }} />
                <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 64, fontWeight: 800, color: dark ? "#1a1a1a" : "#e8e8e8", lineHeight: .8, marginBottom: 8, userSelect: "none" }}>"</div>
                <div style={{ fontSize: 14, color: muted, lineHeight: 1.7, marginBottom: 20, fontWeight: 300, fontStyle: "italic" }}>{t.quote}</div>
                <div style={{ display: "flex", alignItems: "center", gap: 12, paddingTop: 16, borderTop: `1px solid ${border}` }}>
                  <div style={{ width: 38, height: 38, background: "rgba(118,185,0,.15)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Barlow Condensed', sans-serif", fontSize: 13, fontWeight: 800, color: "#76b900", flexShrink: 0 }}>{t.name.split(" ").map(n => n[0]).join("").slice(0, 2)}</div>
                  <div>
                    <div style={{ fontFamily: "'Barlow Semi Condensed', sans-serif", fontSize: 13, fontWeight: 600, color: fg }}>{t.name}</div>
                    <div style={{ fontSize: 11, color: "#555", marginTop: 1 }}>{t.title}</div>
                  </div>
                </div>
                <div style={{ marginTop: 14, fontFamily: "'Share Tech Mono', monospace", fontSize: 10, color: "#76b900", letterSpacing: ".06em" }}>✓ {t.score}</div>
              </div>
            ))}
          </div>
          {/* Social proof logos */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(6,1fr)", gap: 2, marginTop: 2 }}>
            {["REUTERS", "AP NEWS", "BBC VERIFY", "POLITIFACT", "FIRST DRAFT", "FULL FACT"].map((org, i) => (
              <div key={i} style={{ background: card, border: `1px solid ${border}`, padding: "16px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 13, fontWeight: 700, color: "#555", letterSpacing: ".5px", textTransform: "uppercase" }}>{org}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ABOUT SECTION */}
      <section style={{ padding: "80px 0", background: dark ? "#050505" : "#f0f0ec", borderBottom: `1px solid ${border}` }}>
        <div style={{ maxWidth: 1080, margin: "0 auto", padding: "0 32px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 64, alignItems: "center" }}>
            <div>
              <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 11, color: "#76b900", letterSpacing: ".12em", marginBottom: 10 }}>// ABOUT VERITAI</div>
              <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: "clamp(32px,4vw,52px)", fontWeight: 800, textTransform: "uppercase", color: fg, lineHeight: .95, marginBottom: 24 }}>
                Built for the<br /><span style={{ color: "#76b900" }}>Information War.</span>
              </div>
              <p style={{ fontSize: 15, color: muted, lineHeight: 1.75, marginBottom: 20, fontWeight: 300 }}>
                VeritAI was built in 24 hours at an AI hackathon by a team of journalists, NLP researchers, and software engineers who believe that the spread of misinformation is the defining challenge of our era.
              </p>
              <p style={{ fontSize: 15, color: muted, lineHeight: 1.75, marginBottom: 32, fontWeight: 300 }}>
                We combine state-of-the-art language models with battle-tested fact-checking databases to give every journalist, researcher, and citizen the tools that only major newsrooms could afford — until now.
              </p>
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                <button onClick={() => onNavigate("docs")} style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 14, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, color: "#000", background: "#76b900", border: "none", padding: "12px 24px", cursor: "pointer" }}>READ THE DOCS</button>
                <button onClick={() => onNavigate("api")} style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 14, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, color: "#76b900", background: "transparent", border: "1px solid #76b900", padding: "12px 24px", cursor: "pointer" }}>EXPLORE API</button>
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}>
              {[
                { val: "24hrs", label: "Hackathon Build", color: "#76b900" },
                { val: "FastAPI", label: "Backend Framework", color: "#00a8e0" },
                { val: "spaCy", label: "NLP Engine", color: "#f5a623" },
                { val: "BERT", label: "Clickbait Model", color: "#76b900" },
                { val: "150+", label: "Source Partners", color: "#a855f7" },
                { val: "v1.0", label: "Current Version", color: "#00a8e0" },
              ].map((s, i) => (
                <div key={i} style={{ background: card, border: `1px solid ${border}`, padding: "20px 18px" }}>
                  <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 28, fontWeight: 800, color: s.color, lineHeight: 1, marginBottom: 4 }}>{s.val}</div>
                  <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 10, color: "#555", letterSpacing: ".08em", textTransform: "uppercase" }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: "80px 0", borderBottom: `1px solid ${border}` }}>
        <div style={{ maxWidth: 1080, margin: "0 auto", padding: "0 32px", textAlign: "center" }}>
          <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: "clamp(36px,5vw,68px)", fontWeight: 800, textTransform: "uppercase", color: fg, marginBottom: 16 }}>
            Start Verifying <span style={{ color: "#76b900" }}>Now.</span>
          </div>
          <p style={{ fontSize: 16, color: muted, marginBottom: 36, fontWeight: 300 }}>No setup. No API key required for the demo. Just paste a URL.</p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <button onClick={() => onNavigate("analyzer")} style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 16, fontWeight: 800, textTransform: "uppercase", letterSpacing: 1, color: "#000", background: "#76b900", border: "none", padding: "14px 36px", cursor: "pointer" }}>OPEN ANALYZER →</button>
            <button onClick={() => onNavigate("login")} style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 16, fontWeight: 800, textTransform: "uppercase", letterSpacing: 1, color: "#76b900", background: "transparent", border: "1px solid #76b900", padding: "14px 36px", cursor: "pointer" }}>CREATE ACCOUNT</button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ padding: "28px 0", background: dark ? "#050505" : "#e8e8e4" }}>
        <div style={{ maxWidth: 1080, margin: "0 auto", padding: "0 32px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
          <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 11, color: "#555" }}>© VERITAI · AI HACKATHON 2024 · BUILT IN 24 HRS</div>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {["FASTAPI", "HUGGINGFACE", "SPACY", "GOOGLE FACT CHECK", "MBFC"].map(t => (
              <span key={t} style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 10, color: "#555", border: `1px solid ${border}`, padding: "3px 8px" }}>{t}</span>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}

/* ═══════════════════════════════════════
   LOGIN PAGE — FLIP CARD AUTH
═══════════════════════════════════════ */
function LoginPage({ onNavigate }: { onNavigate: (dest: string) => void }) {
  const { login, register, loginWithGoogle, user } = useAuth();
  const { dark } = useContext(ThemeCtx);
  const bg = dark ? "#000" : "#f8f8f5";
  const fg = dark ? "#fff" : "#0a0a0a";
  const cardBg = dark ? "#0a0a0a" : "#fff";
  const inputBg = dark ? "#111" : "#f4f4f0";
  const border = dark ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.12)";
  const mutedBorder = dark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.07)";

  const [flipped, setFlipped] = useState(false);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [regName, setRegName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regConfirm, setRegConfirm] = useState("");
  const [regLoading, setRegLoading] = useState(false);
  const [regError, setRegError] = useState("");
  const [oauthProvider, setOauthProvider] = useState<string | null>(null);
  const [tokenPreview, setTokenPreview] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Redirect if already logged in
  useEffect(() => {
    if (user) onNavigate("analyzer");
  }, [user]);

  const inputStyle: React.CSSProperties = {
    width: "100%", background: inputBg, border: `1px solid ${border}`,
    padding: "11px 14px", fontFamily: "'Share Tech Mono', monospace",
    fontSize: 12, color: fg, outline: "none", marginBottom: 10,
  };

  const handleLogin = async () => {
    setLoginError("");
    if (!loginEmail.trim()) { setLoginError("Email is required"); return; }
    if (!loginPassword) { setLoginError("Password is required"); return; }
    setLoginLoading(true);
    try {
      await login(loginEmail.trim(), loginPassword);
      onNavigate("analyzer");
    } catch (e: any) {
      setLoginError(e.message || "Login failed");
    } finally { setLoginLoading(false); }
  };

  const handleRegister = async () => {
    setRegError("");
    if (!regName.trim()) { setRegError("Full name is required"); return; }
    if (!regEmail.trim()) { setRegError("Email is required"); return; }
    if (!regPassword) { setRegError("Password is required"); return; }
    if (regPassword !== regConfirm) { setRegError("Passwords do not match"); return; }
    setRegLoading(true);
    try {
      await register(regEmail.trim(), regPassword, regName.trim());
      setSuccessMsg("Account created! Check your email to confirm, then sign in.");
      setFlipped(false);
    } catch (e: any) { setRegError(e.message || "Registration failed"); }
    finally { setRegLoading(false); }
  };

  const handleGoogle = async () => {
    setOauthProvider("google"); setLoginError("");
    try {
      await loginWithGoogle();
    } catch (e: any) { setLoginError("Google sign-in failed. Try again."); }
    finally { setOauthProvider(null); }
  };

  const handleGithub = async () => {
    setOauthProvider("github"); setLoginError("GitHub login is not available. Please use Google or email.");
    setOauthProvider(null);
  };

  return (
    <div style={{ minHeight: "100vh", background: bg, display: "flex", alignItems: "center", justifyContent: "center", padding: "32px 16px", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: 0, backgroundImage: `linear-gradient(${dark ? "rgba(118,185,0,0.03)" : "rgba(118,185,0,0.05)"} 1px,transparent 1px),linear-gradient(90deg,${dark ? "rgba(118,185,0,0.03)" : "rgba(118,185,0,0.05)"} 1px,transparent 1px)`, backgroundSize: "40px 40px", pointerEvents: "none" }} />
      <div style={{ position: "relative", zIndex: 1, width: "100%", maxWidth: 460 }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 10, cursor: "pointer" }} onClick={() => onNavigate("home")}>
            <div style={{ width: 34, height: 34, background: "#76b900", clipPath: "polygon(0 0,100% 0,100% 70%,70% 100%,0 100%)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Barlow Condensed', sans-serif", fontSize: 13, fontWeight: 800, color: "#000" }}>V</div>
            <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 24, fontWeight: 800, letterSpacing: 1, textTransform: "uppercase", color: fg }}>Verit<span style={{ color: "#76b900" }}>AI</span></div>
          </div>
          <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 10, color: "#555", letterSpacing: ".1em", marginTop: 6 }}>// SIGN IN TO ACCESS THE PLATFORM</div>
        </div>

        {/* Flip Card */}
        <div style={{ perspective: "1200px" }}>
          <div style={{ position: "relative", width: "100%", minHeight: 560, transformStyle: "preserve-3d", transition: "transform 0.65s cubic-bezier(.4,0,.2,1)", transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)" }}>

            {/* ── FRONT: SIGN IN ── */}
            <div style={{ position: "absolute", inset: 0, backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden", background: cardBg, border: `1px solid ${border}`, padding: "32px", boxShadow: dark ? "0 0 80px rgba(0,0,0,.7)" : "0 8px 48px rgba(0,0,0,.1)" }}>
              <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: "linear-gradient(90deg,#76b900,#00a8e0)" }} />
              <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 28, fontWeight: 800, textTransform: "uppercase", letterSpacing: ".5px", color: fg, marginBottom: 2 }}>Welcome Back</div>
              <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 10, color: "#555", letterSpacing: ".08em", marginBottom: 22 }}>// JWT · OAUTH · SECURE SESSION</div>

              {/* Google OAuth Button */}
              <button onClick={handleGoogle} disabled={!!oauthProvider || loginLoading}
                style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 10, background: oauthProvider === "google" ? "rgba(66,133,244,.08)" : dark ? "#111" : "#fff", border: `1px solid ${oauthProvider === "google" ? "#4285f4" : border}`, padding: "11px 16px", cursor: oauthProvider ? "not-allowed" : "pointer", marginBottom: 8, transition: "all .2s", position: "relative", overflow: "hidden" }}>
                <svg width="18" height="18" viewBox="0 0 18 18" style={{ flexShrink: 0 }}>
                  <path d="M17.64 9.205c0-.639-.057-1.252-.164-1.841H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615Z" fill="#4285F4"/>
                  <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18Z" fill="#34A853"/>
                  <path d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332Z" fill="#FBBC05"/>
                  <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58Z" fill="#EA4335"/>
                </svg>
                <span style={{ fontFamily: "'Barlow Semi Condensed', sans-serif", fontSize: 14, fontWeight: 600, color: oauthProvider === "google" ? "#4285f4" : fg }}>
                  {oauthProvider === "google" ? "Connecting to Google..." : "Continue with Google"}
                </span>
                {oauthProvider === "google" && <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 2, background: "#4285f4", animation: "scanBar 1s ease-in-out infinite" }} />}
              </button>

              {/* GitHub OAuth Button */}
              <button onClick={handleGithub} disabled={!!oauthProvider || loginLoading}
                style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 10, background: oauthProvider === "github" ? "rgba(36,41,47,.1)" : dark ? "#111" : "#f6f8fa", border: `1px solid ${oauthProvider === "github" ? "#888" : border}`, padding: "11px 16px", cursor: oauthProvider ? "not-allowed" : "pointer", marginBottom: 20, transition: "all .2s", position: "relative", overflow: "hidden" }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill={dark ? "#fff" : "#24292f"} style={{ flexShrink: 0 }}>
                  <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12Z"/>
                </svg>
                <span style={{ fontFamily: "'Barlow Semi Condensed', sans-serif", fontSize: 14, fontWeight: 600, color: oauthProvider === "github" ? "#888" : fg }}>
                  {oauthProvider === "github" ? "Connecting to GitHub..." : "Continue with GitHub"}
                </span>
                {oauthProvider === "github" && <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 2, background: "#888", animation: "scanBar 1s ease-in-out infinite" }} />}
              </button>

              {/* Divider */}
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 18 }}>
                <div style={{ flex: 1, height: 1, background: mutedBorder }} />
                <span style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 9, color: "#555", letterSpacing: ".1em" }}>OR SIGN IN WITH EMAIL</span>
                <div style={{ flex: 1, height: 1, background: mutedBorder }} />
              </div>

              <div style={{ marginBottom: 6 }}>
                <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 9, color: "#555", letterSpacing: ".08em", marginBottom: 5 }}>EMAIL</div>
                <input value={loginEmail} onChange={e => { setLoginEmail(e.target.value); setLoginError(""); }} onKeyDown={e => e.key === "Enter" && handleLogin()} placeholder="your@email.com" type="email" autoComplete="email" style={inputStyle} />
              </div>
              <div style={{ marginBottom: 14 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                  <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 9, color: "#555", letterSpacing: ".08em" }}>PASSWORD</div>
                  <span style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 9, color: "#76b900", cursor: "pointer" }}>Forgot?</span>
                </div>
                <input value={loginPassword} onChange={e => { setLoginPassword(e.target.value); setLoginError(""); }} onKeyDown={e => e.key === "Enter" && handleLogin()} type="password" placeholder="••••••••" autoComplete="current-password" style={inputStyle} />
              </div>

              {loginError && (
                <div style={{ background: "rgba(229,57,53,.1)", border: "1px solid rgba(229,57,53,.3)", borderLeft: "3px solid #e53935", padding: "10px 14px", fontFamily: "'Share Tech Mono', monospace", fontSize: 11, color: "#e53935", marginBottom: 12, letterSpacing: ".04em", animation: "fadeIn .2s ease" }}>
                  ✗ {loginError}
                </div>
              )}

              <button onClick={handleLogin} disabled={loginLoading || !!oauthProvider}
                style={{ width: "100%", background: loginLoading ? "#2a4a00" : "#76b900", color: "#000", border: "none", padding: "13px", fontFamily: "'Barlow Condensed', sans-serif", fontSize: 15, fontWeight: 800, cursor: loginLoading ? "not-allowed" : "pointer", textTransform: "uppercase", letterSpacing: 1, marginBottom: 14, transition: "background .2s", position: "relative", overflow: "hidden" }}>
                {loginLoading ? "AUTHENTICATING..." : "SIGN IN →"}
                {loginLoading && <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 2, background: "rgba(0,0,0,.2)", animation: "scanBar 1s ease-in-out infinite" }} />}
              </button>

              {successMsg && (
                <div style={{ padding: "10px 12px", background: "rgba(118,185,0,.07)", border: "1px solid rgba(118,185,0,.2)", marginBottom: 12 }}>
                  <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 11, color: "#76b900", letterSpacing: ".04em" }}>✓ {successMsg}</div>
                </div>
              )}

              <div style={{ textAlign: "center", fontFamily: "'Barlow Semi Condensed', sans-serif", fontSize: 13, color: "#555" }}>
                No account? <span onClick={() => { setFlipped(true); setLoginError(""); }} style={{ color: "#76b900", cursor: "pointer", fontWeight: 600 }}>Create one →</span>
              </div>
            </div>

            {/* ── BACK: REGISTER ── */}
            <div style={{ position: "absolute", inset: 0, backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden", transform: "rotateY(180deg)", background: cardBg, border: `1px solid ${border}`, padding: "32px", boxShadow: dark ? "0 0 80px rgba(0,0,0,.7)" : "0 8px 48px rgba(0,0,0,.1)" }}>
              <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: "linear-gradient(90deg,#00a8e0,#76b900)" }} />
              <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 28, fontWeight: 800, textTransform: "uppercase", letterSpacing: ".5px", color: fg, marginBottom: 2 }}>Create Account</div>
              <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 10, color: "#555", letterSpacing: ".08em", marginBottom: 22 }}>// NEW USER REGISTRATION</div>

              {[
                { label: "FULL NAME", val: regName, set: v => { setRegName(v); setRegError(""); }, ph: "Jane Smith", type: "text", ac: "name" },
                { label: "EMAIL ADDRESS", val: regEmail, set: v => { setRegEmail(v); setRegError(""); }, ph: "jane@example.com", type: "email", ac: "email" },
                { label: "PASSWORD (min 6 chars)", val: regPassword, set: v => { setRegPassword(v); setRegError(""); }, ph: "••••••••", type: "password", ac: "new-password" },
                { label: "CONFIRM PASSWORD", val: regConfirm, set: v => { setRegConfirm(v); setRegError(""); }, ph: "••••••••", type: "password", ac: "new-password" },
              ].map(({ label, val, set, ph, type, ac }) => (
                <div key={label} style={{ marginBottom: 8 }}>
                  <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 9, color: "#555", letterSpacing: ".08em", marginBottom: 5 }}>{label}</div>
                  <input value={val} onChange={e => set(e.target.value)} onKeyDown={e => e.key === "Enter" && handleRegister()} type={type} placeholder={ph} autoComplete={ac} style={inputStyle} />
                </div>
              ))}

              {regError && (
                <div style={{ background: "rgba(229,57,53,.1)", border: "1px solid rgba(229,57,53,.3)", borderLeft: "3px solid #e53935", padding: "10px 14px", fontFamily: "'Share Tech Mono', monospace", fontSize: 11, color: "#e53935", marginBottom: 12, letterSpacing: ".04em", animation: "fadeIn .2s ease" }}>
                  ✗ {regError}
                </div>
              )}

              <button onClick={handleRegister} disabled={regLoading}
                style={{ width: "100%", background: regLoading ? "#006080" : "#00a8e0", color: "#000", border: "none", padding: "13px", fontFamily: "'Barlow Condensed', sans-serif", fontSize: 15, fontWeight: 800, cursor: regLoading ? "not-allowed" : "pointer", textTransform: "uppercase", letterSpacing: 1, marginBottom: 16, transition: "background .2s" }}>
                {regLoading ? "CREATING ACCOUNT..." : "CREATE ACCOUNT →"}
              </button>

              <div style={{ textAlign: "center", fontFamily: "'Barlow Semi Condensed', sans-serif", fontSize: 13, color: "#555" }}>
                Already registered? <span onClick={() => { setFlipped(false); setRegError(""); }} style={{ color: "#76b900", cursor: "pointer", fontWeight: 600 }}>← Sign in</span>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════
   404 PAGE — FAKE NEWS THEME
═══════════════════════════════════════ */
function NotFoundPage({ onNavigate }) {
  const { dark } = useContext(ThemeCtx);
  const bg = dark ? "#000" : "#f8f8f5";
  const fg = dark ? "#fff" : "#0a0a0a";
  const [tick, setTick] = useState(0);
  useEffect(() => { const iv = setInterval(() => setTick(t => t + 1), 800); return () => clearInterval(iv); }, []);

  const headlines = [
    "BREAKING: PAGE EXISTS, INSIDERS SAY OTHERWISE",
    "EXCLUSIVE: URL SPOTTED FLEEING TO UNDISCLOSED LOCATION",
    "FACT CHECK: THIS PAGE? DISPUTED BY 3 SOURCES",
    "ANONYMOUS TIP: 404 ERROR IS ACTUALLY A COVER-UP",
    "SHOCKING: THE CONTENT WAS THERE ALL ALONG (DISPUTED)",
  ];

  return (
    <div style={{ minHeight: "100vh", background: bg, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 32, textAlign: "center", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: 0, backgroundImage: `linear-gradient(${dark ? "rgba(229,57,53,0.03)" : "rgba(229,57,53,0.05)"} 1px,transparent 1px),linear-gradient(90deg,${dark ? "rgba(229,57,53,0.03)" : "rgba(229,57,53,0.05)"} 1px,transparent 1px)`, backgroundSize: "40px 40px" }} />
      <div style={{ position: "relative", zIndex: 1, maxWidth: 680 }}>
        {/* Fake breaking news banner */}
        <div style={{ background: "#e53935", padding: "6px 20px", display: "inline-flex", alignItems: "center", gap: 10, marginBottom: 32 }}>
          <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 13, fontWeight: 800, color: "#fff", letterSpacing: 2 }}>⚡ BREAKING NEWS</span>
          <span style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 11, color: "rgba(255,255,255,0.7)" }}>{new Date().toLocaleTimeString()}</span>
        </div>

        <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: "clamp(100px,20vw,180px)", fontWeight: 800, lineHeight: .85, color: "#e53935", letterSpacing: "-4px", marginBottom: 8 }}>404</div>
        <Badge cls="red" style={{ marginBottom: 24, fontSize: 11 }}>MISINFO RISK — PAGE NOT FOUND</Badge>

        <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: "clamp(22px,3vw,36px)", fontWeight: 800, textTransform: "uppercase", color: fg, marginBottom: 12, animation: "fadeIn .4s ease" }} key={tick}>
          {headlines[tick % headlines.length]}
        </div>

        <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 12, color: "#555", letterSpacing: ".06em", lineHeight: 2, marginBottom: 32 }}>
          // PAGE CREDIBILITY SCORE: 0/100<br />
          // VERDICT: URL COULD NOT BE EXTRACTED<br />
          // STATUS: NO CONTENT FOUND AT THIS ADDRESS
        </div>

        {/* Fake fact check */}
        <div style={{ background: dark ? "#0a0a0a" : "#fff", border: "1px solid rgba(229,57,53,.3)", padding: "20px 24px", marginBottom: 32, textAlign: "left" }}>
          <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 10, color: "#e53935", marginBottom: 10, letterSpacing: ".08em" }}>// AUTOMATED FACT CHECK RESULT</div>
          {[
            { v: "DISPUTED", c: "red", t: "The page you requested actually exists at this URL." },
            { v: "DISPUTED", c: "red", t: "The content was temporarily moved to a different location." },
            { v: "VERIFIED", c: "green", t: "The URL /this-page is definitely not valid in our system." },
          ].map((c, i) => (
            <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start", padding: "8px 0", borderBottom: i < 2 ? `1px solid ${dark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"}` : "none" }}>
              <span style={{ ...getBadgeStyle(c.c), padding: "2px 7px", fontFamily: "'Share Tech Mono', monospace", fontSize: 9, letterSpacing: ".1em", textTransform: "uppercase", flexShrink: 0, marginTop: 2 }}>{c.v}</span>
              <div style={{ fontSize: 13, color: dark ? "#a0a0a0" : "#555", fontWeight: 300 }}>{c.t}</div>
            </div>
          ))}
        </div>

        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          <button onClick={() => onNavigate("home")} style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 14, fontWeight: 800, textTransform: "uppercase", letterSpacing: 1, color: "#000", background: "#76b900", border: "none", padding: "12px 28px", cursor: "pointer" }}>← BACK TO HOMEPAGE</button>
          <button onClick={() => onNavigate("analyzer")} style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 14, fontWeight: 800, textTransform: "uppercase", letterSpacing: 1, color: "#76b900", background: "transparent", border: "1px solid #76b900", padding: "12px 28px", cursor: "pointer" }}>OPEN ANALYZER</button>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════
   SETTINGS PAGE
═══════════════════════════════════════ */
function SettingsPage({ onNavigate }: { onNavigate: (dest: string) => void }) {
  const { dark, toggle } = useContext(ThemeCtx);
  const { user, logout } = useAuth();
  const bg = dark ? "#000" : "#f8f8f5";
  const fg = dark ? "#fff" : "#0a0a0a";
  const muted = dark ? "#a0a0a0" : "#555";
  const card = dark ? "#0a0a0a" : "#fff";
  const border = dark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.1)";

  const [notif, setNotif] = useState({ email: true, weekly: false, alerts: true });
  const [apiKey] = useState("vrt_" + Math.random().toString(36).slice(2, 18));
  const [saved, setSaved] = useState(false);

  const save = () => { setSaved(true); setTimeout(() => setSaved(false), 2000); };

  const ToggleSwitch = ({ on, onChange }) => (
    <div onClick={onChange} style={{ width: 44, height: 24, background: on ? "#76b900" : dark ? "#333" : "#ccc", borderRadius: 0, position: "relative", cursor: "pointer", flexShrink: 0, transition: "background .2s" }}>
      <div style={{ position: "absolute", top: 4, left: on ? 22 : 4, width: 16, height: 16, background: "#fff", transition: "left .2s" }} />
    </div>
  );

  return (
    <div style={{ background: bg, color: fg, minHeight: "100vh" }}>
      <div style={{ maxWidth: 760, margin: "0 auto", padding: "48px 32px" }}>
        <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 11, color: "#76b900", letterSpacing: ".14em", marginBottom: 10 }}>// USER PREFERENCES</div>
        <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 48, fontWeight: 800, textTransform: "uppercase", marginBottom: 36, color: fg }}>Settings</div>

        {/* Profile Card */}
        {user && (
          <div style={{ background: card, border: `1px solid ${border}`, padding: "24px", marginBottom: 2, position: "relative" }}>
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: "#76b900" }} />
            <CardLabel>Profile</CardLabel>
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <div style={{ width: 52, height: 52, background: "rgba(118,185,0,.15)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Barlow Condensed', sans-serif", fontSize: 18, fontWeight: 800, color: "#76b900" }}>{user.avatar}</div>
              <div>
                <div style={{ fontFamily: "'Barlow Semi Condensed', sans-serif", fontSize: 16, fontWeight: 600, color: fg }}>{user.name}</div>
                <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 11, color: "#555", marginTop: 2 }}>{user.email}</div>
              </div>
              <div style={{ marginLeft: "auto" }}><Badge cls="green">{user.role}</Badge></div>
            </div>
          </div>
        )}

        {/* Appearance */}
        <div style={{ background: card, border: `1px solid ${border}`, borderTop: "none", padding: "24px", marginBottom: 2 }}>
          <CardLabel>Appearance</CardLabel>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 0", borderBottom: `1px solid ${border}` }}>
            <div>
              <div style={{ fontFamily: "'Barlow Semi Condensed', sans-serif", fontSize: 14, fontWeight: 600, color: fg }}>Dark Mode</div>
              <div style={{ fontSize: 12, color: "#555", marginTop: 2 }}>Use dark theme across all pages</div>
            </div>
            <ToggleSwitch on={dark} onChange={toggle} />
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12, paddingTop: 16 }}>
            <div style={{ fontFamily: "'Barlow Semi Condensed', sans-serif", fontSize: 14, color: fg, fontWeight: 600, marginRight: 8 }}>Theme Preview:</div>
            {[["Dark", "#000", "#fff"], ["Light", "#f8f8f5", "#0a0a0a"], ["High Contrast", "#000", "#76b900"]].map(([n, b, t]) => (
              <div key={n} style={{ width: 48, height: 32, background: b, border: `2px solid ${b === (dark ? "#000" : "#f8f8f5") ? "#76b900" : border}`, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
                <span style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 8, color: t }}>Aa</span>
              </div>
            ))}
          </div>
        </div>

        {/* Notifications */}
        <div style={{ background: card, border: `1px solid ${border}`, borderTop: "none", padding: "24px", marginBottom: 2 }}>
          <CardLabel>Notifications</CardLabel>
          {[
            { key: "email", label: "Email alerts", desc: "Receive analysis results by email" },
            { key: "weekly", label: "Weekly digest", desc: "Summary of analyses every Monday" },
            { key: "alerts", label: "Misinformation alerts", desc: "Get notified when analyzed content scores below 30" },
          ].map(({ key, label, desc }) => (
            <div key={key} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 0", borderBottom: `1px solid ${border}` }}>
              <div>
                <div style={{ fontFamily: "'Barlow Semi Condensed', sans-serif", fontSize: 14, fontWeight: 600, color: fg }}>{label}</div>
                <div style={{ fontSize: 12, color: "#555", marginTop: 2 }}>{desc}</div>
              </div>
              <ToggleSwitch on={notif[key]} onChange={() => setNotif(n => ({ ...n, [key]: !n[key] }))} />
            </div>
          ))}
        </div>

        {/* API Key */}
        <div style={{ background: card, border: `1px solid ${border}`, borderTop: "none", padding: "24px", marginBottom: 2 }}>
          <CardLabel>API Access</CardLabel>
          <div style={{ display: "flex", gap: 0, alignItems: "center" }}>
            <div style={{ flex: 1, background: dark ? "#111" : "#f4f4f0", border: `1px solid ${border}`, padding: "11px 14px", fontFamily: "'Share Tech Mono', monospace", fontSize: 12, color: "#555", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{apiKey}</div>
            <button onClick={() => navigator.clipboard?.writeText(apiKey)} style={{ background: "#76b900", color: "#000", border: "none", padding: "11px 18px", fontFamily: "'Share Tech Mono', monospace", fontSize: 11, cursor: "pointer", letterSpacing: ".06em" }}>COPY</button>
          </div>
          <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 10, color: "#555", marginTop: 8, letterSpacing: ".05em" }}>// Rate limit: 100 requests/day · 10 requests/minute</div>
        </div>

        {/* Danger Zone */}
        <div style={{ background: "rgba(229,57,53,.05)", border: "1px solid rgba(229,57,53,.2)", borderTop: "none", padding: "24px", marginBottom: 24 }}>
          <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 10, letterSpacing: ".14em", textTransform: "uppercase", color: "#e53935", marginBottom: 16, paddingBottom: 12, borderBottom: "1px solid rgba(229,57,53,.15)", display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ color: "#e53935" }}>//</span>Danger Zone
          </div>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <button onClick={() => { logout(); onNavigate("home"); }} style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 13, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, color: "#e53935", background: "transparent", border: "1px solid rgba(229,57,53,.4)", padding: "10px 20px", cursor: "pointer" }}>SIGN OUT</button>
            <button style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 13, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, color: "#555", background: "transparent", border: `1px solid ${border}`, padding: "10px 20px", cursor: "pointer" }}>DELETE ACCOUNT</button>
          </div>
        </div>

        <button onClick={save} style={{ background: saved ? "#555" : "#76b900", color: "#000", border: "none", padding: "13px 32px", fontFamily: "'Barlow Condensed', sans-serif", fontSize: 14, fontWeight: 800, cursor: "pointer", textTransform: "uppercase", letterSpacing: 1, transition: "background .2s" }}>
          {saved ? "✓ SAVED" : "SAVE SETTINGS"}
        </button>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════
   ANALYZER PAGE
═══════════════════════════════════════ */
function AnalyzerPage({ onAnalysis }) {
  const [inputTab, setInputTab] = useState("url");
  const [urlVal, setUrlVal] = useState("https://reuters.com/world/us/fed-holds-rates-steady-2024");
  const [textVal, setTextVal] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const runAnalysis = (type = "high") => {
    setResult(null); setLoading(true);
    setTimeout(() => { setLoading(false); const d = demoData[type]; setResult(d); onAnalysis && onAnalysis(d, type); }, 480 * 6);
  };
  const loadDemo = (type) => { setUrlVal(demoData[type].url); runAnalysis(type); };

  return (
    <div>
      <section style={{ padding: "64px 0 52px", borderBottom: "1px solid rgba(255,255,255,0.08)", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(255,255,255,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.04) 1px,transparent 1px)", backgroundSize: "60px 60px", maskImage: "linear-gradient(to bottom,transparent,rgba(0,0,0,.3) 30%,rgba(0,0,0,.3) 70%,transparent)" }} />
        <div style={{ position: "relative", zIndex: 1 }}>
          <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 11, color: "#76b900", letterSpacing: ".14em", textTransform: "uppercase", display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
            <span style={{ display: "block", width: 28, height: 2, background: "#76b900" }} />NLP + Fact-Check + Source Credibility
          </div>
          <h1 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: "clamp(52px,7vw,88px)", fontWeight: 800, lineHeight: .95, letterSpacing: "-.5px", textTransform: "uppercase", marginBottom: 22 }}>
            Truth<br /><span style={{ color: "#76b900" }}>Verified.</span><br /><span style={{ color: "#a0a0a0", fontWeight: 300 }}>Instantly.</span>
          </h1>
          <p style={{ fontSize: 16, color: "#a0a0a0", maxWidth: 480, lineHeight: 1.65, marginBottom: 36, fontWeight: 300 }}>Paste any news URL or article text. Our AI pipeline analyzes credibility, detects misinformation patterns, and surfaces fact-check alerts in seconds.</p>
          <div style={{ background: "#0a0a0a", border: "1px solid rgba(255,255,255,0.15)", padding: 24, maxWidth: 700 }}>
            <div style={{ display: "flex", gap: 0, marginBottom: 18, borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
              {["url", "text"].map(t => (
                <button key={t} onClick={() => setInputTab(t)} style={{ fontFamily: "'Barlow Semi Condensed', sans-serif", fontSize: 12, fontWeight: 600, padding: "8px 20px", border: "none", borderBottom: inputTab === t ? "2px solid #76b900" : "2px solid transparent", marginBottom: -1, cursor: "pointer", color: inputTab === t ? "#76b900" : "#555", background: "transparent", letterSpacing: ".5px", textTransform: "uppercase", transition: "all .15s" }}>
                  {t === "url" ? "URL Input" : "Paste Text"}
                </button>
              ))}
            </div>
            {inputTab === "url" ? (
              <>
                <div style={{ display: "flex", gap: 0 }}>
                  <input value={urlVal} onChange={e => setUrlVal(e.target.value)} style={{ flex: 1, background: "#181818", border: "1px solid rgba(255,255,255,0.15)", borderRight: "none", padding: "11px 16px", fontFamily: "'Share Tech Mono', monospace", fontSize: 12.5, color: "#fff", outline: "none" }} placeholder="https://example.com/article..." />
                  <button onClick={() => runAnalysis("high")} style={{ background: "#76b900", color: "#000", border: "none", padding: "11px 28px", fontFamily: "'Barlow Condensed', sans-serif", fontSize: 14, fontWeight: 800, cursor: "pointer", textTransform: "uppercase", letterSpacing: 1 }}>Analyze →</button>
                </div>
                <div style={{ display: "flex", gap: 8, marginTop: 14, flexWrap: "wrap", alignItems: "center" }}>
                  <span style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 10, color: "#555", letterSpacing: ".06em", textTransform: "uppercase" }}>Quick demo:</span>
                  {[["high", "Reuters · High credibility"], ["med", "NY Post · Mixed bias"], ["low", "NaturalNews · Low credibility"]].map(([t, l]) => (
                    <button key={t} onClick={() => loadDemo(t)} style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 11, color: "#a0a0a0", border: "1px solid rgba(255,255,255,0.15)", background: "transparent", padding: "4px 11px", cursor: "pointer" }}>{l}</button>
                  ))}
                </div>
              </>
            ) : (
              <>
                <textarea value={textVal} onChange={e => setTextVal(e.target.value)} style={{ width: "100%", background: "#181818", border: "1px solid rgba(255,255,255,0.15)", padding: "13px 16px", fontFamily: "'Barlow', sans-serif", fontSize: 14, color: "#fff", outline: "none", resize: "vertical", minHeight: 100, lineHeight: 1.6 }} placeholder="Paste article text here..." />
                <div style={{ marginTop: 12, textAlign: "right" }}>
                  <button onClick={() => runAnalysis("high")} style={{ background: "#76b900", color: "#000", border: "none", padding: "11px 28px", fontFamily: "'Barlow Condensed', sans-serif", fontSize: 14, fontWeight: 800, cursor: "pointer", textTransform: "uppercase", letterSpacing: 1 }}>Analyze Text →</button>
                </div>
              </>
            )}
          </div>
        </div>
      </section>
      <LoadingState visible={loading} />
      {result && !loading && <Results data={result} />}
      <section style={{ padding: "64px 0", borderTop: "1px solid rgba(255,255,255,0.08)" }}>
        <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 42, fontWeight: 800, textTransform: "uppercase", letterSpacing: ".5px", marginBottom: 4 }}>How It <span style={{ color: "#76b900" }}>Works</span></div>
        <div style={{ fontSize: 14, color: "#a0a0a0", marginBottom: 36, fontWeight: 300 }}>Five-stage AI pipeline — results in under 8 seconds.</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 2 }}>
          {[
            { n: "// 01 — EXTRACT", name: "Content Extraction", desc: "newspaper3k strips nav, ads, and boilerplate — returning clean article text, title, authors, and publish date." },
            { n: "// 02 — ANALYZE", name: "NLP Pipeline", desc: "spaCy NER identifies checkable claims. TextBlob measures sentiment. BERT classifies headline clickbait." },
            { n: "// 03 — VERIFY", name: "Fact-Check Lookup", desc: "Claims queried against Google Fact Check Tools API. Wikipedia serves as fallback for uncovered claims." },
            { n: "// 04 — SCORE", name: "Credibility Score", desc: "Weighted formula: fact-check (35%) + source reliability (30%) + sentiment neutrality (20%) + non-clickbait (15%)." },
          ].map((s, i) => (
            <div key={i} style={{ background: "#0a0a0a", border: "1px solid rgba(255,255,255,0.08)", padding: "22px 20px", position: "relative" }}>
              <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: "rgba(255,255,255,0.08)" }} />
              <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 10, color: "#76b900", marginBottom: 14, letterSpacing: ".08em" }}>{s.n}</div>
              <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 16, fontWeight: 700, textTransform: "uppercase", letterSpacing: ".5px", marginBottom: 8 }}>{s.name}</div>
              <div style={{ fontSize: 12, color: "#a0a0a0", lineHeight: 1.6, fontWeight: 300 }}>{s.desc}</div>
            </div>
          ))}
        </div>
      </section>
      <footer style={{ borderTop: "1px solid rgba(255,255,255,0.08)", padding: "22px 0", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 11, color: "#555", letterSpacing: ".04em" }}>© VERITAI · AI HACKATHON 2024 · BUILT IN 24 HRS</div>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {["FASTAPI", "HUGGINGFACE", "SPACY", "GOOGLE FACT CHECK"].map(t => <span key={t} style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 10, color: "#555", border: "1px solid rgba(255,255,255,0.08)", padding: "3px 8px" }}>{t}</span>)}
        </div>
      </footer>
    </div>
  );
}

/* ═══════════════════════════════════════
   HISTORY PAGE
═══════════════════════════════════════ */
function HistoryPage({ history, onClear, onRerun }) {
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const filtered = history.filter(h => {
    if (filter === "high" && h.score < 70) return false;
    if (filter === "med" && (h.score < 40 || h.score >= 70)) return false;
    if (filter === "low" && h.score >= 40) return false;
    if (search && !h.domain.toLowerCase().includes(search) && !h.url.toLowerCase().includes(search)) return false;
    return true;
  });
  const total = history.length, verified = history.filter(h => h.score >= 70).length, mixed = history.filter(h => h.score >= 40 && h.score < 70).length, misinfo = history.filter(h => h.score < 40).length;
  return (
    <div>
      <div style={{ padding: "48px 0 36px", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
        <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 11, color: "#76b900", letterSpacing: ".14em", textTransform: "uppercase", display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
          <span style={{ display: "block", width: 20, height: 2, background: "#76b900" }} />Analysis Log · Session History
        </div>
        <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: "clamp(36px,5vw,58px)", fontWeight: 800, textTransform: "uppercase", letterSpacing: ".5px", lineHeight: 1, marginBottom: 10 }}>Analysis <span style={{ color: "#76b900" }}>History</span></div>
        <div style={{ fontSize: 14, color: "#a0a0a0", fontWeight: 300 }}>All previously analyzed articles from this session, sorted by most recent.</div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 2, margin: "2px 0" }}>
        {[{ val: total, color: "#00a8e0", label: "Total Analyzed" }, { val: verified, color: "#76b900", label: "High Credibility" }, { val: mixed, color: "#f5a623", label: "Mixed / Questionable" }, { val: misinfo, color: "#e53935", label: "Misinfo Risk" }].map((s, i) => (
          <div key={i} style={{ background: "#0a0a0a", border: "1px solid rgba(255,255,255,0.08)", padding: "16px 20px" }}>
            <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 28, fontWeight: 800, lineHeight: 1, marginBottom: 3, color: s.color }}>{s.val}</div>
            <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 10, color: "#555", letterSpacing: ".06em", textTransform: "uppercase" }}>{s.label}</div>
          </div>
        ))}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "20px 0", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
        <input value={search} onChange={e => setSearch(e.target.value.toLowerCase())} style={{ background: "#111", border: "1px solid rgba(255,255,255,0.15)", padding: "9px 14px", fontFamily: "'Share Tech Mono', monospace", fontSize: 12, color: "#fff", outline: "none", width: 300 }} placeholder="Search domain or URL..." />
        {[["all", "All"], ["high", "High"], ["med", "Mixed"], ["low", "Low"]].map(([f, l]) => (
          <button key={f} onClick={() => setFilter(f)} style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 11, color: filter === f ? "#76b900" : "#a0a0a0", border: `1px solid ${filter === f ? "#76b900" : "rgba(255,255,255,0.15)"}`, background: filter === f ? "rgba(118,185,0,0.12)" : "transparent", padding: "8px 14px", cursor: "pointer", letterSpacing: ".04em" }}>{l}</button>
        ))}
        <div style={{ flex: 1 }} />
        <button onClick={onClear} style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 11, color: "#555", border: "none", background: "transparent", cursor: "pointer" }}>Clear History</button>
      </div>
      <div style={{ border: "1px solid rgba(255,255,255,0.08)", background: "#0a0a0a" }}>
        {filtered.length === 0 ? (
          <div style={{ padding: "60px 0", textAlign: "center" }}>
            <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 48, fontWeight: 800, color: "#1a1a1a", marginBottom: 12 }}>[ ]</div>
            <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 12, color: "#555", letterSpacing: ".06em" }}>NO ANALYSES YET — RUN YOUR FIRST SCAN</div>
          </div>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead><tr style={{ borderBottom: "1px solid rgba(255,255,255,0.15)" }}>
              {["Source", "Score", "Verdict", "Claims", "Analyzed", ""].map((h, i) => <th key={i} style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 10, color: "#555", letterSpacing: ".1em", textTransform: "uppercase", padding: "14px 16px", textAlign: "left", fontWeight: 400 }}>{h}</th>)}
            </tr></thead>
            <tbody>
              {filtered.map(h => (
                <tr key={h.id} onClick={() => onRerun(h.type)} style={{ borderBottom: "1px solid rgba(255,255,255,0.08)", cursor: "pointer" }}>
                  <td style={{ padding: "14px 16px" }}><span style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 12, color: "#fff", display: "block", marginBottom: 3 }}>{h.domain}</span><span style={{ fontSize: 11, color: "#555", fontFamily: "'Share Tech Mono', monospace", maxWidth: 280, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", display: "block" }}>{h.url}</span></td>
                  <td style={{ padding: "14px 16px" }}><span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 24, fontWeight: 800, color: h.gaugeColor }}>{h.score}</span></td>
                  <td style={{ padding: "14px 16px" }}><span style={{ ...getBadgeStyle(h.verdictClass), padding: "3px 8px", fontFamily: "'Share Tech Mono', monospace", fontSize: 9, letterSpacing: ".08em", textTransform: "uppercase" }}>{h.verdict}</span></td>
                  <td style={{ padding: "14px 16px", fontFamily: "'Share Tech Mono', monospace", fontSize: 12, color: "#a0a0a0" }}>{h.claims} <span style={{ color: "#555" }}>/ {h.disputed} disputed</span></td>
                  <td style={{ padding: "14px 16px", fontFamily: "'Share Tech Mono', monospace", fontSize: 11, color: "#555" }}>{h.date} {h.time}</td>
                  <td style={{ padding: "14px 16px" }}><button onClick={e => { e.stopPropagation(); onRerun(h.type); }} style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 11, color: "#76b900", border: "1px solid #76b900", background: "transparent", padding: "5px 12px", cursor: "pointer" }}>Re-run →</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      <footer style={{ borderTop: "1px solid rgba(255,255,255,0.08)", padding: "22px 0", display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 40 }}>
        <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 11, color: "#555" }}>© VERITAI · AI HACKATHON 2024</div>
        <div style={{ display: "flex", gap: 6 }}>{["SESSION STORAGE", "LIVE SYNC"].map(t => <span key={t} style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 10, color: "#555", border: "1px solid rgba(255,255,255,0.08)", padding: "3px 8px" }}>{t}</span>)}</div>
      </footer>
    </div>
  );
}

/* ═══════════════════════════════════════
   FEATURES PAGE
═══════════════════════════════════════ */
function FeaturesPage() {
  const [activeContentType, setActiveContentType] = useState(null);
  const [activeCoverage, setActiveCoverage] = useState(null);
  const [activeSpecial, setActiveSpecial] = useState(null);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const contentTypes = [
    { id: "text", label: "Text", icon: "T", desc: "AI analysis of written articles, blog posts, and news copy. Detects bias, emotional language, and factual accuracy in long-form text.", color: "#00a8e0" },
    { id: "pictures", label: "Pictures", icon: "◼", desc: "Reverse image search integration and metadata analysis to detect manipulated or out-of-context imagery used in misinformation.", color: "#76b900" },
    { id: "video", label: "Video", icon: "▶", desc: "Deepfake detection pipeline and transcript fact-checking for video content. Flags synthetic media with high confidence scoring.", color: "#f5a623" },
    { id: "audio", label: "Audio", icon: "♪", desc: "Speech-to-text transcription combined with voice clone detection. Identifies AI-generated audio and manipulated recordings.", color: "#e53935" },
    { id: "graphics", label: "Graphics", icon: "◈", desc: "Infographic and data visualization verification. Cross-references statistics with primary sources to spot misleading charts.", color: "#a855f7" },
    { id: "publish", label: "Ready to Publish", icon: "✓", desc: "Full pre-publication integrity check — runs all pipelines simultaneously and returns a publish-confidence score with editorial flags.", color: "#76b900" },
  ];

  const coverageAreas = [
    { id: "breaking", label: "Breaking News", icon: "⚡", desc: "Real-time verification pipeline optimized for speed. Processes breaking stories within seconds using live fact-check feeds.", color: "#e53935" },
    { id: "ugc", label: "User Generated Content", icon: "◎", desc: "Social media post analyzer. Traces viral content origin, checks share chain integrity, and scores credibility of citizen journalism.", color: "#00a8e0" },
    { id: "sports", label: "Sports", icon: "◉", desc: "Stat verification engine cross-referencing official league databases. Flags incorrect scores, records, and player statistics.", color: "#76b900" },
    { id: "politics", label: "Politics", icon: "⬡", desc: "Political claim fact-checker using parliamentary records, voting data, and official government sources. Detects spin and misquotes.", color: "#f5a623" },
    { id: "business", label: "Business & Finance", icon: "$", desc: "Financial data verifier cross-referencing SEC filings, earnings reports, and market data. Flags misleading economic claims.", color: "#76b900" },
    { id: "climate", label: "Climate", icon: "◌", desc: "Climate data verification against IPCC and NOAA datasets. Identifies cherry-picked statistics and scientific misrepresentation.", color: "#00a8e0" },
    { id: "human", label: "Human Interest", icon: "◯", desc: "Sentiment and emotional language analysis for human-interest stories. Flags exploitative framing and unverified personal claims.", color: "#f5a623" },
    { id: "technology", label: "Technology", icon: "⬢", desc: "Tech claim verifier for product specs, security vulnerabilities, and AI capability claims. Cross-references CVE databases and specs.", color: "#a855f7" },
    { id: "entertainment", label: "Entertainment", icon: "★", desc: "Celebrity claim checker and rumor debunker using verified public records, official statements, and entertainment industry sources.", color: "#e53935" },
  ];

  const specialFeatures = [
    { id: "archive", label: "Archive", icon: "≡", desc: "Access VeritAI's historical analysis database. Search past fact-checks, browse credibility trends over time, and reference previous verdicts for any domain.", color: "#00a8e0", stat: "2.4M", statLabel: "Archived analyses" },
    { id: "partners", label: "Content Partners", icon: "◈", desc: "VeritAI integrates with 100+ trusted content verification partners including Reuters, AFP, PolitiFact, Snopes, and FactCheck.org for authoritative cross-referencing.", color: "#76b900", stat: "100+", statLabel: "Verification partners" },
    { id: "usatoday", label: "USA TODAY Network", icon: "⬡", desc: "Exclusive partnership with the USA TODAY Network provides access to state and local publication credibility scoring across all 50 states and 250+ local outlets.", color: "#f5a623", stat: "250+", statLabel: "Local publications" },
  ];

  const runFeatureDemo = (featureId) => {
    setAnalysisResult(null); setLoading(true);
    setTimeout(() => {
      setLoading(false);
      const scoreMap = { text: 84, pictures: 71, video: 58, audio: 63, graphics: 79, publish: 88, breaking: 76, ugc: 45, sports: 91, politics: 62, business: 83, climate: 87, human: 55, technology: 74, entertainment: 48, archive: 95, partners: 98, usatoday: 89 };
      const score = scoreMap[featureId] || 75;
      setAnalysisResult({ featureId, score, label: score >= 70 ? "Highly Credible" : score >= 45 ? "Mixed Credibility" : "Low Credibility", color: score >= 70 ? "#76b900" : score >= 45 ? "#f5a623" : "#e53935", verdict: score >= 70 ? "VERIFIED" : score >= 45 ? "QUESTIONABLE" : "MISINFO RISK", verdictClass: score >= 70 ? "green" : score >= 45 ? "amber" : "red" });
    }, 1800);
  };

  const handleContentType = (ct) => { setActiveContentType(ct.id); setActiveCoverage(null); setActiveSpecial(null); runFeatureDemo(ct.id); };
  const handleCoverage = (cv) => { setActiveCoverage(cv.id); setActiveContentType(null); setActiveSpecial(null); runFeatureDemo(cv.id); };
  const handleSpecial = (sp) => { setActiveSpecial(sp.id); setActiveContentType(null); setActiveCoverage(null); runFeatureDemo(sp.id); };

  const activeItem = activeContentType ? contentTypes.find(c => c.id === activeContentType) : activeCoverage ? coverageAreas.find(c => c.id === activeCoverage) : activeSpecial ? specialFeatures.find(s => s.id === activeSpecial) : null;

  const BtnGrid = ({ items, activeId, onSelect }) => (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 8 }}>
      {items.map(item => {
        const hexToRgb = (c) => { const map = { "#76b900": "118,185,0", "#00a8e0": "0,168,224", "#f5a623": "245,166,35", "#e53935": "229,57,53", "#a855f7": "168,85,247" }; return map[c] || "118,185,0"; };
        const active = activeId === item.id;
        return (
          <button key={item.id} onClick={() => onSelect(item)}
            style={{ background: active ? `rgba(${hexToRgb(item.color)},.12)` : "#111", border: `1px solid ${active ? item.color : "rgba(255,255,255,0.1)"}`, color: active ? item.color : "#a0a0a0", padding: "14px 16px", cursor: "pointer", textAlign: "left", transition: "all .18s", display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 14, flexShrink: 0, color: active ? item.color : "#555" }}>{item.icon}</span>
            <span style={{ fontFamily: "'Barlow Semi Condensed', sans-serif", fontSize: 13, fontWeight: 600, letterSpacing: ".3px" }}>{item.label}</span>
          </button>
        );
      })}
    </div>
  );

  return (
    <div>
      <div style={{ padding: "48px 0 36px", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
        <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 11, color: "#76b900", letterSpacing: ".14em", textTransform: "uppercase", display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
          <span style={{ display: "block", width: 20, height: 2, background: "#76b900" }} />Content Integrity Suite · Feature Explorer
        </div>
        <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: "clamp(36px,5vw,58px)", fontWeight: 800, textTransform: "uppercase", letterSpacing: ".5px", lineHeight: 1, marginBottom: 10 }}>Platform <span style={{ color: "#76b900" }}>Features</span></div>
        <div style={{ fontSize: 14, color: "#a0a0a0", fontWeight: 300 }}>Select any content type or coverage area to activate the verification pipeline for that domain.</div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 2, paddingTop: 2, minHeight: 560 }}>
        <div>
          <div style={{ background: "#0a0a0a", border: "1px solid rgba(255,255,255,0.08)", padding: "24px 24px 20px", marginBottom: 2 }}>
            <CardLabel>Content Types</CardLabel>
            <BtnGrid items={contentTypes} activeId={activeContentType} onSelect={handleContentType} />
          </div>
          <div style={{ background: "#0a0a0a", border: "1px solid rgba(255,255,255,0.08)", padding: "24px 24px 20px", marginBottom: 2 }}>
            <CardLabel>Coverage Expertise</CardLabel>
            <BtnGrid items={coverageAreas} activeId={activeCoverage} onSelect={handleCoverage} />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 2 }}>
            {specialFeatures.map(sp => {
              const active = activeSpecial === sp.id;
              const hexToRgb = (c) => { const map = { "#76b900": "118,185,0", "#00a8e0": "0,168,224", "#f5a623": "245,166,35" }; return map[c] || "118,185,0"; };
              return (
                <button key={sp.id} onClick={() => handleSpecial(sp)}
                  style={{ background: active ? `rgba(${hexToRgb(sp.color)},.12)` : "#0a0a0a", border: `1px solid ${active ? sp.color : "rgba(255,255,255,0.08)"}`, color: active ? sp.color : "#a0a0a0", padding: "20px 20px", cursor: "pointer", textAlign: "left", transition: "all .18s", display: "flex", flexDirection: "column", gap: 8 }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 15, fontWeight: 700, textTransform: "uppercase", letterSpacing: ".5px" }}>{sp.label}</span>
                    <span style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 16, color: active ? sp.color : "#333" }}>{sp.icon}</span>
                  </div>
                  <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 26, fontWeight: 800, color: sp.color, lineHeight: 1 }}>{sp.stat}</div>
                  <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 9, color: "#555", letterSpacing: ".08em", textTransform: "uppercase" }}>{sp.statLabel}</div>
                </button>
              );
            })}
          </div>
        </div>
        <div style={{ background: "#0a0a0a", border: "1px solid rgba(255,255,255,0.08)", padding: "24px", display: "flex", flexDirection: "column", position: "sticky", top: 74, maxHeight: "calc(100vh - 100px)", overflowY: "auto" }}>
          {!activeItem && !loading && (
            <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", padding: "40px 0" }}>
              <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 48, fontWeight: 800, color: "#1a1a1a", marginBottom: 14 }}>[ ]</div>
              <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 11, color: "#555", letterSpacing: ".06em", textTransform: "uppercase", lineHeight: 1.8 }}>SELECT A FEATURE<br />TO ACTIVATE PIPELINE</div>
            </div>
          )}
          {loading && (
            <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "40px 0" }}>
              <div style={{ width: 160, height: 2, background: "#1a1a1a", margin: "0 auto 24px", position: "relative", overflow: "hidden" }}>
                <div style={{ position: "absolute", left: "-100%", top: 0, bottom: 0, width: "100%", background: "#76b900", animation: "scanBar 1.2s ease-in-out infinite" }} />
              </div>
              <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 11, color: "#76b900", letterSpacing: ".1em", textTransform: "uppercase" }}>ACTIVATING PIPELINE...</div>
            </div>
          )}
          {activeItem && analysisResult && !loading && (
            <div style={{ animation: "fadeIn .3s ease", position: "relative" }}>
              <div style={{ position: "absolute", top: -24, left: -24, right: -24, height: 2, background: activeItem.color }} />
              <CardLabel>{activeItem.label} Pipeline</CardLabel>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 18, padding: "14px", background: "#111" }}>
                <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 22, width: 44, height: 44, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(118,185,0,.15)", color: activeItem.color, flexShrink: 0 }}>{activeItem.icon}</div>
                <div>
                  <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 18, fontWeight: 800, textTransform: "uppercase", letterSpacing: ".5px" }}>{activeItem.label}</div>
                  <Badge cls={analysisResult.verdictClass} style={{ marginTop: 4 }}>{analysisResult.verdict}</Badge>
                </div>
              </div>
              <div style={{ marginBottom: 18 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                  <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 10, color: "#555", letterSpacing: ".08em", textTransform: "uppercase" }}>Pipeline Score</div>
                  <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 22, fontWeight: 800, color: analysisResult.color }}>{analysisResult.score}<span style={{ fontSize: 13, color: "#555" }}>/100</span></div>
                </div>
                <div style={{ height: 4, background: "#1a1a1a" }}>
                  <div style={{ height: "100%", width: analysisResult.score + "%", background: analysisResult.color, transition: "width 1s cubic-bezier(.22,1,.36,1)" }} />
                </div>
              </div>
              <div style={{ fontSize: 12, color: "#a0a0a0", lineHeight: 1.65, marginBottom: 18, fontWeight: 300 }}>{activeItem.desc}</div>
              <div style={{ borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: 16 }}>
                <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 10, color: "#555", letterSpacing: ".08em", textTransform: "uppercase", marginBottom: 10 }}>// Pipeline Status</div>
                {["Content ingested", "NLP model loaded", "Fact-check query sent", "Source credibility fetched", "Score computed"].map((step, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 7, fontFamily: "'Share Tech Mono', monospace", fontSize: 11, color: "#76b900" }}>
                    <span style={{ fontSize: 9 }}>✓</span>{step}
                  </div>
                ))}
              </div>
              <div style={{ marginTop: 18, padding: "12px 14px", background: "#111", borderLeft: `2px solid ${activeItem.color}` }}>
                <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 10, color: "#555", marginBottom: 4, letterSpacing: ".06em", textTransform: "uppercase" }}>// Result</div>
                <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 14, fontWeight: 700, color: analysisResult.color, textTransform: "uppercase" }}>{analysisResult.label}</div>
              </div>
            </div>
          )}
        </div>
      </div>
      <footer style={{ borderTop: "1px solid rgba(255,255,255,0.08)", padding: "22px 0", display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 40 }}>
        <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 11, color: "#555" }}>© VERITAI · FEATURES v1.0</div>
        <div style={{ display: "flex", gap: 6 }}>
          {["15 PIPELINES", "REAL-TIME", "AI-POWERED"].map(t => <span key={t} style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 10, color: "#555", border: "1px solid rgba(255,255,255,0.08)", padding: "3px 8px" }}>{t}</span>)}
        </div>
      </footer>
    </div>
  );
}

/* ═══════════════════════════════════════
   DOCS PAGE
═══════════════════════════════════════ */
function DocsPage() {
  const [active, setActive] = useState("overview");
  const sections = [
    { id: "overview", label: "Introduction", group: "Overview" },
    { id: "architecture", label: "Architecture", group: "Overview" },
    { id: "quickstart", label: "Quick Start", group: "Overview" },
    { id: "extraction", label: "Content Extraction", group: "Pipeline" },
    { id: "nlp", label: "NLP Analysis", group: "Pipeline" },
    { id: "factcheck", label: "Fact Checking", group: "Pipeline" },
    { id: "scoring", label: "Scoring Model", group: "Pipeline" },
    { id: "response", label: "Response Schema", group: "Reference" },
    { id: "errors", label: "Error Codes", group: "Reference" },
  ];
  const groups = [...new Set(sections.map(s => s.group))];
  const P = ({ children }) => <div style={{ fontSize: 14, color: "#a0a0a0", lineHeight: 1.75, marginBottom: 16, fontWeight: 300 }}>{children}</div>;
  const H3 = ({ children }) => <div style={{ fontFamily: "'Barlow Semi Condensed', sans-serif", fontSize: 15, fontWeight: 600, color: "#fff", margin: "24px 0 10px", letterSpacing: ".2px" }}>{children}</div>;
  const Code = ({ children }) => <div style={{ background: "#111", border: "1px solid rgba(255,255,255,0.15)", borderLeft: "2px solid #76b900", padding: "18px 20px", margin: "16px 0", fontFamily: "'Share Tech Mono', monospace", fontSize: 12, color: "#a0a0a0", lineHeight: 1.8, overflowX: "auto", whiteSpace: "pre" }}>{children}</div>;
  const Callout = ({ warn, children }) => <div style={{ background: warn ? "rgba(245,166,35,0.12)" : "rgba(118,185,0,0.12)", border: `1px solid ${warn ? "rgba(245,166,35,.25)" : "rgba(118,185,0,.25)"}`, borderLeft: `3px solid ${warn ? "#f5a623" : "#76b900"}`, padding: "14px 18px", margin: "16px 0", fontSize: 13, color: "#a0a0a0", lineHeight: 1.6 }}>{children}</div>;
  const IC = ({ children }) => <span style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 12, color: "#76b900", background: "rgba(118,185,0,0.12)", padding: "1px 6px", border: "1px solid rgba(118,185,0,.2)" }}>{children}</span>;
  const TH = ({ cols }) => <thead><tr>{cols.map((c, i) => <th key={i} style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 10, color: "#555", letterSpacing: ".1em", textTransform: "uppercase", padding: "10px 14px", textAlign: "left", borderBottom: "1px solid rgba(255,255,255,0.15)", background: "#111" }}>{c}</th>)}</tr></thead>;
  const TR = ({ cells }) => <tr>{cells.map((c, i) => <td key={i} style={{ padding: "10px 14px", fontSize: i === 0 ? 12 : 13, color: i === 0 ? "#fff" : "#a0a0a0", fontFamily: i === 0 ? "'Share Tech Mono', monospace" : "'Barlow', sans-serif", borderBottom: "1px solid rgba(255,255,255,0.08)", fontWeight: 300 }}>{c}</td>)}</tr>;
  const Table = ({ cols, rows }) => <table style={{ width: "100%", borderCollapse: "collapse", margin: "16px 0" }}><TH cols={cols} /><tbody>{rows.map((r, i) => <TR key={i} cells={r} />)}</tbody></table>;
  const content = {
    overview: <><P>VeritAI is a real-time content integrity analysis engine that combines NLP, fact-checking APIs, and source credibility databases to produce a single, interpretable credibility score for any news article or web content.</P><P>Built during a 24-hour hackathon, VeritAI demonstrates how modern AI tooling — HuggingFace transformers, spaCy NER, and Google's Fact Check Tools API — can be composed into a production-grade pipeline.</P><Callout warn={false}><strong style={{ color: "#76b900", fontFamily: "'Barlow Semi Condensed', sans-serif" }}>NOTE:</strong> This is a demonstration application. The API section documents the real endpoint specification for production integration.</Callout></>,
    architecture: <><P>VeritAI runs a linear five-stage pipeline. Each stage produces structured output consumed by the next. The entire pipeline completes in under 8 seconds for a typical 800-word article.</P><Code>{`URL / Text Input\n  → Stage 1: Content Extraction   (newspaper3k)\n  → Stage 2: NLP Analysis         (spaCy + TextBlob + BERT)\n  → Stage 3: Fact Check Lookup    (Google FCTAPI + Wikipedia)\n  → Stage 4: Source Scoring       (MBFC database)\n  → Stage 5: Score Computation    (weighted formula)\n  → CredibilityResult JSON`}</Code></>,
    quickstart: <><H3>Install dependencies</H3><Code>pip install fastapi uvicorn newspaper3k spaCy textblob transformers requests</Code><H3>Run the server</H3><Code>uvicorn main:app --reload --port 8000</Code><H3>Analyze your first URL</H3><Code>{`curl -X POST "http://localhost:8000/analyze" \\\n  -H "X-API-Key: vrt_demo_xxxx" \\\n  -d '{"url": "https://reuters.com/article/..."}'`}</Code></>,
    extraction: <><P>Stage 1 uses <IC>newspaper3k</IC> to fetch and parse article content from a given URL. It strips navigation, advertisements, comment sections, and boilerplate, returning only the core editorial content.</P><Table cols={["Field", "Type", "Description"]} rows={[["title", "string", "Article headline as published"], ["text", "string", "Full cleaned article body"], ["authors", "string[]", "Byline authors if detected"], ["publish_date", "ISO 8601", "Publication date if available"], ["domain", "string", "Source domain extracted from URL"]]} /></>,
    nlp: <><P>Stage 2 runs three independent NLP processes in parallel.</P><H3>Named Entity Recognition (spaCy)</H3><P>spaCy's <IC>en_core_web_lg</IC> model identifies entities of type PERSON, ORG, GPE, EVENT, and QUANTITY used to construct checkable claims.</P><H3>Sentiment Analysis (TextBlob)</H3><P>TextBlob computes polarity (−1 to +1) and subjectivity (0 to 1) for the full article and headline independently.</P><H3>Clickbait Detection (BERT)</H3><P>A fine-tuned <IC>bert-base-uncased</IC> model classifies the headline as clickbait or non-clickbait. Trained on 38,517 headlines.</P></>,
    factcheck: <><P>The top 5 claims extracted by NER are queried against the Google Fact Check Tools API.</P><Code>{`{\n  "claim": "string",\n  "verdict": "VERIFIED | DISPUTED | UNVERIFIED",\n  "rating": "string",\n  "source": "string",\n  "url": "string"\n}`}</Code></>,
    scoring: <><P>The final credibility score is a weighted composite of four independent signals, each normalized to 0–100.</P><div style={{ background: "#111", border: "1px solid rgba(255,255,255,0.15)", padding: 20, margin: "16px 0", textAlign: "center", fontFamily: "'Share Tech Mono', monospace", fontSize: 13, color: "#fff", lineHeight: 2 }}>Score = <span style={{ color: "#76b900" }}>0.35</span> × FactCheck + <span style={{ color: "#76b900" }}>0.30</span> × SourceReliability + <span style={{ color: "#76b900" }}>0.20</span> × SentimentNeutrality + <span style={{ color: "#76b900" }}>0.15</span> × NonClickbait</div><Table cols={["Signal", "Weight"]} rows={[["Fact-check match", "35%"], ["Source reliability", "30%"], ["Sentiment neutrality", "20%"], ["Non-clickbait score", "15%"]]} /></>,
    response: <><Code>{`{\n  "score": 84,\n  "verdict": "VERIFIED",\n  "label": "Highly Credible",\n  "signals": {\n    "fact_check": 88,\n    "source_reliability": 95,\n    "sentiment_neutrality": 79,\n    "non_clickbait": 91\n  },\n  "claims": [],\n  "processed_ms": 4821\n}`}</Code></>,
    errors: <><Table cols={["Code", "Status", "Description"]} rows={[["ERR_INVALID_URL", "400", "URL could not be parsed or fetched"], ["ERR_EXTRACTION_FAILED", "422", "newspaper3k could not extract content"], ["ERR_TEXT_TOO_SHORT", "400", "Submitted text is under 100 characters"], ["ERR_UNAUTHORIZED", "401", "Missing or invalid API key"], ["ERR_RATE_LIMITED", "429", "Request quota exceeded"], ["ERR_PIPELINE_TIMEOUT", "504", "Pipeline exceeded 30s timeout"], ["ERR_INTERNAL", "500", "Unexpected internal server error"]]} /></>,
  };
  return (
    <div>
      <div style={{ padding: "48px 0 36px", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
        <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 11, color: "#76b900", letterSpacing: ".14em", textTransform: "uppercase", display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
          <span style={{ display: "block", width: 20, height: 2, background: "#76b900" }} />Technical Documentation · v1.0
        </div>
        <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: "clamp(36px,5vw,58px)", fontWeight: 800, textTransform: "uppercase", letterSpacing: ".5px", lineHeight: 1, marginBottom: 10 }}>Developer <span style={{ color: "#76b900" }}>Docs</span></div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "220px 1fr", gap: 0, padding: "40px 0 80px", alignItems: "start" }}>
        <div style={{ position: "sticky", top: 78, borderRight: "1px solid rgba(255,255,255,0.08)", paddingRight: 24 }}>
          {groups.map(g => (
            <div key={g} style={{ marginBottom: 28 }}>
              <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 10, color: "#555", letterSpacing: ".12em", textTransform: "uppercase", marginBottom: 10, paddingBottom: 8, borderBottom: "1px solid rgba(255,255,255,0.08)" }}>{g}</div>
              {sections.filter(s => s.group === g).map(s => (
                <button key={s.id} onClick={() => setActive(s.id)} style={{ display: "block", fontFamily: "'Barlow Semi Condensed', sans-serif", fontSize: 13, color: active === s.id ? "#76b900" : "#a0a0a0", padding: "5px 0", cursor: "pointer", border: "none", background: "transparent", textAlign: "left", width: "100%", letterSpacing: ".2px" }}>
                  {active === s.id ? "→ " : ""}{s.label}
                </button>
              ))}
            </div>
          ))}
        </div>
        <div style={{ paddingLeft: 40 }}>
          {sections.filter(s => s.id === active).map(s => (
            <div key={s.id}>
              <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 10, color: "#76b900", letterSpacing: ".12em", textTransform: "uppercase", marginBottom: 10 }}>// {String(sections.indexOf(s) + 1).padStart(2, "0")} — {s.group.toUpperCase()}</div>
              <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 32, fontWeight: 800, textTransform: "uppercase", letterSpacing: ".5px", marginBottom: 14 }}>{s.label}</div>
              {content[s.id]}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════
   API PAGE
═══════════════════════════════════════ */
function ApiPage() {
  const [activeEp, setActiveEp] = useState("analyze");
  const [apiTabs, setApiTabs] = useState({});
  const endpoints = [
    { id: "analyze", method: "POST", path: "/v1/analyze", color: "green" },
    { id: "batch", method: "POST", path: "/v1/analyze/batch", color: "blue" },
    { id: "sources", method: "GET", path: "/v1/sources", color: "green" },
    { id: "history-api", method: "GET", path: "/v1/history", color: "green" },
    { id: "status", method: "GET", path: "/v1/status", color: "green" },
  ];
  const ApiTabs = ({ id, tabs }) => (
    <div style={{ display: "flex", gap: 0, marginBottom: 16, borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
      {tabs.map(t => (
        <button key={t} onClick={() => setApiTabs(p => ({ ...p, [id]: t }))} style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 11, color: (apiTabs[id] || tabs[0]) === t ? "#76b900" : "#555", padding: "8px 16px", border: "none", borderBottom: (apiTabs[id] || tabs[0]) === t ? "2px solid #76b900" : "2px solid transparent", marginBottom: -1, cursor: "pointer", background: "transparent", letterSpacing: ".05em" }}>{t}</button>
      ))}
    </div>
  );
  const Code = ({ children }) => <div style={{ background: "#111", border: "1px solid rgba(255,255,255,0.15)", borderLeft: "2px solid #76b900", padding: "18px 20px", margin: "16px 0", fontFamily: "'Share Tech Mono', monospace", fontSize: 12, color: "#a0a0a0", lineHeight: 1.8, overflowX: "auto", whiteSpace: "pre" }}>{children}</div>;
  const ParamTable = ({ rows }) => (
    <table style={{ width: "100%", borderCollapse: "collapse", margin: "16px 0" }}>
      <thead><tr>{["Parameter", "Type", "Required", "Description"].map((h, i) => <th key={i} style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 10, color: "#555", letterSpacing: ".1em", textTransform: "uppercase", padding: "10px 14px", textAlign: "left", borderBottom: "1px solid rgba(255,255,255,0.15)", background: "#111" }}>{h}</th>)}</tr></thead>
      <tbody>{rows.map((r, i) => <tr key={i}>{r.map((c, j) => <td key={j} style={{ padding: "10px 14px", fontSize: j === 0 ? 12 : 13, color: j === 2 ? "#f5a623" : j === 0 ? "#fff" : "#a0a0a0", fontFamily: j === 0 ? "'Share Tech Mono', monospace" : "'Barlow', sans-serif", borderBottom: "1px solid rgba(255,255,255,0.08)", fontWeight: 300 }}>{c}</td>)}</tr>)}</tbody>
    </table>
  );
  return (
    <div>
      <div style={{ padding: "48px 0 36px", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
        <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 11, color: "#76b900", letterSpacing: ".14em", marginBottom: 14, display: "flex", alignItems: "center", gap: 10 }}><span style={{ display: "block", width: 20, height: 2, background: "#76b900" }} />REST API · v1.0 · JSON</div>
        <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: "clamp(36px,5vw,58px)", fontWeight: 800, textTransform: "uppercase", letterSpacing: ".5px", lineHeight: 1, marginBottom: 10 }}>API <span style={{ color: "#76b900" }}>Reference</span></div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "240px 1fr", gap: 2, padding: "40px 0 80px" }}>
        <div style={{ background: "#0a0a0a", border: "1px solid rgba(255,255,255,0.08)", padding: 24, position: "sticky", top: 78, alignSelf: "start" }}>
          <CardLabel>Endpoints</CardLabel>
          <ul style={{ listStyle: "none" }}>
            {endpoints.map(ep => (
              <li key={ep.id} onClick={() => setActiveEp(ep.id)} style={{ borderLeft: `2px solid ${activeEp === ep.id ? "#76b900" : "rgba(255,255,255,0.15)"}`, padding: "8px 14px", marginBottom: 6, cursor: "pointer", background: activeEp === ep.id ? "#181818" : "transparent", transition: "all .15s" }}>
                <span style={{ ...getBadgeStyle(ep.color), padding: "2px 6px", fontFamily: "'Share Tech Mono', monospace", fontSize: 9, letterSpacing: ".06em", marginRight: 8 }}>{ep.method}</span>
                <span style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 11.5, color: activeEp === ep.id ? "#fff" : "#a0a0a0" }}>{ep.path}</span>
              </li>
            ))}
          </ul>
        </div>
        <div style={{ background: "#0a0a0a", border: "1px solid rgba(255,255,255,0.08)", borderLeft: "none", padding: 28 }}>
          {activeEp === "analyze" && <><div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 28, fontWeight: 800, textTransform: "uppercase", letterSpacing: ".5px", marginBottom: 6 }}>POST <span style={{ color: "#76b900" }}>/analyze</span></div><div style={{ fontSize: 13, color: "#a0a0a0", marginBottom: 22, fontWeight: 300 }}>Analyze a single URL or text block. Returns a full CredibilityResult object.</div><ApiTabs id="analyze" tabs={["params", "request", "response"]} />{((apiTabs as any).analyze || "params") === "params" && <ParamTable rows={[["url", "string", "REQUIRED*", "Article URL to fetch and analyze"], ["text", "string", "REQUIRED*", "Raw article text. Min 100 chars"], ["include_preview", "boolean", "", "Include highlighted preview. Default: true"], ["max_claims", "integer", "", "Max claims to fact-check. Default: 5"]]} />}{(apiTabs as any).analyze === "request" && <Code>{`POST /v1/analyze\nX-API-Key: vrt_demo_a8f3d2e1\nContent-Type: application/json\n\n{\n  "url": "https://reuters.com/article/..."\n}`}</Code>}{(apiTabs as any).analyze === "response" && <Code>{`{\n  "score": 84,\n  "verdict": "VERIFIED",\n  "label": "Highly Credible",\n  "signals": { "fact_check": 88, "source_reliability": 95 },\n  "processed_ms": 4821\n}`}</Code>}</>}
          {activeEp === "status" && <><div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 28, fontWeight: 800, textTransform: "uppercase", letterSpacing: ".5px", marginBottom: 6 }}>GET <span style={{ color: "#76b900" }}>/status</span></div><Code>{`{\n  "status": "operational",\n  "pipeline_latency_ms": 4200,\n  "quota": { "used_today": 12, "limit_day": 100 },\n  "version": "1.0.0"\n}`}</Code></>}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════
   ROOT APP
═══════════════════════════════════════ */
export default function VeritAIApp() {
  const [page, setPage] = useState("home");
  const [history, setHistory] = useState<any[]>([]);
  const [dark, setDark] = useState(true);
  const { user, loading: authLoading, logout } = useAuth();

  // ── Guard: redirect to login if trying to access protected page ──────────
  const PROTECTED = ["analyzer", "history", "features", "docs", "api", "settings"];
  const navigate = (dest) => {
    if (PROTECTED.includes(dest) && !user) {
      setPage("login");
      return;
    }
    setPage(dest);
  };

  const addToHistory = (data, type) => {
    const now = new Date();
    setHistory(prev => [{
      id: Date.now(), type,
      domain: data.source.name, url: data.url, score: data.score,
      verdict: data.verdict, verdictClass: data.verdictClass, gaugeColor: data.gaugeColor,
      claims: data.stats.claims, disputed: data.stats.disputed,
      time: now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      date: now.toLocaleDateString([], { month: "short", day: "numeric" })
    }, ...prev]);
  };

  const bg = dark ? "#000" : "#f8f8f5";
  const fg = dark ? "#fff" : "#0a0a0a";
  const navBg = dark ? "#000" : "#fff";
  const border = dark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.1)";
  const muted = dark ? "#a0a0a0" : "#666";

  const isFullPage = ["home", "login", "404"].includes(page);
  const isSettings = page === "settings";

  // Loading screen while restoring session
  if (authLoading) {
    return (
      <div style={{ minHeight: "100vh", background: "#000", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 16 }}>
        <div style={{ width: 200, height: 2, background: "#1a1a1a", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", left: "-100%", top: 0, bottom: 0, width: "100%", background: "#76b900", animation: "scanBar 1.2s ease-in-out infinite" }} />
        </div>
        <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 11, color: "#76b900", letterSpacing: ".1em" }}>RESTORING SESSION...</div>
        <style>{`@keyframes scanBar { 0% { left: -100%; } 100% { left: 100%; } }`}</style>
      </div>
    );
  }

  const navPages = [
    ["home", "Home"],
    ["analyzer", "Analyzer"],
    ["history", "History"],
    ["features", "Features"],
    ["docs", "Docs"],
    ["api", "API"],
  ];

  return (
    <ThemeCtx.Provider value={{ dark, toggle: () => setDark(d => !d) }}>
      <>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,400&family=Barlow:wght@300;400;500;600&family=Barlow+Semi+Condensed:wght@400;500;600&family=Share+Tech+Mono&display=swap');
          * { box-sizing: border-box; margin: 0; padding: 0; }
          body { background: ${bg}; color: ${fg}; font-family: 'Barlow', sans-serif; transition: background .3s, color .3s; }
          @keyframes scanBar { 0% { left: -100%; } 100% { left: 100%; } }
          @keyframes fadeIn { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
          @keyframes ticker { from { transform: translateX(0); } to { transform: translateX(-33.33%); } }
          .hl-claim { background: rgba(0,168,224,.15); padding: 0 2px; color: #00a8e0; }
          .hl-bad { background: rgba(229,57,53,.15); padding: 0 2px; color: #e53935; }
          .hl-good { background: rgba(118,185,0,.15); padding: 0 2px; color: #76b900; }
          ::-webkit-scrollbar { width: 4px; height: 4px; }
          ::-webkit-scrollbar-track { background: ${dark ? "#0a0a0a" : "#e8e8e4"}; }
          ::-webkit-scrollbar-thumb { background: ${dark ? "#333" : "#bbb"}; }
        `}</style>

        {/* Top Ticker */}
        <div style={{ background: "#76b900", padding: "7px 32px" }}>
          <div style={{ maxWidth: 1080, margin: "0 auto", fontFamily: "'Barlow Semi Condensed', sans-serif", fontSize: 12, fontWeight: 600, color: "#000", letterSpacing: ".3px", display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 9 }}>▶</span>
            AI-POWERED CONTENT INTEGRITY ANALYSIS — REAL-TIME FACT VERIFICATION ENGINE
          </div>
        </div>

        {/* Nav */}
        <nav style={{ background: navBg, borderBottom: `1px solid ${border}`, position: "sticky", top: 0, zIndex: 200, transition: "background .3s" }}>
          <div style={{ maxWidth: 1080, margin: "0 auto", padding: "0 24px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 58 }}>
            {/* Logo */}
            <div style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer", flexShrink: 0 }} onClick={() => setPage("home")}>
              <div style={{ width: 32, height: 32, background: "#76b900", clipPath: "polygon(0 0,100% 0,100% 70%,70% 100%,0 100%)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Barlow Condensed', sans-serif", fontSize: 12, fontWeight: 800, color: "#000" }}>V</div>
              <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 20, fontWeight: 800, letterSpacing: 1, textTransform: "uppercase", color: fg }}>Verit<span style={{ color: "#76b900" }}>AI</span></div>
            </div>

            {/* Nav Links */}
            <div style={{ display: "flex", gap: 0 }}>
              {navPages.map(([p, l]) => {
                const locked = PROTECTED.includes(p) && !user;
                return (
                  <button key={p} onClick={() => navigate(p)}
                    style={{ fontFamily: "'Barlow Semi Condensed', sans-serif", fontSize: 13, fontWeight: 500, color: page === p ? "#76b900" : locked ? "#333" : muted, padding: "0 14px", height: 58, display: "flex", alignItems: "center", gap: 4, border: "none", borderBottom: page === p ? "2px solid #76b900" : "2px solid transparent", marginBottom: -1, background: "transparent", cursor: "pointer", letterSpacing: ".3px", transition: "color .15s" }}>
                    {l}
                    {locked && <span style={{ fontSize: 9, color: "#333" }}>🔒</span>}
                  </button>
                );
              })}
            </div>

            {/* Right controls */}
            <div style={{ display: "flex", alignItems: "center", gap: 6, flexShrink: 0 }}>
              {/* Theme toggle */}
              <button onClick={() => setDark(d => !d)}
                style={{ background: "transparent", border: `1px solid ${border}`, padding: "6px 10px", cursor: "pointer", color: muted, fontFamily: "'Share Tech Mono', monospace", fontSize: 13, lineHeight: 1, transition: "all .15s" }} title="Toggle theme">
                {dark ? "☀" : "◑"}
              </button>

              {/* Settings — only for logged-in users */}
              {user && (
                <button onClick={() => setPage("settings")}
                  style={{ background: page === "settings" ? "rgba(118,185,0,.1)" : "transparent", border: `1px solid ${page === "settings" ? "#76b900" : border}`, padding: "6px 10px", cursor: "pointer", color: page === "settings" ? "#76b900" : muted, fontFamily: "'Share Tech Mono', monospace", fontSize: 13, lineHeight: 1, transition: "all .15s" }} title="Settings">
                  ⚙
                </button>
              )}

              {/* Auth area */}
              {user ? (
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  {/* Avatar */}
                  <div style={{ width: 32, height: 32, background: user.provider === "google" ? "rgba(66,133,244,.15)" : "rgba(118,185,0,.15)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Barlow Condensed', sans-serif", fontSize: 12, fontWeight: 800, color: user.provider === "google" ? "#4285f4" : "#76b900", flexShrink: 0, position: "relative" }} title={`${user.name} · ${user.role}`}>
                    {user.avatar}
                    {user.provider === "google" && (
                      <div style={{ position: "absolute", bottom: -2, right: -2, width: 10, height: 10, background: "#fff", borderRadius: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <svg width="8" height="8" viewBox="0 0 18 18"><path d="M17.64 9.205c0-.639-.057-1.252-.164-1.841H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615Z" fill="#4285F4"/><path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18Z" fill="#34A853"/><path d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332Z" fill="#FBBC05"/><path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58Z" fill="#EA4335"/></svg>
                      </div>
                    )}
                  </div>
                  {/* Name */}
                  <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 10, color: muted, maxWidth: 80, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{user.name.split(" ")[0]}</div>
                  {/* Sign Out */}
                  <button onClick={logout}
                    style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 11, color: "#e53935", border: "1px solid rgba(229,57,53,.35)", background: "transparent", padding: "6px 12px", cursor: "pointer", letterSpacing: ".04em", transition: "all .15s" }}
                    onMouseEnter={e => { e.currentTarget.style.background = "rgba(229,57,53,.1)"; }}
                    onMouseLeave={e => { e.currentTarget.style.background = "transparent"; }}>
                    SIGN OUT
                  </button>
                </div>
              ) : (
                <button onClick={() => setPage("login")}
                  style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 13, fontWeight: 700, color: "#000", background: "#76b900", border: "none", padding: "8px 18px", cursor: "pointer", textTransform: "uppercase", letterSpacing: ".5px", transition: "opacity .15s" }}
                  onMouseEnter={e => e.currentTarget.style.opacity = ".85"}
                  onMouseLeave={e => e.currentTarget.style.opacity = "1"}>
                  SIGN IN
                </button>
              )}
            </div>
          </div>
        </nav>

        {/* ── PAGE ROUTER ─────────────────────────────────────────────────── */}

        {/* Public full-page routes */}
        {page === "home" && <LandingPage onNavigate={navigate} />}
        {page === "login" && <LoginPage onNavigate={(dest) => { if (dest === "analyzer" && user) { setPage("analyzer"); } else { setPage(dest); } }} />}
        {page === "404" && <NotFoundPage onNavigate={setPage} />}

        {/* Settings (protected, full-width) */}
        {page === "settings" && user && <SettingsPage onNavigate={setPage} />}
        {page === "settings" && !user && <LoginPage onNavigate={(dest) => setPage(dest)} />}

        {/* Protected app pages with login wall */}
        {PROTECTED.filter(p => p !== "settings").includes(page) && (
          user ? (
            <div style={{ maxWidth: 1080, margin: "0 auto", padding: "0 32px", background: bg, minHeight: "70vh" }}>
              {page === "analyzer" && <AnalyzerPage onAnalysis={addToHistory} />}
              {page === "history" && <HistoryPage history={history} onClear={() => setHistory([])} onRerun={() => setPage("analyzer")} />}
              {page === "features" && <FeaturesPage />}
              {page === "docs" && <DocsPage />}
              {page === "api" && <ApiPage />}
            </div>
          ) : (
            /* Login wall — shown when accessing a protected route while logged out */
            <div style={{ minHeight: "60vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 32, textAlign: "center", background: bg }}>
              <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 64, fontWeight: 800, color: dark ? "#1a1a1a" : "#e0e0e0", marginBottom: 16, lineHeight: 1 }}>🔒</div>
              <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 32, fontWeight: 800, textTransform: "uppercase", color: fg, marginBottom: 8 }}>Sign In Required</div>
              <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 12, color: "#555", letterSpacing: ".06em", marginBottom: 28, lineHeight: 1.8 }}>
                // THIS SECTION REQUIRES AUTHENTICATION<br />
                // PLEASE SIGN IN TO CONTINUE
              </div>
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center" }}>
                <button onClick={() => setPage("login")} style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 14, fontWeight: 800, textTransform: "uppercase", letterSpacing: 1, color: "#000", background: "#76b900", border: "none", padding: "12px 28px", cursor: "pointer" }}>SIGN IN →</button>
                <button onClick={() => setPage("home")} style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 14, fontWeight: 800, textTransform: "uppercase", letterSpacing: 1, color: "#76b900", background: "transparent", border: "1px solid #76b900", padding: "12px 28px", cursor: "pointer" }}>← HOME</button>
              </div>
            </div>
          )
        )}

        {/* Unknown routes → 404 */}
        {!["home", "login", "settings", "404", ...navPages.map(([p]) => p)].includes(page) && <NotFoundPage onNavigate={setPage} />}

      </>
    </ThemeCtx.Provider>
  );
}
