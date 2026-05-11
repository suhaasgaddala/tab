import { motion } from "framer-motion";
import {
  Apple,
  ArrowLeft,
  ArrowRight,
  AudioWaveform,
  Bell,
  CheckCircle2,
  ChevronDown,
  ChevronsLeft,
  CircleHelp,
  Clock3,
  FileText,
  Grid3X3,
  Hand,
  Home,
  LayoutTemplate,
  ListChecks,
  Lock,
  Mail,
  Mic,
  MoreHorizontal,
  MousePointer2,
  Network,
  PanelRight,
  Pencil,
  PlayCircle,
  Plus,
  Search,
  Send,
  Settings,
  Share2,
  ShieldCheck,
  Sparkles,
  Star,
  Trash2,
  Undo2,
  UploadCloud,
  Users,
  WandSparkles,
  Workflow,
  ZoomIn
} from "lucide-react";
import { FormEvent, PointerEvent, useEffect, useMemo, useRef, useState } from "react";
import { BrowserRouter, Link, Navigate, Route, Routes, useNavigate, useParams } from "react-router-dom";
import {
  AgentRunResponse,
  CanvasAction,
  CanvasObject,
  createCanvasId,
  runVoyaAgent,
  sampleCanvasObjects
} from "./lib/voya";

const blue = "#0057ff";

function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <Link to="/" className="brand-lockup" aria-label="voya home">
      <span className={compact ? "brand-mark compact" : "brand-mark"}>v</span>
      {!compact && <span className="brand-text">voya</span>}
    </Link>
  );
}

function MarketingNav({ active }: { active?: "features" | "pricing" }) {
  return (
    <header className="site-nav">
      <Logo />
      <nav className="nav-links" aria-label="Primary">
        <Link to="/features">product <ChevronDown size={14} /></Link>
        <Link className={active === "features" ? "active" : ""} to="/features">features</Link>
        <Link to="/features">use cases <ChevronDown size={14} /></Link>
        <Link className={active === "pricing" ? "active" : ""} to="/pricing">pricing</Link>
        <a href="#docs">docs</a>
      </nav>
      <div className="nav-actions">
        <Link to="/signin" className="text-button">sign in</Link>
        <Link to="/dashboard" className="primary-button small">start free</Link>
      </div>
    </header>
  );
}

function Waveform({ darkMode = false }: { darkMode?: boolean }) {
  return (
    <div className={darkMode ? "waveform dark" : "waveform"} aria-hidden="true">
      {Array.from({ length: 28 }).map((_, index) => (
        <span key={index} style={{ height: `${8 + ((index * 7) % 28)}px`, animationDelay: `${index * 0.035}s` }} />
      ))}
    </div>
  );
}

function MiniCanvasPreview({ large = false }: { large?: boolean }) {
  return (
    <div className={large ? "mini-canvas large" : "mini-canvas"}>
      <div className="preview-topbar">
        <Logo compact />
        <span>Project Astra</span>
        <ChevronDown size={14} />
        <div className="preview-spacer" />
        <Undo2 size={15} />
        <div className="avatar-stack"><span /><span /><span /><em>+3</em></div>
        <button><Share2 size={14} /> share</button>
      </div>
      <div className="preview-stage">
        <PreviewCard className="pcard insights" title="user insights" text="simplify onboarding&#10;clearer pricing&#10;mobile-first" tag="Research" />
        <PreviewCard className="pcard vision" title="product vision" text="Empower teams to think out loud and build together." tag="Core" />
        <PreviewCard className="pcard outcomes" title="key outcomes" text="faster ideation&#10;aligned teams&#10;measurable impact" tag="Goals" />
        <PreviewCard className="pcard steps" title="next steps" text="user interviews&#10;competitor scan&#10;prototype flow" tag="Tasks" />
        <PreviewCard className="pcard flow" title="flow diagram" text="capture -> organize -> decide" tag="Workflow" />
        <PreviewCard className="pcard design" title="design direction" text="wireframes&#10;soft cards&#10;voice bar" tag="Design" />
        <svg className="preview-lines" viewBox="0 0 760 520" aria-hidden="true">
          <path d="M188 118 C290 118 260 218 350 218" />
          <path d="M210 330 C300 300 280 248 350 248" />
          <path d="M500 250 C560 260 560 190 620 190" className="purple" />
          <path d="M470 315 C520 390 570 390 610 385" className="green" />
          <path d="M410 335 C410 390 380 395 380 430" />
        </svg>
        <div className="assistant-preview">
          <div className="assistant-title"><Sparkles size={16} /> voya assistant</div>
          <button><FileText size={13} /> summarize this space</button>
          <button><ListChecks size={13} /> turn this into tasks</button>
          <button><Workflow size={13} /> create a flow diagram</button>
          <p>This canvas focuses on simplifying onboarding and turning next steps into workflows.</p>
        </div>
        <div className="voice-pill">
          <Mic size={20} />
          <Waveform darkMode />
          <span>listening...</span>
          <Hand size={18} />
        </div>
      </div>
    </div>
  );
}

