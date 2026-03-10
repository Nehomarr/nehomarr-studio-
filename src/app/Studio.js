"use client";
import { useState, useEffect, useRef } from "react";

// ── THEMES ─────────────────────────────────────────────
const THEMES = {
  dark: {
    bg: "#080808", surface: "#0f0f0f", border: "#222", headerBg: "#080808",
    text: "#f0e8d8", muted: "#444", faint: "#1a1a1a", cardBg: "#0c0c0c",
    cardHeader: "#111", input: "#0c0c0c", inputBorder: "#1e1e1e",
    subtext: "#aaa", error: "#e06060", errorBg: "#110808", errorBorder: "#3a1a1a",
  },
  light: {
    bg: "#f0ebe0", surface: "#fff", border: "#d0c8bc", headerBg: "#f0ebe0",
    text: "#0a0800", muted: "#888", faint: "#e0d8cc", cardBg: "#fff",
    cardHeader: "#faf5ee", input: "#fff", inputBorder: "#d0c8bc",
    subtext: "#333", error: "#c0392b", errorBg: "#fff0f0", errorBorder: "#f5c0c0",
  }
};

// ── TOKEN UTILS ────────────────────────────────────────
const estimateTokens = (str) => Math.ceil((str || "").length / 4);
const MAX_BRIEF_TOKENS = 1800;
const MAX_CONTEXT_TOKENS = 600;

// ── CONSTANTS ──────────────────────────────────────────
const FORMAT_OPTIONS = [
  { id: "spot", label: "Spot TV / Video", icon: "▶" },
  { id: "360", label: "Campaña 360°", icon: "◎" },
  { id: "brand_film", label: "Brand Film", icon: "◑" },
  { id: "social", label: "Redes Sociales", icon: "◈" },
  { id: "photo", label: "Photo Shoot", icon: "◻" },
  { id: "ooh", label: "OOH / Impresos", icon: "▦" },
  { id: "launch", label: "Lanzamiento", icon: "✦" },
  { id: "event", label: "Activación", icon: "→" },
  { id: "podcast", label: "Podcast / Audio", icon: "♩" },
  { id: "email_mkt", label: "Email Mkt", icon: "✉" },
  { id: "influencer", label: "Influencer", icon: "◈" },
  { id: "retail", label: "Retail / POS", icon: "▦" },
];

const OUTREACH_TARGETS = [
  { id: "brand", label: "Marca / Brand" }, { id: "agency", label: "Agencia Creativa" },
  { id: "production", label: "Productora" }, { id: "cd", label: "Creative Director" },
  { id: "brand_manager", label: "Brand Manager" }, { id: "marketing", label: "Marketing Director" }
];
const OUTREACH_PLATFORMS = [
  { id: "instagram", label: "Instagram DM" }, { id: "linkedin", label: "LinkedIn" }, { id: "email", label: "Email" }
];
const OUTREACH_GOALS = [
  { id: "collab", label: "Proponer colaboración" }, { id: "pitch", label: "Pedir reunión" },
  { id: "introduce", label: "Presentarme" }, { id: "followup", label: "Follow-up" }
];

const TREATMENT_SECTIONS = {
  campaign_concept: { icon: "✦", label: "Director's Letter" },
  territory_tone: { icon: "◈", label: "Territory & Tone" },
  brand_voice: { icon: "◎", label: "Brand Voice" },
  narrative: { icon: "◑", label: "Narrative Arc" },
  format_breakdown: { icon: "▦", label: "Format Breakdown" },
  visual_references: { icon: "◻", label: "Visual References" },
  cinematography: { icon: "→", label: "Cinematography & Lighting" },
  planimetry: { icon: "◈", label: "Planimetry & Framing" },
  photo_direction: { icon: "◻", label: "Photo Direction" },
  casting: { icon: "◎", label: "Casting & Characters" },
  locations: { icon: "◑", label: "Locations & Set Design" },
  music: { icon: "♩", label: "Music & Sound" },
  cta: { icon: "→", label: "Call to Action" },
};
const FIGMA_SECTIONS = {
  deck_concept: { icon: "✦", label: "Deck Concept & Mood" },
  color_palette: { icon: "◈", label: "Color Palette" },
  typography: { icon: "◎", label: "Typography System" },
  page_layout: { icon: "▦", label: "Page-by-Page Layout" },
  image_guide: { icon: "◑", label: "Image Search Guide" },
  design_tips: { icon: "◻", label: "Design Tips" },
};
const PITCH_SECTIONS = {
  cover_letter: { icon: "✦", label: "Cover Letter" },
  next_steps: { icon: "→", label: "Next Steps & Timeline" },
};
const EXEC_SUMMARY_SECTIONS = {
  one_liner: { icon: "✦", label: "One Liner" },
  business_case: { icon: "◈", label: "Business Case" },
  competitive_edge: { icon: "◎", label: "Competitive Edge" },
  deliverables: { icon: "▦", label: "Deliverables" },
  timeline: { icon: "◑", label: "Timeline" },
  revision_policy: { icon: "◻", label: "Revision Policy" },
  next_action: { icon: "→", label: "Next Action" },
};
const VISUAL_DOC_SECTIONS = {
  doc_concept: { icon: "✦", label: "Document Concept" },
  cover_page: { icon: "◈", label: "Cover Page" },
  statement_page: { icon: "◎", label: "Director's Statement Page" },
  section_pages: { icon: "▦", label: "Section Pages Template" },
  reference_pages: { icon: "◑", label: "Reference Pages" },
  closing_page: { icon: "◻", label: "Closing Page" },
  typography_system: { icon: "Aa", label: "Typography System" },
  color_system: { icon: "◉", label: "Color System" },
  image_direction: { icon: "→", label: "Image Direction" },
  production_notes: { icon: "⚠", label: "Production Notes" },
};
const CONCEPT_VERSIONS_SECTIONS = {
  versions_intro: { icon: "◎", label: "Versions Logic" },
  version_a_title: { icon: "✦", label: "Version A — Title" },
  version_a_concept: { icon: "◑", label: "Version A — Concept" },
  version_a_production: { icon: "▦", label: "Version A — Production" },
  version_a_integrity: { icon: "◻", label: "Version A — Why It Works" },
  version_b_title: { icon: "✦", label: "Version B — Title" },
  version_b_concept: { icon: "◑", label: "Version B — Concept" },
  version_b_production: { icon: "▦", label: "Version B — Production" },
  version_b_integrity: { icon: "◻", label: "Version B — Why It Works" },
  version_c_title: { icon: "✦", label: "Version C — Title" },
  version_c_concept: { icon: "◑", label: "Version C — Concept" },
  version_c_production: { icon: "▦", label: "Version C — Production" },
  version_c_integrity: { icon: "◻", label: "Version C — Why It Works" },
  recommendation: { icon: "→", label: "NEHOMARR Recommends" },
};

const TOOLS_LIST = [
  { id: "ratecard", icon: "◈", label: "Rate Card" },
  { id: "shotlist", icon: "▶", label: "Shot List" },
  { id: "casestudy", icon: "◎", label: "Case Study" },
  { id: "bio", icon: "✦", label: "Bio Generator" },
  { id: "moodboard", icon: "◻", label: "Mood Board" },
  { id: "preproduction", icon: "▦", label: "Pre-Production" },
];

// ── FLATTEN ────────────────────────────────────────────
const flattenValue = (val) => {
  if (typeof val === "string") return val;
  if (Array.isArray(val)) return val.map((v, i) => `${i + 1}. ${flattenValue(v)}`).join("\n");
  if (typeof val === "object" && val !== null)
    return Object.entries(val).map(([k, v]) => `${k.replace(/_/g, " ").toUpperCase()}\n${flattenValue(v)}`).join("\n\n");
  return String(val ?? "");
};