function PreviewCard({ className, title, text, tag }: { className: string; title: string; text: string; tag: string }) {
  return (
    <div className={className}>
      <strong>{title}</strong>
      <p>{text}</p>
      <span>{tag}</span>
    </div>
  );
}

function LandingPage() {
  return (
    <main className="page-shell">
      <MarketingNav />
      <section className="hero-grid">
        <div className="hero-copy">
          <div className="badge"><span>new</span> voya 2.0 · voice & gesture canvas is here <ArrowRight size={14} /></div>
          <motion.h1 initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
            the voice-powered canvas for thinking <em>visually.</em>
          </motion.h1>
          <p className="tagline">Think out loud. Build visually.</p>
          <p className="subhead">
            Speak, gesture, sketch, and organize ideas into notes, tasks, diagrams, and workflows on an infinite canvas that thinks with you.
          </p>
          <div className="hero-actions">
            <Link to="/dashboard" className="primary-button">start free <ArrowRight size={20} /></Link>
            <Link to="/features" className="secondary-button"><PlayCircle size={22} /> watch demo</Link>
          </div>
          <div className="feature-pills">
            {[
              [AudioWaveform, "voice commands", "speak ideas into action"],
              [Hand, "gesture controls", "move, connect, create"],
              [Sparkles, "smart organization", "ai that structures for you"],
              [Users, "real-time workflows", "collaborate as you build"]
            ].map(([Icon, title, text]) => {
              const C = Icon as typeof AudioWaveform;
              return <span key={String(title)}><C size={20} /><strong>{title as string}</strong><small>{text as string}</small></span>;
            })}
          </div>
        </div>
        <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} className="hero-preview">
          <MiniCanvasPreview large />
        </motion.div>
      </section>
      <section className="trusted-row">
        <span>trusted by modern teams</span>
        {["loom", "linear", "ramp", "remote", "notion", "perplexity"].map((name) => <strong key={name}>{name}</strong>)}
      </section>
    </main>
  );
}

function FeaturesPage() {
  const cards = [
    { icon: AudioWaveform, title: "voice capture", text: "Speak naturally. We capture every idea.", visual: <Waveform /> },
    { icon: Hand, title: "gesture controls", text: "Move, connect, and sketch with ease.", visual: <div className="gesture-visual"><span /><i /><Hand size={54} /></div> },
    { icon: Sparkles, title: "smart organization", text: "AI organizes notes, tasks, diagrams, and more.", visual: <div className="stack-visual"><span>notes</span><span>tasks</span><span>diagrams</span><span>decisions</span></div> },
    { icon: Workflow, title: "workflow generation", text: "Turn ideas into actionable workflows in one click.", visual: <div className="flow-visual"><span /><span /><span /><span /></div> }
  ];

  return (
    <main className="page-shell">
      <MarketingNav active="features" />
      <section className="features-hero">
        <div>
          <div className="badge"><span>new</span> voya 2.0 is here <ArrowRight size={14} /></div>
          <h1>an intelligent canvas that turns thoughts into <em>structure.</em></h1>
          <p>Speak ideas, sketch concepts, use gestures, and let AI organize everything into notes, tasks, diagrams, and workflows instantly.</p>
          <div className="hero-actions">
            <Link to="/dashboard" className="primary-button">start free <ArrowRight size={20} /></Link>
            <Link to="/canvas/demo" className="secondary-button"><PlayCircle size={22} /> watch demo</Link>
          </div>
        </div>
        <div className="feature-card-grid">
          {cards.map(({ icon: Icon, title, text, visual }) => (
            <article className="feature-card" key={title}>
              <Icon size={28} color={blue} />
              <h3>{title}</h3>
              <p>{text}</p>
              <div className="feature-visual">{visual}</div>
            </article>
          ))}
        </div>
      </section>
      <section className="showcase">
        <div className="showcase-copy">
          <span><Sparkles size={17} /> feature showcase</span>
          <h2>from messy brainstorm to clear workflow.</h2>
          <p>voya's AI assistant listens, understands, and structures your ideas into a plan you can act on.</p>
        </div>
        <div className="before-after">
          <div><strong>messy brainstorm</strong><p>mobile onboarding flow</p><p>user signs up → choose plan?</p><p>maybe templates?</p></div>
          <span><ArrowRight size={24} /></span>
          <div><strong>structured workflow</strong><p>user signs up to verify email to choose plan to setup workspace to invite team</p></div>
        </div>
        <div className="showcase-list">
          {["real-time collaboration", "powerful templates", "unified search"].map((item) => <span key={item}>{item}</span>)}
        </div>
      </section>
    </main>
  );
}

function PricingPage() {
  const plans = [
    { name: "Starter", price: "$0", note: "forever", cta: "start for free", features: ["3 canvases", "50 AI actions / month", "60 voice transcription minutes", "Basic gesture controls", "3 templates", "Export to PNG & PDF"] },
    { name: "Pro", price: "$12", note: "per user / month", cta: "start free trial", features: ["Unlimited canvases", "500 AI actions / month", "600 voice transcription minutes", "Advanced gesture controls", "20+ templates", "Priority support"] },
    { name: "Team", price: "$24", note: "per user / month", cta: "start free trial", popular: true, features: ["Unlimited AI actions", "2,000 voice transcription minutes", "Real-time collaboration", "Team libraries & shared templates", "Version history", "Team analytics"] },
    { name: "Enterprise", price: "let's talk", note: "custom pricing", cta: "contact sales", features: ["SSO & SCIM provisioning", "Advanced admin controls", "Audit logs & compliance", "Data residency options", "Custom integrations", "Dedicated success manager"] }
  ];
  return (
    <main className="page-shell pricing-page">
      <MarketingNav active="pricing" />
      <section className="pricing-hero">
        <div className="badge centered"><Sparkles size={16} /> simple, transparent pricing</div>
        <h1>built for <em>creators.</em> priced for <em>teams.</em></h1>
        <p>From solo thinkers to enterprise teams, voya scales with the way you work.</p>
      </section>
      <section className="pricing-grid">
        {plans.map((plan) => (
          <article className={plan.popular ? "price-card popular" : "price-card"} key={plan.name}>
            {plan.popular && <div className="popular-band"><Sparkles size={15} /> most popular</div>}
            <h2>{plan.name}</h2>
            <p>For {plan.name === "Enterprise" ? "organizations with scale" : plan.name === "Starter" ? "individuals getting started" : plan.name === "Pro" ? "solo creators and power users" : "growing teams and makers"}</p>
            <div className="price">{plan.price}</div>
            <small>{plan.note}</small>
            <Link to="/dashboard" className={plan.popular ? "primary-button block" : "secondary-button block"}>{plan.cta} <ArrowRight size={18} /></Link>
            <ul>
              {plan.features.map((feature) => <li key={feature}><CheckCircle2 size={16} /> {feature}</li>)}
            </ul>
          </article>
        ))}
      </section>
      <div className="pricing-foot"><span>cancel anytime</span><span>no credit card required</span><span>14-day free trial on paid plans</span><span>secure & privacy-first</span></div>
    </main>
  );
}

function SignInPage() {
  const navigate = useNavigate();
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    localStorage.setItem("voya_authed", "true");
    navigate("/dashboard");
  }
  return (
    <main className="signin-shell">
      <section className="signin-card">
        <div className="signin-form">
          <Logo />
          <Link to="/" className="back-link"><ArrowLeft size={16} /> back to home</Link>
          <h1>sign in</h1>
          <p>Welcome back. Sign in to access your voice-powered workspace.</p>
          <form onSubmit={submit}>
            <label>email<span><Mail size={18} /><input type="email" required placeholder="you@company.com" /></span></label>
            <label>password<span><Lock size={18} /><input type="password" required placeholder="enter your password" /></span></label>
            <a href="#forgot">forgot password?</a>
            <button className="primary-button block" type="submit">log in <ArrowRight size={19} /></button>
          </form>
          <div className="divider"><span /> or continue with <span /></div>
          <div className="oauth-row">
            <button><strong>G</strong> continue with google</button>
            <button><Apple size={18} fill="currentColor" /> continue with apple</button>
          </div>
          <div className="security-card">
            <ShieldCheck size={34} />
            <div><strong>your workspace, your data</strong><p>Private workspaces, voice history, and secure sync across devices.</p></div>
            <span>private workspaces</span><span>voice history</span><span>secure sync</span>
          </div>
          <p className="signup-note">new to voya? <Link to="/dashboard">start free <ArrowRight size={15} /></Link></p>
        </div>
        <aside className="signin-visual">
          <h2>speak ideas.<br /><em>see structure.</em></h2>
          <p>voya turns your voice into clarity, capturing ideas and organizing them visually.</p>
          <div className="floating-voice"><Mic size={22} /><Waveform darkMode /><small>0:18</small></div>
          <MiniCanvasPreview />
        </aside>
      </section>
    </main>
  );
}