// ── API — calls internal Next.js route (key stays server-side) ────
const callClaude = async (system, userMsg, { onProgress, signal } = {}) => {
  let res;
  try {
    res = await fetch("/api/claude", {
      method: "POST",
      signal,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 2048,
        stream: true,
        system,
        messages: [{ role: "user", content: userMsg }],
      }),
    });
  } catch (err) {
    if (err.name === "AbortError") throw new Error("CANCELLED");
    throw new Error("No se pudo conectar con la API. Verifica tu conexión.");
  }

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    if (res.status === 401) throw new Error("API key inválida. Verifica tus permisos en Vercel.");
    if (res.status === 429) throw new Error("Rate limit alcanzado. Espera un momento y reintenta.");
    if (res.status === 529) throw new Error("API sobrecargada. Reintenta en unos segundos.");
    throw new Error(`Error de API: ${res.status}. ${body.slice(0, 150)}`);
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let full = "";
  let outputChars = 0;
  const expectedChars = 7000;
  const startMs = Date.now();
  let lastChunkTime = Date.now();

  while (true) {
    const nowMs = Date.now();
    if (nowMs - startMs > 90000) { reader.cancel(); throw new Error("Timeout (90s). Reintenta o simplifica el brief."); }
    if (full.length > 100 && nowMs - lastChunkTime > 25000) { reader.cancel(); break; }

    let chunk;
    try { chunk = await reader.read(); } catch (err) {
      if (err.name === "AbortError") throw new Error("CANCELLED");
      break;
    }
    const { done, value } = chunk;
    if (done) break;
    lastChunkTime = Date.now();

    const lines = decoder.decode(value, { stream: true }).split("\n").filter(l => l.startsWith("data: "));
    for (const line of lines) {
      const data = line.slice(6);
      if (data === "[DONE]") continue;
      try {
        const d = JSON.parse(data);
        const t = d.delta?.text || "";
        if (t) {
          full += t;
          outputChars += t.length;
          if (onProgress) onProgress(Math.min(Math.round((outputChars / expectedChars) * 100), 97));
        }
      } catch { }
    }
  }

  if (!full.trim()) throw new Error("La API no devolvió contenido. Intenta de nuevo.");

  let clean = full.trim().replace(/^```json\s*/i, "").replace(/^```\s*/i, "").replace(/```\s*$/g, "").trim();
  try {
    return JSON.parse(clean);
  } catch {
    const match = clean.match(/\{[\s\S]*\}/);
    if (match) { try { return JSON.parse(match[0]); } catch { } }
    throw new Error("Respuesta inválida. Intenta simplificar el brief e inténtalo de nuevo.");
  }
};

// ── PROMPTS ────────────────────────────────────────────
const P_TREATMENT = (formats) =>
  `You are NEHOMARR — world-class creative director and cinematographer, founder of BeDangerous / Facilitators. Treatments in the style of: Acuvue Oasys, Budweiser, Porsche, Suzuki, Tickmill.

A TREATMENT IS NOT A SCRIPT. It is the DIRECTOR'S VOICE. Sound like someone already on set.

WRITING RULES: First person. CAPS titles. Strong CLAIMS in caps, 1-2 lines. Lowercase cinematic prose. Zero empty adjectives. Concrete cultural references: directors, DPs, photographers, films.

Formats: ${formats}.
CRITICAL: Return ONLY a valid flat JSON object. All values must be plain strings. No nested objects, no arrays, no markdown, no backticks, no explanation outside JSON.
Keys: campaign_concept, territory_tone, brand_voice, narrative, format_breakdown, visual_references, cinematography, planimetry, photo_direction, casting, locations, music, cta`;

const P_FIGMA =
  `You are NEHOMARR's design director at BeDangerous / Facilitators.
CRITICAL: Return ONLY a valid flat JSON object. Plain strings only. No nested objects, no markdown, no backticks.
Keys: deck_concept, color_palette, typography, page_layout, image_guide, design_tips`;

const P_PITCH =
  `You are NEHOMARR, founder of BeDangerous / Facilitators.
CRITICAL: Return ONLY a valid flat JSON object. Plain strings only. No nested objects, no markdown, no backticks.
Keys: cover_letter, next_steps`;

const P_EXEC = (formats) =>
  `You are NEHOMARR. Executive summary for C-suite. Business language. Formats: ${formats}.
CRITICAL: Return ONLY a valid flat JSON object. Plain strings only. No nested objects, no markdown, no backticks.
Keys: one_liner, business_case, competitive_edge, deliverables, timeline, revision_policy, next_action`;

const P_VISUAL_DOC = (formats) =>
  `You are NEHOMARR's art director at BeDangerous / Facilitators. Visual treatment document guide. Formats: ${formats}.
CRITICAL: Return ONLY a valid flat JSON object. Plain strings only. No nested objects, no markdown, no backticks.
Keys: doc_concept, cover_page, statement_page, section_pages, reference_pages, closing_page, typography_system, color_system, image_direction, production_notes`;

const P_VERSIONS = (formats) =>
  `You are NEHOMARR. Three concept versions at different production scales. Formats: ${formats}.
CRITICAL: Return ONLY a valid flat JSON object. Plain strings only. No nested objects, no markdown, no backticks.
Keys: versions_intro, version_a_title, version_a_concept, version_a_production, version_a_integrity, version_b_title, version_b_concept, version_b_production, version_b_integrity, version_c_title, version_c_concept, version_c_production, version_c_integrity, recommendation`;

const P_OUTREACH = (platform, target, goal, context) =>
  `You are NEHOMARR, founder of BeDangerous / Facilitators. Write a ${platform} message to a ${target}. Goal: ${goal}. Context: ${context || "None."}
Tone: confident creative peer, never desperate. Sign as NEHOMARR — BeDangerous / Facilitators.
CRITICAL: Return ONLY valid JSON. ${platform === "Email" ? '{"subject":"...","body":"..."}' : '{"body":"..."}'}
No markdown, no backticks, no explanation.`;

const P_RATE_CARD =
  `You are NEHOMARR's business director at BeDangerous / Facilitators. Professional rate card for the international market.
CRITICAL: Return ONLY a valid flat JSON object. Plain strings only. No nested objects, no markdown, no backticks.
Keys: intro, day_rates, project_packages, usage_rights, payment_terms, notes`;

const P_SHOTLIST = (formats) =>
  `You are NEHOMARR, cinematographer at BeDangerous / Facilitators. Shot list for: ${formats}.
CRITICAL: Return ONLY a valid flat JSON object. Plain strings only. No nested objects, no markdown, no backticks.
Keys: overview, scene_breakdown, equipment_list, lighting_notes, crew_notes, shooting_order`;

const P_CASESTUDY =
  `You are NEHOMARR's brand strategist at BeDangerous / Facilitators. Portfolio case study.
CRITICAL: Return ONLY a valid flat JSON object. Plain strings only. No nested objects, no markdown, no backticks.
Keys: headline, challenge, approach, execution, results, impact, quote, tags`;

const P_BIO =
  `You are NEHOMARR's brand voice at BeDangerous / Facilitators. Professional bios for all platforms.
CRITICAL: Return ONLY a valid flat JSON object. Plain strings only. No nested objects, no markdown, no backticks.
Keys: instagram, linkedin, proposal, web_short, web_long`;

const P_MOODBOARD = (formats) =>
  `You are NEHOMARR's art director at BeDangerous / Facilitators. Mood board descriptor for: ${formats}.
CRITICAL: Return ONLY a valid flat JSON object. Plain strings only. No nested objects, no markdown, no backticks.
Keys: concept, hero_images, texture_details, color_story, typography_feel, layout_guide, references`;

const P_PREPRODUCTION = (formats) =>
  `You are NEHOMARR's production manager at BeDangerous / Facilitators. Pre-production checklist for: ${formats}.
CRITICAL: Return ONLY a valid flat JSON object. Plain strings only. No nested objects, no markdown, no backticks.
Keys: creative, logistics, talent, technical, locations, legal, timeline, red_flags`;

const P_FOLLOWUP = (platform, days, context) =>
  `You are NEHOMARR. Pitch follow-up. Platform: ${platform}. Days since pitch: ${days}. Context: ${context || "None."}
Confident, gentle urgency. Sign as NEHOMARR — BeDangerous / Facilitators.
CRITICAL: Return ONLY valid JSON. ${platform === "Email" ? '{"subject":"...","body":"..."}' : '{"body":"..."}'}
No markdown, no backticks.`;

// ── SHARED UI ──────────────────────────────────────────
function Label({ T, children }) {
  return (
    <label style={{ display: "block", fontSize: 9, letterSpacing: "0.35em", color: T.text, marginBottom: 10, fontFamily: "'Arial Black', Impact, sans-serif", fontWeight: 900 }}>
      {children}
    </label>
  );
}

function Input({ T, value, onChange, placeholder }) {
  return (
    <input
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      style={{ width: "100%", background: T.input, border: `1px solid ${T.inputBorder}`, borderLeft: `3px solid ${T.border}`, color: T.text, fontSize: 13, padding: "11px 14px", fontFamily: "Georgia, serif", outline: "none", boxSizing: "border-box" }}
      onFocus={e => e.target.style.borderLeftColor = T.text}
      onBlur={e => e.target.style.borderLeftColor = T.border}
    />
  );
}

function TextArea({ T, value, onChange, placeholder, minHeight = 140 }) {
  return (
    <textarea
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      style={{ width: "100%", minHeight, background: T.input, border: `1px solid ${T.inputBorder}`, borderLeft: `3px solid ${T.border}`, color: T.text, fontSize: 13, lineHeight: 1.8, padding: 14, fontFamily: "Georgia, serif", resize: "vertical", outline: "none", boxSizing: "border-box" }}
      onFocus={e => e.target.style.borderLeftColor = T.text}
      onBlur={e => e.target.style.borderLeftColor = T.border}
    />
  );
}

function Pill({ T, active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      style={{ padding: "7px 14px", border: active ? `2px solid ${T.text}` : `1px solid ${T.border}`, background: active ? T.text : "transparent", color: active ? T.bg : T.muted, cursor: "pointer", fontSize: 10, letterSpacing: "0.08em", fontFamily: "'Arial Black', Impact, sans-serif", fontWeight: active ? 900 : 400, transition: "all 0.15s" }}
    >
      {children}
    </button>
  );
}

function GenerateBtn({ T, onClick, disabled, loading, label }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{ width: "100%", padding: "15px 0", background: !disabled ? T.text : T.faint, border: "none", color: !disabled ? T.bg : T.muted, fontSize: 11, letterSpacing: "0.32em", fontFamily: "'Arial Black', Impact, sans-serif", fontWeight: 900, cursor: !disabled ? "pointer" : "not-allowed", transition: "all 0.2s" }}
    >
      {loading ? "⟳  GENERATING..." : label}
    </button>
  );
}

function TokenWarning({ T, tokens, max }) {
  const pct = Math.min((tokens / max) * 100, 100);
  const over = tokens > max;
  const near = tokens > max * 0.75;
  if (!near) return null;
  return (
    <div style={{ padding: "10px 14px", marginBottom: 14, border: `1px solid ${over ? T.errorBorder : T.border}`, background: over ? T.errorBg : T.faint, fontFamily: "monospace", fontSize: 10 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
        <span style={{ color: over ? T.error : T.muted }}>
          {over ? "⚠ BRIEF DEMASIADO LARGO — reduce el texto" : "⚠ Brief largo — considera resumir"}
        </span>
        <span style={{ color: over ? T.error : T.muted }}>{tokens} / {max} tokens</span>
      </div>
      <div style={{ height: 3, background: T.border }}>
        <div style={{ height: "100%", width: `${pct}%`, background: over ? T.error : T.muted }} />
      </div>
      {over && <div style={{ marginTop: 8, color: T.error, fontSize: 9, lineHeight: 1.6 }}>Resume a: marca, objetivo, público, tono.</div>}
    </div>
  );
}

function ErrorBox({ T, msg, onRetry }) {
  if (!msg || msg === "CANCELLED") return null;
  return (
    <div style={{ color: T.error, fontSize: 11, marginBottom: 14, padding: 14, border: `1px solid ${T.errorBorder}`, background: T.errorBg, fontFamily: "monospace", lineHeight: 1.6 }}>
      <div style={{ marginBottom: onRetry ? 10 : 0 }}>{msg}</div>
      {onRetry && (
        <button onClick={onRetry} style={{ background: "transparent", border: `1px solid ${T.errorBorder}`, color: T.error, fontSize: 9, padding: "4px 12px", cursor: "pointer", fontFamily: "'Arial Black', Impact, sans-serif", letterSpacing: "0.2em" }}>
          REINTENTAR
        </button>
      )}
    </div>
  );
}

function SectionCard({ T, meta, value, copied, onCopy }) {
  return (
    <div style={{ background: T.cardBg, border: `1px solid ${T.border}`, borderLeft: `3px solid ${T.text}`, overflow: "hidden" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "9px 16px", borderBottom: `1px solid ${T.border}`, background: T.cardHeader }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ background: T.text, color: T.bg, fontSize: 9, padding: "2px 6px", fontFamily: "'Arial Black', Impact, sans-serif", fontWeight: 900 }}>{meta.icon}</span>
          <span style={{ fontFamily: "'Arial Black', Impact, sans-serif", fontSize: 9, letterSpacing: "0.22em", color: T.muted, fontWeight: 700 }}>{meta.label.toUpperCase()}</span>
        </div>
        <button
          onClick={onCopy}
          style={{ background: copied ? T.text : "transparent", border: `1px solid ${copied ? T.text : T.border}`, color: copied ? T.bg : T.muted, fontSize: 8, padding: "3px 10px", cursor: "pointer", fontFamily: "monospace", letterSpacing: "0.15em", transition: "all 0.15s" }}
        >
          {copied ? "✓ COPIED" : "COPY"}
        </button>
      </div>
      <div style={{ padding: "15px 16px", fontSize: 13, lineHeight: 1.9, color: T.subtext, whiteSpace: "pre-wrap", fontFamily: "Georgia, 'Times New Roman', serif" }}>
        {flattenValue(value)}
      </div>
    </div>
  );
}

function ActionBar({ T, onCopy, copied, onNew, newLabel = "NEW PROJECT" }) {
  return (
    <div style={{ display: "flex", gap: 0, marginTop: 8 }}>
      <button
        onClick={onCopy}
        style={{ flex: 2, padding: "13px 0", background: copied ? T.text : "transparent", border: `2px solid ${T.text}`, borderRight: "none", color: copied ? T.bg : T.text, fontSize: 10, letterSpacing: "0.28em", fontFamily: "'Arial Black', Impact, sans-serif", fontWeight: 900, cursor: "pointer", transition: "all 0.15s" }}
      >
        {copied ? "✓ COPIED" : "COPY ALL  ✦"}
      </button>
      <button
        onClick={onNew}
        style={{ flex: 1, padding: "13px 0", background: "transparent", border: `2px solid ${T.border}`, color: T.muted, fontSize: 10, letterSpacing: "0.22em", fontFamily: "'Arial Black', Impact, sans-serif", fontWeight: 700, cursor: "pointer" }}
      >
        {newLabel}
      </button>
    </div>
  );
}

function ToolResult({ T, sections, data, onNew }) {
  const [copied, setCopied] = useState(null);
  const cp = (k, v) => { navigator.clipboard.writeText(flattenValue(v)); setCopied(k); setTimeout(() => setCopied(null), 1500); };
  const cpAll = () => {
    const txt = Object.entries(sections)
      .filter(([k]) => data[k])
      .map(([k, m]) => `${m.label.toUpperCase()}\n${"─".repeat(40)}\n${flattenValue(data[k])}`)
      .join("\n\n");
    navigator.clipboard.writeText(txt);
    setCopied("__all");
    setTimeout(() => setCopied(null), 1800);
  };
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      {Object.entries(sections).map(([k, m]) => data[k] && (
        <SectionCard key={k} T={T} meta={m} value={data[k]} copied={copied === k} onCopy={() => cp(k, data[k])} />
      ))}
      <ActionBar T={T} onCopy={cpAll} copied={copied === "__all"} onNew={onNew} />
    </div>
  );
}

// ── LOADER ─────────────────────────────────────────────
function Loader({ T, label, progress = 0, onCancel, startTime }) {
  const [tick, setTick] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const baseTime = useRef(startTime || Date.now());

  useEffect(() => {
    if (startTime) baseTime.current = startTime;
  }, [startTime]);

  useEffect(() => {
    const t = setInterval(() => {
      setTick(n => n + 1);
      const secs = Math.round((Date.now() - baseTime.current) / 1000);
      setElapsed(Math.max(0, Math.min(secs, 120)));
    }, 1000);
    return () => clearInterval(t);
  }, []);

  const phrases = ["READING THE BRIEF—", "FINDING THE ANGLE—", "LOADING THE LENS—", "BUILDING THE FRAME—", "DIRECTING NOW—", "WRITING THE VISION—", "CRAFTING THE VOICE—"];
  const isHanging = elapsed > 35 && progress < 5;

  const getETA = () => {
    if (progress <= 0) return "~20–35s";
    if (elapsed < 2) return "~20–35s";
    const projected = elapsed / (progress / 100);
    const remaining = Math.max(1, Math.round(projected - elapsed));
    if (remaining <= 3) return "casi listo—";
    if (remaining <= 10) return `~${remaining}s restantes`;
    return `~${remaining}s restantes`;
  };

  return (
    <div style={{ border: `1px solid ${T.border}`, borderLeft: `3px solid ${T.text}`, overflow: "hidden", background: T.cardBg }}>
      <div style={{ background: T.text, padding: "10px 18px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontFamily: "'Arial Black', Impact, sans-serif", fontSize: 10, fontWeight: 900, letterSpacing: "0.28em", color: T.bg }}>⟳ {label.toUpperCase()}</span>
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <span style={{ fontFamily: "monospace", fontSize: 9, color: T.bg, opacity: 0.7, letterSpacing: "0.1em" }}>
            {isHanging ? "API lenta—" : getETA()}
          </span>
          <span style={{ fontFamily: "monospace", fontSize: 9, color: T.bg, opacity: 0.4 }}>{elapsed}s</span>
        </div>
      </div>
      <div style={{ padding: "20px 18px 22px" }}>
        <div style={{ fontFamily: "'Arial Black', Impact, sans-serif", fontSize: "clamp(13px,2.5vw,18px)", fontWeight: 900, color: isHanging ? T.error : T.text, letterSpacing: "0.02em", marginBottom: 20, minHeight: 24 }}>
          {isHanging ? "WAITING FOR SERVER—" : phrases[tick % phrases.length]}
        </div>
        <div style={{ height: 6, background: T.faint, position: "relative", overflow: "hidden", marginBottom: 10 }}>
          <div style={{ position: "absolute", left: 0, top: 0, height: "100%", width: `${Math.min(progress, 99)}%`, background: T.text, transition: "width 0.4s ease-out" }} />
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontFamily: "monospace", fontSize: 9, letterSpacing: "0.12em" }}>
          <span style={{ color: isHanging ? T.error : T.muted }}>
            {isHanging
              ? "tarda más de lo normal — API puede estar lenta"
              : progress <= 0
                ? "conectando con la API—"
                : progress < 10
                  ? "iniciando stream—"
                  : "recibiendo respuesta—"}
          </span>
          <span style={{ fontFamily: "'Arial Black', Impact, sans-serif", fontSize: 13, fontWeight: 900, color: T.text }}>{Math.round(Math.min(progress, 99))}%</span>
        </div>
        {elapsed >= 10 && onCancel && (
          <button onClick={onCancel} style={{ marginTop: 16, width: "100%", padding: "10px 0", background: "transparent", border: `1px solid ${T.border}`, color: T.muted, fontSize: 9, letterSpacing: "0.2em", fontFamily: "'Arial Black', Impact, sans-serif", fontWeight: 700, cursor: "pointer" }}>
            CANCELAR
          </button>
        )}
      </div>
    </div>
  );
}

// ── HEADER ─────────────────────────────────────────────
const NAV = [{ id: "treatment", label: "TREATMENT" }, { id: "outreach", label: "OUTREACH" }, { id: "tools", label: "TOOLS" }];

function Header({ T, mode, setMode, section, setSection }) {
  return (
    <div style={{ background: T.headerBg, borderBottom: `2px solid ${T.border}` }}>
      <div style={{ background: T.text, padding: "0 24px", display: "flex", justifyContent: "space-between", alignItems: "center", height: 32 }}>
        <span style={{ fontFamily: "'Arial Black', Impact, sans-serif", fontSize: 9, fontWeight: 900, letterSpacing: "0.45em", color: T.bg }}>◈ BEDANGEROUS / FACILITATORS</span>
        <button onClick={() => setMode(m => m === "dark" ? "light" : "dark")} style={{ background: T.bg, border: "none", color: T.text, fontSize: 12, padding: "2px 8px", cursor: "pointer", fontFamily: "monospace" }}>
          {mode === "dark" ? "☀" : "☾"}
        </button>
      </div>
      <div style={{ maxWidth: 820, margin: "0 auto", padding: "0 24px" }}>
        <div style={{ padding: "20px 0 0", borderBottom: `1px solid ${T.border}` }}>
          <div style={{ fontFamily: "'Arial Black', Impact, sans-serif", fontSize: "clamp(28px, 6vw, 52px)", fontWeight: 900, lineHeight: 0.9, letterSpacing: "-0.02em", color: T.text, marginBottom: 8 }}>
            NEHOMARR<br />
            <span style={{ fontSize: "0.55em", letterSpacing: "0.08em", color: T.muted, fontWeight: 700 }}>TREATMENT STUDIO</span>
          </div>
          <div style={{ display: "flex", gap: 12, alignItems: "center", padding: "6px 0", borderTop: `1px solid ${T.border}` }}>
            <span style={{ fontFamily: "monospace", fontSize: 9, color: T.muted, letterSpacing: "0.2em" }}>ALL INDUSTRIES</span>
            <span style={{ color: T.faint }}>·</span>
            <span style={{ fontFamily: "monospace", fontSize: 9, color: T.muted, letterSpacing: "0.2em" }}>COMPLETE CREATIVE SYSTEM</span>
          </div>
        </div>
        <div style={{ display: "flex", gap: 0 }}>
          {NAV.map(s => (
            <button
              key={s.id}
              onClick={() => setSection(s.id)}
              style={{ padding: "12px 20px", background: section === s.id ? T.text : "transparent", border: "none", color: section === s.id ? T.bg : T.muted, fontSize: 10, letterSpacing: "0.28em", fontFamily: "'Arial Black', Impact, sans-serif", fontWeight: 900, cursor: "pointer", transition: "all 0.15s", borderRight: `1px solid ${T.border}` }}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── TREATMENT ──────────────────────────────────────────
function TreatmentSection({ T }) {
  const [brief, setBrief] = useState("");
  const [clientName, setClientName] = useState("");
  const [selectedFormats, setSelectedFormats] = useState(["spot"]);
  const [treatment, setTreatment] = useState(null);
  const [extras, setExtras] = useState({});
  const [loading, setLoading] = useState(false);
  const [loadingTab, setLoadingTab] = useState(null);
  const [progress, setProgress] = useState(0);
  const [startTime, setStartTime] = useState(null);
  const [error, setError] = useState(null);
  const [tab, setTab] = useState("treatment");
  const [copied, setCopied] = useState(null);
  const abortRef = useRef(null);

  const toggleFormat = id => setSelectedFormats(p => p.includes(id) ? (p.length > 1 ? p.filter(f => f !== id) : p) : [...p, id]);
  const fLabel = selectedFormats.map(id => FORMAT_OPTIONS.find(f => f.id === id)?.label).join(", ");
  const userMsg = `Client: ${clientName || "Not specified"}\nFormats: ${fLabel}\n\nBrief:\n${brief}`;
  const inputTokens = estimateTokens(userMsg);
  const tooLong = inputTokens > MAX_BRIEF_TOKENS;

  const cancel = () => {
    abortRef.current?.abort();
    setLoading(false);
    setLoadingTab(null);
    setStartTime(null);
  };

  const doGenerate = async (system, msg, onDone) => {
    abortRef.current = new AbortController();
    setStartTime(Date.now());
    setProgress(0);
    setError(null);
    try {
      const r = await callClaude(system, msg, { onProgress: setProgress, signal: abortRef.current.signal });
      onDone(r);
    } catch (err) {
      if (err.message !== "CANCELLED") setError(err.message);
    }
    setProgress(0);
    setStartTime(null);
  };

  const generate = async () => {
    if (!brief.trim() || tooLong) return;
    setLoading(true);
    setTreatment(null);
    setExtras({});
    setTab("treatment");
    await doGenerate(P_TREATMENT(fLabel), userMsg, r => setTreatment(r));
    setLoading(false);
  };

  const handleTab = async (id) => {
    setTab(id);
    if (id === "treatment" || extras[id]) return;
    const briefMsg = `Client: ${clientName}\nFormats: ${fLabel}\nBrief: ${brief}`;
    const map = {
      figma:    [P_FIGMA,              briefMsg],
      pitch:    [P_PITCH,              briefMsg],
      exec:     [P_EXEC(fLabel),       briefMsg],
      doc:      [P_VISUAL_DOC(fLabel), briefMsg],
      versions: [P_VERSIONS(fLabel),   briefMsg],
    };
    if (!map[id]) return;
    setLoadingTab(id);
    await doGenerate(map[id][0], map[id][1], r => setExtras(prev => ({ ...prev, [id]: r })));
    setLoadingTab(null);
  };

  const reset = () => {
    cancel();
    setTreatment(null);
    setExtras({});
    setBrief("");
    setClientName("");
    setError(null);
  };

  const cp = (k, v) => {
    navigator.clipboard.writeText(flattenValue(v));
    setCopied(k);
    setTimeout(() => setCopied(null), 1500);
  };

  const cpAll = (sections, source, tag) => {
    const txt = Object.entries(sections)
      .filter(([k]) => source[k])
      .map(([k, m]) => `${m.label.toUpperCase()}\n${"─".repeat(40)}\n${flattenValue(source[k])}`)
      .join("\n\n");
    navigator.clipboard.writeText(txt);
    setCopied(tag);
    setTimeout(() => setCopied(null), 1800);
  };

  const TABS = [
    { id: "treatment", label: "◎ TREATMENT" },
    { id: "versions",  label: "◈ VERSIONS" },
    { id: "figma",     label: "▦ FIGMA" },
    { id: "doc",       label: "◻ DOC" },
    { id: "pitch",     label: "✦ PITCH" },
    { id: "exec",      label: "▶ EXEC" },
  ];

  const TAB_SECTIONS = {
    figma: FIGMA_SECTIONS,
    pitch: PITCH_SECTIONS,
    exec: EXEC_SUMMARY_SECTIONS,
    doc: VISUAL_DOC_SECTIONS,
    versions: CONCEPT_VERSIONS_SECTIONS,
  };
  const TAB_PREFIX = { figma: "f_", pitch: "p_", exec: "e_", doc: "d_", versions: "v_" };
  const TAB_LABELS = { figma: "Figma Guide", pitch: "Pitch Docs", exec: "Executive Summary", doc: "Visual Document Guide", versions: "Concept Versions" };

  if (!treatment && !loading) return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <Label T={T}>CAMPAIGN FORMATS</Label>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))", gap: 0, border: `1px solid ${T.border}` }}>
          {FORMAT_OPTIONS.map(f => {
            const active = selectedFormats.includes(f.id);
            return (
              <button
                key={f.id}
                onClick={() => toggleFormat(f.id)}
                style={{ padding: "11px 12px", display: "flex", alignItems: "center", gap: 8, border: "none", borderRight: `1px solid ${T.border}`, borderBottom: `1px solid ${T.border}`, background: active ? T.text : T.surface, color: active ? T.bg : T.muted, cursor: "pointer", fontSize: 10, fontFamily: "'Arial Black', Impact, sans-serif", fontWeight: active ? 900 : 400, transition: "all 0.15s", textAlign: "left", letterSpacing: "0.04em" }}
              >
                <span style={{ width: 18, height: 18, background: active ? T.bg : T.faint, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 8, flexShrink: 0, color: active ? T.text : T.muted }}>
                  {active ? "✓" : f.icon}
                </span>
                {f.label}
              </button>
            );
          })}
        </div>
        {selectedFormats.length > 1 && (
          <div style={{ padding: "8px 14px", background: T.text, color: T.bg, fontFamily: "'Arial Black', Impact, sans-serif", fontSize: 9, fontWeight: 900, letterSpacing: "0.3em" }}>
            ✦ FULL CAMPAIGN · {selectedFormats.length} FORMATS SELECTED
          </div>
        )}
      </div>
      <div style={{ marginBottom: 18 }}>
        <Label T={T}>CLIENT / BRAND</Label>
        <Input T={T} value={clientName} onChange={setClientName} placeholder="Nike, Marriott, startup local..." />
      </div>
      <div style={{ marginBottom: 14 }}>
        <Label T={T}>PROJECT BRIEF</Label>
        <TextArea T={T} value={brief} onChange={setBrief} placeholder="Describe the brand, campaign goal, target audience, tone, references..." minHeight={160} />
      </div>
      <TokenWarning T={T} tokens={inputTokens} max={MAX_BRIEF_TOKENS} />
      <ErrorBox T={T} msg={error} onRetry={generate} />
      <GenerateBtn
        T={T}
        onClick={generate}
        disabled={loading || !brief.trim() || tooLong}
        loading={loading}
        label={selectedFormats.length > 1 ? `GENERATE CAMPAIGN (${selectedFormats.length} FORMATS)  ✦` : "GENERATE TREATMENT  ✦"}
      />
    </div>
  );

  if (loading) return <Loader T={T} label="Treatment" progress={progress} onCancel={cancel} startTime={startTime} />;

  return (
    <div>
      <div style={{ background: T.text, padding: "8px 16px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
        <span style={{ fontFamily: "'Arial Black', Impact, sans-serif", fontSize: 10, fontWeight: 900, letterSpacing: "0.2em", color: T.bg }}>
          ✦ READY — {(clientName || "PROJECT").toUpperCase()}
        </span>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {selectedFormats.map(id => {
            const f = FORMAT_OPTIONS.find(f => f.id === id);
            return (
              <span key={id} style={{ fontSize: 8, padding: "2px 8px", background: T.bg, color: T.text, fontFamily: "monospace", letterSpacing: "0.1em", border: `1px solid ${T.border}` }}>
                {f?.label}
              </span>
            );
          })}
        </div>
      </div>
      <div style={{ display: "flex", gap: 0, marginBottom: 18, borderBottom: `2px solid ${T.border}`, background: T.surface, flexWrap: "wrap" }}>
        {TABS.map(t => (
          <button
            key={t.id}
            onClick={() => handleTab(t.id)}
            style={{ padding: "10px 14px", background: tab === t.id ? T.text : "transparent", border: "none", borderBottom: tab === t.id ? `2px solid ${T.text}` : "2px solid transparent", color: tab === t.id ? T.bg : T.muted, fontSize: 9, letterSpacing: "0.2em", fontFamily: "'Arial Black', Impact, sans-serif", fontWeight: 900, cursor: "pointer", marginBottom: "-2px" }}
          >
            {t.label}
          </button>
        ))}
      </div>
      <ErrorBox T={T} msg={error} />
      {tab === "treatment" && treatment && (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {Object.entries(TREATMENT_SECTIONS).map(([k, m]) => treatment[k] && (
            <SectionCard key={k} T={T} meta={m} value={treatment[k]} copied={copied === k} onCopy={() => cp(k, treatment[k])} />
          ))}
          <ActionBar T={T} onCopy={() => cpAll(TREATMENT_SECTIONS, treatment, "t")} copied={copied === "t"} onNew={reset} />
        </div>
      )}
      {tab !== "treatment" && (() => {
        const sections = TAB_SECTIONS[tab];
        const prefix = TAB_PREFIX[tab];
        const data = extras[tab];
        const isLoading = loadingTab === tab;
        return (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {isLoading && <Loader T={T} label={TAB_LABELS[tab]} progress={progress} onCancel={cancel} startTime={startTime} />}
            {data && Object.entries(sections).map(([k, m]) => data[k] && (
              <SectionCard key={k} T={T} meta={m} value={data[k]} copied={copied === prefix + k} onCopy={() => cp(prefix + k, data[k])} />
            ))}
            {data && <ActionBar T={T} onCopy={() => cpAll(sections, data, tab)} copied={copied === tab} onNew={reset} />}
          </div>
        );
      })()}
    </div>
  );
}

// ── OUTREACH ───────────────────────────────────────────
function OutreachSection({ T }) {
  const [target, setTarget] = useState("brand");
  const [platform, setPlatform] = useState("instagram");
  const [goal, setGoal] = useState("introduce");
  const [context, setContext] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);
  const [tab, setTab] = useState("new");
  const [fuDays, setFuDays] = useState("3");
  const [fuContext, setFuContext] = useState("");
  const [fuResult, setFuResult] = useState(null);
  const [fuLoading, setFuLoading] = useState(false);
  const [fuProgress, setFuProgress] = useState(0);
  const [startTime, setStartTime] = useState(null);
  const abortRef = useRef(null);

  const selP = OUTREACH_PLATFORMS.find(p => p.id === platform);
  const selT = OUTREACH_TARGETS.find(t => t.id === target);
  const ctokens = estimateTokens(context);
  const ctooLong = ctokens > MAX_CONTEXT_TOKENS;

  const cancel = () => {
    abortRef.current?.abort();
    setLoading(false);
    setFuLoading(false);
    setStartTime(null);
  };

  const generate = async () => {
    if (!context.trim() || ctooLong) return;
    abortRef.current = new AbortController();
    setLoading(true);
    setResult(null);
    setError(null);
    setProgress(0);
    setStartTime(Date.now());
    try {
      const r = await callClaude(
        P_OUTREACH(selP.label, selT.label, OUTREACH_GOALS.find(g => g.id === goal)?.label, context),
        "Write the outreach message now.",
        { onProgress: setProgress, signal: abortRef.current.signal }
      );
      setResult(r);
    } catch (err) {
      if (err.message !== "CANCELLED") setError(err.message);
    }
    setLoading(false);
    setProgress(0);
    setStartTime(null);
  };

  const generateFu = async () => {
    if (!fuContext.trim()) return;
    abortRef.current = new AbortController();
    setFuLoading(true);
    setFuResult(null);
    setFuProgress(0);
    setStartTime(Date.now());
    try {
      const r = await callClaude(
        P_FOLLOWUP(selP.label, fuDays, fuContext),
        "Write the follow-up now.",
        { onProgress: setFuProgress, signal: abortRef.current.signal }
      );
      setFuResult(r);
    } catch (err) {
      if (err.message !== "CANCELLED") setError(err.message);
    }
    setFuLoading(false);
    setFuProgress(0);
    setStartTime(null);
  };

  const copy = txt => { navigator.clipboard.writeText(txt); setCopied(true); setTimeout(() => setCopied(false), 1500); };
  const clearAll = () => { setResult(null); setFuResult(null); setContext(""); setFuContext(""); setError(null); };

  const MsgDisplay = ({ res }) => {
    const isEmail = platform === "email";
    const fullText = isEmail && res.subject ? `Subject: ${res.subject}\n\n${res.body}` : res.body;
    return (
      <div>
        <div style={{ background: T.text, padding: "8px 16px", marginBottom: 12 }}>
          <span style={{ fontFamily: "'Arial Black', Impact, sans-serif", fontSize: 9, fontWeight: 900, color: T.bg, letterSpacing: "0.2em" }}>
            ✦ READY · {selP?.label.toUpperCase()} · {selT?.label.toUpperCase()}
          </span>
        </div>
        {isEmail && res.subject && (
          <div style={{ background: T.cardBg, border: `1px solid ${T.border}`, borderLeft: `3px solid ${T.text}`, marginBottom: 10 }}>
            <div style={{ padding: "8px 16px", borderBottom: `1px solid ${T.border}`, background: T.cardHeader }}>
              <span style={{ fontSize: 9, color: T.text, fontFamily: "'Arial Black', Impact, sans-serif", fontWeight: 900, letterSpacing: "0.2em" }}>SUBJECT LINE</span>
            </div>
            <div style={{ padding: "12px 16px", fontSize: 13, color: T.subtext, fontStyle: "italic", fontFamily: "Georgia, serif" }}>{res.subject}</div>
          </div>
        )}
        <div style={{ background: T.cardBg, border: `1px solid ${T.border}`, borderLeft: `3px solid ${T.text}`, marginBottom: 14 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 16px", borderBottom: `1px solid ${T.border}`, background: T.cardHeader }}>
            <span style={{ fontSize: 9, color: T.text, fontFamily: "'Arial Black', Impact, sans-serif", fontWeight: 900, letterSpacing: "0.2em" }}>MESSAGE</span>
            <button onClick={() => copy(fullText)} style={{ background: "transparent", border: `1px solid ${T.border}`, color: T.muted, fontSize: 8, padding: "3px 9px", cursor: "pointer", fontFamily: "monospace" }}>
              {copied ? "✓" : "COPY"}
            </button>
          </div>
          <div style={{ padding: 16, fontSize: 13, lineHeight: 1.9, color: T.subtext, whiteSpace: "pre-wrap", fontFamily: "Georgia, serif" }}>{res.body}</div>
        </div>
        <div style={{ display: "flex", gap: 0 }}>
          <button onClick={() => copy(fullText)} style={{ flex: 2, padding: 13, background: T.text, border: "none", color: T.bg, fontSize: 10, letterSpacing: "0.22em", fontFamily: "'Arial Black', Impact, sans-serif", fontWeight: 900, cursor: "pointer" }}>
            {copied ? "✓ COPIED" : "COPY  ✦"}
          </button>
          <button onClick={clearAll} style={{ flex: 1, padding: 13, background: "transparent", border: `2px solid ${T.border}`, color: T.muted, fontSize: 10, letterSpacing: "0.22em", fontFamily: "'Arial Black', Impact, sans-serif", fontWeight: 700, cursor: "pointer" }}>
            NEW
          </button>
        </div>
      </div>
    );
  };

  return (
    <div>
      <div style={{ background: T.text, padding: "10px 18px", marginBottom: 24, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontFamily: "'Arial Black', Impact, sans-serif", fontSize: 11, fontWeight: 900, letterSpacing: "0.3em", color: T.bg }}>✉ OUTREACH SYSTEM</span>
        <span style={{ fontFamily: "monospace", fontSize: 9, color: T.bg, opacity: 0.5 }}>CONNECT WITH BRANDS & AGENCIES</span>
      </div>
      <div style={{ display: "flex", gap: 0, marginBottom: 24, borderBottom: `2px solid ${T.border}` }}>
        {[{ id: "new", label: "NUEVO MENSAJE" }, { id: "followup", label: "FOLLOW-UP" }].map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            style={{ padding: "10px 18px", background: tab === t.id ? T.text : "transparent", border: "none", borderBottom: tab === t.id ? `2px solid ${T.text}` : "2px solid transparent", color: tab === t.id ? T.bg : T.muted, fontSize: 9, letterSpacing: "0.22em", fontFamily: "'Arial Black', Impact, sans-serif", fontWeight: 900, cursor: "pointer", marginBottom: "-2px" }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "new" && (
        loading
          ? <Loader T={T} label="Outreach" progress={progress} onCancel={cancel} startTime={startTime} />
          : result
            ? <MsgDisplay res={result} />
            : (
              <div>
                <div style={{ marginBottom: 18 }}>
                  <Label T={T}>PLATAFORMA</Label>
                  <div style={{ display: "flex", gap: 0 }}>
                    {OUTREACH_PLATFORMS.map(p => <Pill key={p.id} T={T} active={platform === p.id} onClick={() => setPlatform(p.id)}>{p.label}</Pill>)}
                  </div>
                </div>
                <div style={{ marginBottom: 18 }}>
                  <Label T={T}>A QUIÉN LE ESCRIBES</Label>
                  <div style={{ display: "flex", gap: 0, flexWrap: "wrap" }}>
                    {OUTREACH_TARGETS.map(t => <Pill key={t.id} T={T} active={target === t.id} onClick={() => setTarget(t.id)}>{t.label}</Pill>)}
                  </div>
                </div>
                <div style={{ marginBottom: 18 }}>
                  <Label T={T}>OBJETIVO</Label>
                  <div style={{ display: "flex", gap: 0, flexWrap: "wrap" }}>
                    {OUTREACH_GOALS.map(g => <Pill key={g.id} T={T} active={goal === g.id} onClick={() => setGoal(g.id)}>{g.label}</Pill>)}
                  </div>
                </div>
                <div style={{ marginBottom: 14 }}>
                  <Label T={T}>CONTEXTO</Label>
                  <TextArea T={T} value={context} onChange={setContext} placeholder={"Cuéntame sobre ellos y por qué los contactas.\n\nEj: Agencia Droga5 NYC, admiro su Spotify Wrapped."} />
                </div>
                <TokenWarning T={T} tokens={ctokens} max={MAX_CONTEXT_TOKENS} />
                <ErrorBox T={T} msg={error} onRetry={generate} />
                <GenerateBtn T={T} onClick={generate} disabled={loading || !context.trim() || ctooLong} loading={loading} label="GENERATE MESSAGE  ✦" />
              </div>
            )
      )}

      {tab === "followup" && (
        fuLoading
          ? <Loader T={T} label="Follow-up" progress={fuProgress} onCancel={cancel} startTime={startTime} />
          : fuResult
            ? <MsgDisplay res={fuResult} />
            : (
              <div>
                <div style={{ marginBottom: 18 }}>
                  <Label T={T}>PLATAFORMA</Label>
                  <div style={{ display: "flex", gap: 0 }}>
                    {OUTREACH_PLATFORMS.map(p => <Pill key={p.id} T={T} active={platform === p.id} onClick={() => setPlatform(p.id)}>{p.label}</Pill>)}
                  </div>
                </div>
                <div style={{ marginBottom: 18 }}>
                  <Label T={T}>DÍAS DESDE EL PITCH</Label>
                  <div style={{ display: "flex", gap: 0 }}>
                    {["2", "3", "5", "7", "14"].map(d => <Pill key={d} T={T} active={fuDays === d} onClick={() => setFuDays(d)}>{d} días</Pill>)}
                  </div>
                </div>
                <div style={{ marginBottom: 14 }}>
                  <Label T={T}>CONTEXTO DEL PITCH ENVIADO</Label>
                  <TextArea T={T} value={fuContext} onChange={setFuContext} placeholder="Qué proyecto enviaste, a quién, y cualquier detalle relevante..." />
                </div>
                <ErrorBox T={T} msg={error} onRetry={generateFu} />
                <GenerateBtn T={T} onClick={generateFu} disabled={fuLoading || !fuContext.trim()} loading={fuLoading} label="GENERATE FOLLOW-UP  ✦" />
              </div>
            )
      )}
    </div>
  );
}

// ── TOOLS HOOK ─────────────────────────────────────────
function useTool(prompt) {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);
  const [startTime, setStartTime] = useState(null);
  const abortRef = useRef(null);

  const run = async (msg) => {
    abortRef.current = new AbortController();
    setLoading(true);
    setResult(null);
    setError(null);
    setProgress(0);
    setStartTime(Date.now());
    try {
      const r = await callClaude(prompt, msg, { onProgress: setProgress, signal: abortRef.current.signal });
      setResult(r);
    } catch (err) {
      if (err.message !== "CANCELLED") setError(err.message);
    }
    setLoading(false);
    setProgress(0);
    setStartTime(null);
  };

  const cancel = () => { abortRef.current?.abort(); setLoading(false); setStartTime(null); };
  const reset = () => { setResult(null); setError(null); };

  return { result, loading, progress, error, run, cancel, reset, startTime };
}

// ── TOOLS SECTION ──────────────────────────────────────
function ToolsSection({ T }) {
  const [activeTool, setActiveTool] = useState("ratecard");
  return (
    <div>
      <div style={{ background: T.text, padding: "10px 18px", marginBottom: 0 }}>
        <span style={{ fontFamily: "'Arial Black', Impact, sans-serif", fontSize: 11, fontWeight: 900, letterSpacing: "0.3em", color: T.bg }}>▦ PRODUCTION TOOLS</span>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", marginBottom: 28, border: `1px solid ${T.border}`, borderTop: "none" }}>
        {TOOLS_LIST.map(tool => (
          <button
            key={tool.id}
            onClick={() => setActiveTool(tool.id)}
            style={{ padding: "14px 8px", display: "flex", flexDirection: "column", alignItems: "center", gap: 6, border: "none", borderRight: `1px solid ${T.border}`, background: activeTool === tool.id ? T.text : T.surface, color: activeTool === tool.id ? T.bg : T.muted, cursor: "pointer", fontSize: 8, fontFamily: "'Arial Black', Impact, sans-serif", fontWeight: activeTool === tool.id ? 900 : 400, letterSpacing: "0.1em", transition: "all 0.15s" }}
          >
            <span style={{ fontSize: 16 }}>{tool.icon}</span>
            {tool.label.toUpperCase()}
          </button>
        ))}
      </div>
      {activeTool === "ratecard"      && <RateCard T={T} />}
      {activeTool === "shotlist"      && <ShotList T={T} />}
      {activeTool === "casestudy"     && <CaseStudy T={T} />}
      {activeTool === "bio"           && <BioGen T={T} />}
      {activeTool === "moodboard"     && <MoodBoard T={T} />}
      {activeTool === "preproduction" && <PreProduction T={T} />}
    </div>
  );
}

// ── INDIVIDUAL TOOLS ───────────────────────────────────
function RateCard({ T }) {
  const { result, loading, progress, error, run, cancel, reset, startTime } = useTool(P_RATE_CARD);
  const sections = {
    intro: { icon: "✦", label: "Positioning" },
    day_rates: { icon: "◈", label: "Day Rates" },
    project_packages: { icon: "▦", label: "Project Packages" },
    usage_rights: { icon: "◎", label: "Usage Rights" },
    payment_terms: { icon: "◑", label: "Payment Terms" },
    notes: { icon: "◻", label: "Notes" },
  };
  if (loading) return <Loader T={T} label="Rate Card" progress={progress} onCancel={cancel} startTime={startTime} />;
  if (result) return <ToolResult T={T} sections={sections} data={result} onNew={reset} />;
  return (
    <div>
      <p style={{ color: T.muted, fontSize: 13, lineHeight: 1.7, marginBottom: 22, fontFamily: "Georgia, serif" }}>
        Genera una rate card profesional con paquetes y tarifas para el mercado internacional.
      </p>
      <ErrorBox T={T} msg={error} onRetry={() => run("Generate NEHOMARR's rate card now.")} />
      <GenerateBtn T={T} onClick={() => run("Generate NEHOMARR's rate card now.")} disabled={loading} loading={loading} label="GENERATE RATE CARD  ✦" />
    </div>
  );
}

function ShotList({ T }) {
  const [brief, setBrief] = useState("");
  const [formats, setFormats] = useState(["spot"]);
  const fLabel = formats.map(id => FORMAT_OPTIONS.find(f => f.id === id)?.label).join(", ");
  const { result, loading, progress, error, run, cancel, reset, startTime } = useTool(P_SHOTLIST(fLabel));
  const toggleF = id => setFormats(p => p.includes(id) ? (p.length > 1 ? p.filter(f => f !== id) : p) : [...p, id]);
  const sections = {
    overview: { icon: "✦", label: "Overview" },
    scene_breakdown: { icon: "▦", label: "Scene Breakdown" },
    equipment_list: { icon: "◈", label: "Equipment List" },
    lighting_notes: { icon: "◻", label: "Lighting Notes" },
    crew_notes: { icon: "◎", label: "Crew Notes" },
    shooting_order: { icon: "◑", label: "Shooting Order" },
  };
  const tok = estimateTokens(brief);
  if (loading) return <Loader T={T} label="Shot List" progress={progress} onCancel={cancel} startTime={startTime} />;
  if (result) return <ToolResult T={T} sections={sections} data={result} onNew={reset} />;
  return (
    <div>
      <div style={{ marginBottom: 18 }}>
        <Label T={T}>FORMATOS</Label>
        <div style={{ display: "flex", gap: 0, flexWrap: "wrap" }}>
          {FORMAT_OPTIONS.slice(0, 6).map(f => <Pill key={f.id} T={T} active={formats.includes(f.id)} onClick={() => toggleF(f.id)}>{f.label}</Pill>)}
        </div>
      </div>
      <div style={{ marginBottom: 14 }}>
        <Label T={T}>BRIEF</Label>
        <TextArea T={T} value={brief} onChange={setBrief} placeholder="Describe el proyecto, escenas clave, locaciones..." />
      </div>
      <TokenWarning T={T} tokens={tok} max={MAX_CONTEXT_TOKENS} />
      <ErrorBox T={T} msg={error} />
      <GenerateBtn T={T} onClick={() => run(`Brief:\n${brief}`)} disabled={loading || !brief.trim() || tok > MAX_CONTEXT_TOKENS} loading={loading} label="GENERATE SHOT LIST  ✦" />
    </div>
  );
}

function CaseStudy({ T }) {
  const [brief, setBrief] = useState("");
  const { result, loading, progress, error, run, cancel, reset, startTime } = useTool(P_CASESTUDY);
  const sections = {
    headline: { icon: "✦", label: "Headline" },
    challenge: { icon: "◈", label: "The Challenge" },
    approach: { icon: "◎", label: "The Approach" },
    execution: { icon: "▦", label: "Execution" },
    results: { icon: "◑", label: "Results & Impact" },
    impact: { icon: "→", label: "Impact" },
    quote: { icon: "◻", label: "Client Quote" },
    tags: { icon: "◈", label: "Tags" },
  };
  const tok = estimateTokens(brief);
  if (loading) return <Loader T={T} label="Case Study" progress={progress} onCancel={cancel} startTime={startTime} />;
  if (result) return <ToolResult T={T} sections={sections} data={result} onNew={reset} />;
  return (
    <div>
      <p style={{ color: T.muted, fontSize: 13, lineHeight: 1.7, marginBottom: 18, fontFamily: "Georgia, serif" }}>
        Convierte un proyecto en un case study de portafolio profesional.
      </p>
      <div style={{ marginBottom: 14 }}>
        <Label T={T}>DESCRIBE EL PROYECTO</Label>
        <TextArea T={T} value={brief} onChange={setBrief} placeholder="Qué hiciste, para quién, el objetivo, cómo lo resolviste y los resultados..." minHeight={160} />
      </div>
      <TokenWarning T={T} tokens={tok} max={MAX_CONTEXT_TOKENS} />
      <ErrorBox T={T} msg={error} />
      <GenerateBtn T={T} onClick={() => run(`Project:\n${brief}`)} disabled={loading || !brief.trim() || tok > MAX_CONTEXT_TOKENS} loading={loading} label="GENERATE CASE STUDY  ✦" />
    </div>
  );
}

function BioGen({ T }) {
  const [context, setContext] = useState("");
  const { result, loading, progress, error, run, cancel, reset, startTime } = useTool(P_BIO);
  const sections = {
    instagram: { icon: "◈", label: "Instagram Bio" },
    linkedin: { icon: "▦", label: "LinkedIn Bio" },
    proposal: { icon: "✦", label: "Proposal Bio" },
    web_short: { icon: "◎", label: "Web Tagline" },
    web_long: { icon: "◑", label: "Web About" },
  };
  if (loading) return <Loader T={T} label="Bio Generator" progress={progress} onCancel={cancel} startTime={startTime} />;
  if (result) return <ToolResult T={T} sections={sections} data={result} onNew={reset} />;
  return (
    <div>
      <p style={{ color: T.muted, fontSize: 13, lineHeight: 1.7, marginBottom: 18, fontFamily: "Georgia, serif" }}>
        Genera versiones de tu bio para cada plataforma.
      </p>
      <div style={{ marginBottom: 14 }}>
        <Label T={T}>CONTEXTO ADICIONAL (opcional)</Label>
        <TextArea T={T} value={context} onChange={setContext} placeholder="Proyectos destacados, marcas, especializaciones, logros recientes..." />
      </div>
      <ErrorBox T={T} msg={error} />
      <GenerateBtn
        T={T}
        onClick={() => run(`Context:\n${context || "World-class creative director and cinematographer. Founder of BeDangerous / Facilitators."}`)}
        disabled={loading}
        loading={loading}
        label="GENERATE BIOS  ✦"
      />
    </div>
  );
}

function MoodBoard({ T }) {
  const [brief, setBrief] = useState("");
  const [formats, setFormats] = useState(["photo"]);
  const fLabel = formats.map(id => FORMAT_OPTIONS.find(f => f.id === id)?.label).join(", ");
  const { result, loading, progress, error, run, cancel, reset, startTime } = useTool(P_MOODBOARD(fLabel));
  const toggleF = id => setFormats(p => p.includes(id) ? (p.length > 1 ? p.filter(f => f !== id) : p) : [...p, id]);
  const sections = {
    concept: { icon: "✦", label: "Mood Concept" },
    hero_images: { icon: "◻", label: "Hero Image Keywords" },
    texture_details: { icon: "◈", label: "Texture & Detail Keywords" },
    color_story: { icon: "◎", label: "Color Story" },
    typography_feel: { icon: "▦", label: "Typography Feel" },
    layout_guide: { icon: "◑", label: "Layout Guide" },
    references: { icon: "→", label: "Creative References" },
  };
  const tok = estimateTokens(brief);
  if (loading) return <Loader T={T} label="Mood Board" progress={progress} onCancel={cancel} startTime={startTime} />;
  if (result) return <ToolResult T={T} sections={sections} data={result} onNew={reset} />;
  return (
    <div>
      <div style={{ marginBottom: 18 }}>
        <Label T={T}>FORMATOS</Label>
        <div style={{ display: "flex", gap: 0, flexWrap: "wrap" }}>
          {FORMAT_OPTIONS.slice(0, 6).map(f => <Pill key={f.id} T={T} active={formats.includes(f.id)} onClick={() => toggleF(f.id)}>{f.label}</Pill>)}
        </div>
      </div>
      <div style={{ marginBottom: 14 }}>
        <Label T={T}>BRIEF / CONCEPTO</Label>
        <TextArea T={T} value={brief} onChange={setBrief} placeholder="Describe la marca, el mood, referencias visuales, colores..." />
      </div>
      <TokenWarning T={T} tokens={tok} max={MAX_CONTEXT_TOKENS} />
      <ErrorBox T={T} msg={error} />
      <GenerateBtn T={T} onClick={() => run(`Brief:\n${brief}`)} disabled={loading || !brief.trim() || tok > MAX_CONTEXT_TOKENS} loading={loading} label="GENERATE MOOD BOARD  ✦" />
    </div>
  );
}

function PreProduction({ T }) {
  const [formats, setFormats] = useState(["spot"]);
  const [brief, setBrief] = useState("");
  const fLabel = formats.map(id => FORMAT_OPTIONS.find(f => f.id === id)?.label).join(", ");
  const { result, loading, progress, error, run, cancel, reset, startTime } = useTool(P_PREPRODUCTION(fLabel));
  const toggleF = id => setFormats(p => p.includes(id) ? (p.length > 1 ? p.filter(f => f !== id) : p) : [...p, id]);
  const sections = {
    creative: { icon: "✦", label: "Creative Tasks" },
    logistics: { icon: "◈", label: "Logistics" },
    talent: { icon: "◎", label: "Talent & Casting" },
    technical: { icon: "▦", label: "Technical" },
    locations: { icon: "◑", label: "Locations" },
    legal: { icon: "◻", label: "Legal & Permits" },
    timeline: { icon: "→", label: "Pre-Pro Timeline" },
    red_flags: { icon: "⚠", label: "Red Flags" },
  };
  const tok = estimateTokens(brief);
  if (loading) return <Loader T={T} label="Pre-Production Checklist" progress={progress} onCancel={cancel} startTime={startTime} />;
  if (result) return <ToolResult T={T} sections={sections} data={result} onNew={reset} />;
  return (
    <div>
      <div style={{ marginBottom: 18 }}>
        <Label T={T}>FORMATOS</Label>
        <div style={{ display: "flex", gap: 0, flexWrap: "wrap" }}>
          {FORMAT_OPTIONS.slice(0, 6).map(f => <Pill key={f.id} T={T} active={formats.includes(f.id)} onClick={() => toggleF(f.id)}>{f.label}</Pill>)}
        </div>
      </div>
      <div style={{ marginBottom: 14 }}>
        <Label T={T}>BRIEF</Label>
        <TextArea T={T} value={brief} onChange={setBrief} placeholder="Describe el proyecto para generar el checklist de pre-producción..." />
      </div>
      <TokenWarning T={T} tokens={tok} max={MAX_CONTEXT_TOKENS} />
      <ErrorBox T={T} msg={error} />
      <GenerateBtn T={T} onClick={() => run(`Brief:\n${brief}`)} disabled={loading || !brief.trim() || tok > MAX_CONTEXT_TOKENS} loading={loading} label="GENERATE PRE-PRO CHECKLIST  ✦" />
    </div>
  );
}

// ── APP ────────────────────────────────────────────────
export default function Studio() {
  const [mode, setMode] = useState("dark");
  const [section, setSection] = useState("treatment");
  const T = THEMES[mode];
  return (
    <div style={{ minHeight: "100vh", background: T.bg, color: T.text, transition: "all 0.3s" }}>
      <Header T={T} mode={mode} setMode={setMode} section={section} setSection={setSection} />
      <div style={{ maxWidth: 820, margin: "0 auto", padding: "28px 24px 80px" }}>
        {section === "treatment" && <TreatmentSection T={T} />}
        {section === "outreach"  && <OutreachSection T={T} />}
        {section === "tools"     && <ToolsSection T={T} />}
      </div>
    </div>
  );
}