function DashboardPage() {
  const navigate = useNavigate();
  const canvases = [
    "Project Astra Roadmap",
    "Q2 Product Strategy",
    "User Research Synthesis",
    "Onboarding Flow v2"
  ];
  const templates = ["Brainstorming", "Product Planning", "Team Standup", "Mind Map", "Workflow Map"];

  function newCanvas() {
    const id = createCanvasId();
    navigate(`/canvas/${id}`);
  }

  return (
    <main className="dashboard-shell">
      <aside className="dashboard-sidebar">
        <Logo />
        <nav>
          {[
            [Home, "home", true],
            [Clock3, "recent"],
            [LayoutTemplate, "templates"],
            [Users, "shared with me"],
            [Mic, "voice notes"],
            [Settings, "settings"],
            [PanelRight, "integrations"],
            [Trash2, "trash"]
          ].map(([Icon, label, active]) => {
            const C = Icon as typeof Home;
            return <a className={active ? "active" : ""} key={String(label)}><C size={20} /> {label as string}</a>;
          })}
        </nav>
        <div className="spaces">
          <div>spaces <Plus size={16} /></div>
          {["Product", "Marketing", "Engineering", "Design"].map((space, index) => <span key={space}><i>{space[0]}</i>{space}</span>)}
        </div>
        <div className="profile-card"><span /> <div><strong>Alex Chen</strong><small>alex@acme.com</small></div><ChevronDown size={16} /></div>
        <div className="pro-card"><strong>voya pro</strong><small>Team plan</small><button>manage</button></div>
      </aside>
      <section className="dashboard-main">
        <div className="dashboard-top">
          <div>
            <h1>good morning, alex</h1>
            <p>Capture ideas. Organize visually. Think out loud with voya.</p>
            <div className="small-pills"><span><AudioWaveform size={16} /> voice-enabled</span><span><Sparkles size={16} /> smart organize</span></div>
          </div>
          <label className="dashboard-search"><Search size={20} /><input placeholder="search canvases, spaces, and people..." /><kbd>Cmd K</kbd></label>
          <div className="dashboard-icons"><CircleHelp /><Bell /><button onClick={newCanvas}><Plus size={18} /> new canvas</button></div>
        </div>
        <div className="quick-actions">
          {[
            [Plus, "new canvas", "start from scratch", newCanvas],
            [AudioWaveform, "voice note", "speak ideas to canvas", newCanvas],
            [UploadCloud, "import", "bring in docs or files", undefined],
            [Grid3X3, "templates", "choose a starting point", undefined]
          ].map(([Icon, title, text, action]) => {
            const C = Icon as typeof Plus;
            return <button key={String(title)} onClick={action as (() => void) | undefined}><C size={26} /><strong>{title as string}</strong><small>{text as string}</small></button>;
          })}
        </div>
        <DashboardSection title="recent canvases" link="view all">
          {canvases.map((title, index) => <CanvasThumb key={title} title={title} index={index} onClick={() => navigate(`/canvas/${slug(title)}`)} />)}
        </DashboardSection>
        <DashboardSection title="start with a template" link="view all templates">
          {templates.map((title, index) => <TemplateThumb key={title} title={title} index={index} />)}
        </DashboardSection>
      </section>
      <aside className="activity-panel">
        <div className="panel-title">activity <a>view all</a></div>
        {[
          [Sparkles, "voya assistant", "Created 6 key outcomes based on Project Astra overview", "9:41 AM"],
          [ListChecks, "You", "Added 4 next steps to Q2 Product Strategy", "9:21 AM"],
          [Workflow, "voya assistant", "Organized notes into a workflow in Onboarding Flow v2", "8:50 AM"],
          [FileText, "Jamie Park", "Commented on User Research Synthesis", "Yesterday"],
          [Users, "You", "Shared Project Astra Roadmap with 5 people", "Yesterday"]
        ].map(([Icon, who, action, time]) => {
          const C = Icon as typeof Sparkles;
          return <div className="activity-item" key={String(action)}><span><C size={17} /></span><p><strong>{who as string}</strong>{action as string}</p><small>{time as string}</small></div>;
        })}
        <button className="ask-card"><Sparkles size={30} /><span><strong>ask voya anything</strong><small>Get answers and create with AI</small></span><ArrowRight /></button>
      </aside>
    </main>
  );
}

function DashboardSection({ title, link, children }: { title: string; link: string; children: React.ReactNode }) {
  return <section className="dash-section"><div><h2>{title}</h2><a>{link}</a></div><div className="dash-grid">{children}</div></section>;
}

function CanvasThumb({ title, index, onClick }: { title: string; index: number; onClick: () => void }) {
  return <button className="canvas-thumb" onClick={onClick}><div className={`thumb-art art-${index}`}><MiniNodes /></div><strong>{title}</strong><small>Edited {index === 0 ? "2h" : index + 1 + "d"} ago</small></button>;
}

function TemplateThumb({ title, index }: { title: string; index: number }) {
  return <button className="template-thumb"><div className={`template-art art-${index}`}><MiniNodes /></div><strong>{title}</strong><small>{index === 0 ? "Generate ideas freely" : "Organize ideas visually"}</small><Sparkles size={16} /></button>;
}

function MiniNodes() {
  return <>{Array.from({ length: 8 }).map((_, i) => <span key={i} />)}</>;
}

function slug(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function CanvasPage() {
  const { id = "demo" } = useParams();
  const storageKey = `voya_canvas_${id}`;
  const [objects, setObjects] = useState<CanvasObject[]>(() => {
    const saved = localStorage.getItem(storageKey);
    return saved ? (JSON.parse(saved) as CanvasObject[]) : sampleCanvasObjects;
  });
  const [summary, setSummary] = useState("This canvas defines the product vision to help teams think visually and collaborate effectively.");
  const [answer, setAnswer] = useState("The AI has grouped related ideas and suggested next steps.");
  const [trace, setTrace] = useState<AgentRunResponse["trace"]>([]);
  const [command, setCommand] = useState("");
  const [loading, setLoading] = useState(false);
  const [dragId, setDragId] = useState<string | null>(null);
  const dragOffset = useRef({ x: 0, y: 0 });

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(objects));
  }, [objects, storageKey]);

  const nonConnectors = objects.filter((object) => object.type !== "connector");
  const connectors = objects.filter((object) => object.type === "connector");
  const objectMap = useMemo(() => new Map(objects.map((object) => [object.id, object])), [objects]);

  function addNote() {
    setObjects((current) => [
      ...current,
      {
        id: `note_${Date.now().toString(36)}`,
        type: "note",
        title: "new note",
        text: "Capture a thought, then ask voya to organize it.",
        x: 480 + (current.length % 4) * 40,
        y: 300 + (current.length % 3) * 40,
        width: 230,
        height: 135,
        color: "blue"
      }
    ]);
  }

  function applyActions(actions: CanvasAction[]) {
    setObjects((current) => {
      let next = [...current];
      for (const action of actions) {
        if (action.type === "create_object") {
          const object = action.payload as unknown as CanvasObject;
          if (!next.some((item) => item.id === object.id)) next.push(object);
        }
        if (action.type === "create_group") {
          const payload = action.payload as Partial<CanvasObject> & { id: string; title: string };
          if (!next.some((item) => item.id === payload.id)) next.unshift({ type: "group", x: 0, y: 0, ...payload });
        }
        if (action.type === "move_object") {
          const { id: moveId, x, y } = action.payload as { id: string; x: number; y: number };
          next = next.map((item) => (item.id === moveId ? { ...item, x, y } : item));
        }
        if (action.type === "update_object") {
          const { id: updateId, ...patch } = action.payload;
          next = next.map((item) => (item.id === updateId ? { ...item, ...patch } : item));
        }
        if (action.type === "create_connection") {
          const payload = action.payload as { id: string; fromId: string; toId: string; color?: string };
          if (!next.some((item) => item.id === payload.id)) {
            next.push({ id: payload.id, type: "connector", x: 0, y: 0, metadata: payload });
          }
        }
      }
      return next;
    });

    for (const action of actions) {
      if (action.type === "summarize_canvas" && typeof action.payload.summary === "string") {
        setSummary(action.payload.summary);
      }
    }
  }

  async function runCommand(nextCommand: string, mode: "voice" | "text" | "gesture" = "text") {
    setLoading(true);
    setCommand(nextCommand);
    try {
      if (import.meta.env.DEV && window.location.hostname.startsWith("100.")) {
        const result = makeBrowserPreviewAgentResult(nextCommand, objects);
        setAnswer(result.answer);
        if (result.summary) setSummary(result.summary);
        setTrace(result.trace);
        applyActions(result.actions);
        return;
      }

      const result = await runVoyaAgent({ canvasId: id, command: nextCommand, mode, objects });
      setAnswer(result.answer);
      if (result.summary) setSummary(result.summary);
      setTrace(result.trace);
      applyActions(result.actions);
    } catch (error) {
      setAnswer(error instanceof Error ? error.message : "Something went wrong while running voya.");
    } finally {
      setLoading(false);
    }
  }

  function pointerDown(event: PointerEvent<HTMLDivElement>, object: CanvasObject) {
    if (object.type === "group") return;
    setDragId(object.id);
    dragOffset.current = { x: event.clientX - object.x, y: event.clientY - object.y };
    event.currentTarget.setPointerCapture(event.pointerId);
  }

  function pointerMove(event: PointerEvent<HTMLDivElement>) {
    if (!dragId) return;
    setObjects((current) =>
      current.map((object) =>
        object.id === dragId
          ? { ...object, x: Math.max(80, event.clientX - dragOffset.current.x), y: Math.max(80, event.clientY - dragOffset.current.y) }
          : object
      )
    );
  }

  return (
    <main className="canvas-shell">
      <aside className="canvas-sidebar">
        <div className="sidebar-head"><Logo /><button aria-label="collapse sidebar"><ChevronsLeft size={18} /></button></div>
        <button className="new-button" onClick={addNote}><Plus size={18} /> New <ChevronDown size={16} /></button>
        <label className="side-search"><Search size={17} /><input placeholder="Search" /><kbd>Cmd K</kbd></label>
        <SidebarGroup title="Workspaces" items={["Product", "Design", "Engineering", "Go to Market"]} />
        <SidebarGroup title="Starred" items={["Q2 Planning", "Product Vision", "User Research", "Launch Plan", "OKRs"]} />
        <SidebarGroup title="Pages" items={["01 Project Brief", "02 Market Landscape", "03 User Insights", "04 Product Vision", "05 Roadmap"]} />
        <div className="profile-card compact"><span /> <div><strong>Lena Park</strong><small>lena@acme.com</small></div><ChevronDown size={15} /></div>
      </aside>
      <section className="editor">
        <header className="editor-topbar">
          <Logo compact />
          <strong>Product Vision</strong><ChevronDown size={15} />
          <span className="bar-sep" />
          <button title="Undo"><Undo2 size={18} /></button><button title="Redo"><Undo2 size={18} className="flip" /></button>
          <button title="Frame"><ZoomIn size={18} /></button>
          <div className="organizing-pill"><Sparkles size={16} /> {loading ? "AI organizing..." : "AI ready"} <span /></div>
          <div className="avatar-stack"><span /><span /><span /><span /><em>+3</em></div>
          <button className="share-button"><Share2 size={16} /> Share</button>
          <button className="round-mic" onClick={() => runCommand("Organize this canvas", "voice")}><Mic size={21} /></button>
          <button className="gesture-button"><Hand size={19} /> Gesture <ChevronDown size={15} /></button>
        </header>
        <div className="canvas-area" onPointerMove={pointerMove} onPointerUp={() => setDragId(null)} onPointerCancel={() => setDragId(null)}>
          <div className="tool-rail">
            {[MousePointer2, Hand, Pencil, PanelRight, Plus, FileText, Grid3X3, MoreHorizontal, Sparkles].map((Icon, index) => <button key={index}><Icon size={19} /></button>)}
          </div>
          <svg className="connector-layer" width="1500" height="900">
            {connectors.map((connector) => {
              const fromId = String(connector.metadata?.fromId ?? "");
              const toId = String(connector.metadata?.toId ?? "");
              const from = objectMap.get(fromId);
              const to = objectMap.get(toId);
              if (!from || !to) return null;
              const x1 = from.x + (from.width ?? 220);
              const y1 = from.y + (from.height ?? 130) / 2;
              const x2 = to.x;
              const y2 = to.y + (to.height ?? 130) / 2;
              const mid = (x1 + x2) / 2;
              return <path key={connector.id} d={`M ${x1} ${y1} C ${mid} ${y1}, ${mid} ${y2}, ${x2} ${y2}`} stroke={String(connector.metadata?.color ?? blue)} />;
            })}
          </svg>
          {nonConnectors.map((object) => (
            <CanvasCard key={object.id} object={object} onPointerDown={pointerDown} />
          ))}
          <div className="annotation ann-1">focus area</div>
          <div className="annotation ann-2">priority</div>
          <div className="ai-note"><Sparkles size={17} /> <strong>AI organizing the canvas</strong><span>grouping related ideas</span><span>creating connections</span><span>suggesting next steps</span></div>
          <div className="drop-section">Drop here to<br />create a new section</div>
          <VoiceBar onClick={() => runCommand("Organize this canvas", "voice")} />
          <div className="canvas-controls"><button>-</button><span>100%</span><button>+</button><button><ZoomIn size={16} /></button></div>
          <div className="mode-switches"><span><MousePointer2 size={16} /> Select <kbd>V</kbd></span><span><Network size={16} /> Connect <kbd>C</kbd></span><span><Pencil size={16} /> Draw <kbd>D</kbd></span><span><Hand size={16} /> Zoom <kbd>Space</kbd></span></div>
        </div>
      </section>
      <aside className="assistant-panel">
        <div className="assistant-head"><Sparkles size={28} /><strong>voya assistant</strong><button aria-label="collapse assistant"><PanelRight size={18} /></button></div>
        <p>I can help you with:</p>
        <div className="assistant-actions">
          {[
            ["Summarize this space", FileText],
            ["Turn this into tasks", ListChecks],
            ["Create a flow diagram", Workflow],
            ["Find related ideas", Network],
            ["Organize this canvas", WandSparkles]
          ].map(([label, Icon]) => {
            const C = Icon as typeof FileText;
            return (
              <button
                disabled={loading}
                key={String(label)}
                onClick={(event) => {
                  if (event.currentTarget.dataset.pointerHandled !== "true") {
                    void runCommand(label as string);
                  }
                  event.currentTarget.dataset.pointerHandled = "false";
                }}
                onPointerDown={(event) => {
                  event.currentTarget.dataset.pressed = "true";
                }}
                onPointerUp={(event) => {
                  if (event.currentTarget.dataset.pressed === "true") {
                    event.currentTarget.dataset.pressed = "false";
                    event.currentTarget.dataset.pointerHandled = "true";
          void runCommand(label as string);
                  }
                }}
              >
                <C size={17} /> {label as string}
              </button>
            );
          })}
        </div>
        <div className="assistant-summary"><strong>Summary</strong><p>{summary}</p>{trace.length > 0 && <div className="trace-list">{trace.slice(-3).map((item) => <span key={`${item.step}-${item.detail}`}>{item.step}: {item.status}</span>)}</div>}</div>
        <div className="next-step"><strong>Suggested next step</strong><p>{answer || "Create a user journey map based on user insights?"}</p><button onClick={() => runCommand("Create a user journey map based on user insights")}>Create it <Sparkles size={14} /></button></div>
        <form className="assistant-input" onSubmit={(event) => { event.preventDefault(); if (command.trim()) runCommand(command); }}>
          <input value={command} onChange={(event) => setCommand(event.target.value)} placeholder="Ask anything..." />
          <button><Send size={18} /></button>
        </form>
      </aside>
    </main>
  );
}

function makeBrowserPreviewAgentResult(command: string, objects: CanvasObject[]): AgentRunResponse {
  const summary = `This canvas focuses on ${objects
    .filter((object) => object.type !== "connector" && object.type !== "group")
    .slice(0, 4)
    .map((object) => object.title ?? "ideas")
    .join(", ")} and is ready to become a clearer workflow.`;

  const wantsTasks = command.toLowerCase().includes("task");
  const wantsSummary = command.toLowerCase().includes("summar");
  const wantsFlow = command.toLowerCase().includes("flow") || command.toLowerCase().includes("diagram");
  const wantsIdeas = command.toLowerCase().includes("related") || command.toLowerCase().includes("ideas");
  const wantsOrganize = command.toLowerCase().includes("organize");

  let answer = "I captured that as a new note.";
  let actions: CanvasAction[] = [
    {
      type: "create_object",
      payload: {
        id: `note_${Date.now().toString(36)}`,
        type: "note",
        title: command.slice(0, 54),
        text: "Captured from your command.",
        x: 540,
        y: 360,
        width: 230,
        height: 130,
        color: "blue",
        metadata: { generatedBy: "voya" }
      }
    }
  ];

  if (wantsSummary) {
    answer = "I summarized the space.";
    actions = [{ type: "summarize_canvas", payload: { summary } }];
  } else if (wantsTasks) {
    answer = "I turned the strongest notes into task cards with clear next actions.";
    const sources = objects.filter((object) => object.type !== "connector" && object.type !== "group").slice(0, 3);
    const fallback = ["Interview target users", "Prioritize product outcomes", "Draft the first workflow"];
    actions = Array.from({ length: 3 }, (_, index) => {
      const object = sources[index];
      const title = object?.title ?? fallback[index];
      return {
        type: "create_object",
        payload: {
          id: `task_${object?.id ?? `seed_${index}`}_${index + 1}`,
          type: "task",
          title: `Task: ${title}`,
          text: `Turn "${title}" into an owner, deadline, and next step.`,
          x: 520 + index * 220,
          y: 660,
          width: 210,
          height: 126,
          color: "yellow",
          metadata: { generatedBy: "voya" }
        }
      };
    });
  } else if (wantsFlow) {
    answer = "I created a simple flow diagram from the canvas context.";
    const nodes: CanvasAction[] = ["capture", "organize", "decide", "ship"].map((title, index) => ({
      type: "create_object",
      payload: {
        id: `flow_${title}`,
        type: "diagram",
        title,
        x: 480 + index * 180,
        y: 430,
        width: 145,
        height: 82,
        color: index === 1 ? "blue" : "purple",
        metadata: { generatedBy: "voya" }
      }
    }));
    const connectors: CanvasAction[] = ["capture", "organize", "decide"].map((title, index) => ({
      type: "create_connection",
      payload: { id: `conn_flow_${title}`, fromId: `flow_${title}`, toId: `flow_${["organize", "decide", "ship"][index]}`, color: "#0057ff" }
    }));
    actions = [...nodes, ...connectors];
  } else if (wantsIdeas) {
    answer = "I found related ideas and added suggestion cards.";
    actions = ["Map user moments", "Compare workflow patterns", "List decision points"].map((title, index) => ({
      type: "create_object",
      payload: {
        id: `idea_${index + 1}`,
        type: "note",
        title,
        text: "Suggested by voya based on this canvas.",
        x: 980,
        y: 170 + index * 145,
        width: 230,
        height: 118,
        color: "blue",
        metadata: { generatedBy: "voya" }
      }
    }));
  } else if (wantsOrganize) {
    answer = "I organized your canvas into an AI suggested group.";
    actions = [
      { type: "create_group", payload: { id: "group_ai_suggested", title: "AI suggested group", x: 380, y: 455, width: 610, height: 260, color: "blue" } },
      ...objects
        .filter((object) => object.type !== "connector" && object.type !== "group")
        .slice(0, 6)
        .map((object, index) => ({ type: "move_object" as const, payload: { id: object.id, x: 430 + (index % 3) * 180, y: 535 + Math.floor(index / 3) * 90 } }))
    ];
  }

  return {
    answer,
    summary,
    actions,
    trace: [
      { step: "Read canvas context", status: "completed", detail: `Loaded ${objects.length} canvas objects.` },
      { step: "Classify intent", status: "completed", detail: `Detected command: ${command}.` },
      { step: "Generate canvas actions", status: "completed", detail: `Created ${actions.length} structured actions.` },
      { step: "Apply policy", status: "approved", detail: "Approved structured canvas actions." }
    ]
  };
}

function SidebarGroup({ title, items }: { title: string; items: string[] }) {
  return <div className="sidebar-group"><div>{title}<ChevronDown size={15} /></div>{items.map((item, index) => <span className={item === "Product Vision" || item === "Product" ? "active" : ""} key={item}><i>{index + 1}</i>{item}{item === "Q2 Planning" && <Star size={13} fill={blue} />}</span>)}</div>;
}

function CanvasCard({ object, onPointerDown }: { object: CanvasObject; onPointerDown: (event: PointerEvent<HTMLDivElement>, object: CanvasObject) => void }) {
  const isGroup = object.type === "group";
  return (
    <div
      className={`canvas-card ${object.color ?? "blue"} ${isGroup ? "group-card" : ""}`}
      style={{ left: object.x, top: object.y, width: object.width, height: object.height }}
      onPointerDown={(event) => onPointerDown(event, object)}
    >
      <strong>{object.title}</strong>
      {object.type === "diagram" ? <DiagramMini /> : <p>{object.text}</p>}
      {object.metadata?.tag ? <span>{String(object.metadata.tag)}</span> : null}
    </div>
  );
}

function DiagramMini() {
  return <div className="diagram-mini"><span /><span /><span /><span /><i /></div>;
}

function VoiceBar({ onClick }: { onClick: () => void }) {
  return <button className="voice-bar" onClick={onClick}><Mic size={27} /><Waveform darkMode /><span>listening...</span><Hand size={24} /></button>;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/features" element={<FeaturesPage />} />
      <Route path="/pricing" element={<PricingPage />} />
      <Route path="/signin" element={<SignInPage />} />
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="/canvas/:id" element={<CanvasPage />} />
      <Route path="/login" element={<Navigate to="/signin" replace />} />
      <Route path="/signup" element={<Navigate to="/signin" replace />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}
