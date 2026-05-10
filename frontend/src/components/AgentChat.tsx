import { AnimatePresence, motion } from "framer-motion";
import {
  Bot,
  CheckCircle2,
  FileText,
  LockKeyhole,
  MessageSquareText,
  PanelRight,
  ReceiptText,
  Send,
  ShieldCheck,
  SlidersHorizontal,
  UserRound,
  XCircle,
} from "lucide-react";
import { type FormEvent, type ReactNode, useEffect, useRef, useState } from "react";
import { createChatPlan, DEMO_USDC_TOKEN, formatPlannerUsd, type ProposedTabRun } from "../lib/chatPlanner";
import type { Receipt, RunState, TabRunRequest, TabRunResult } from "../lib/types";
import { ApprovalCard, type ApprovalStatus } from "./ApprovalCard";
import { ChatAuditTrail, type LifecycleState } from "./ChatAuditTrail";

type ChatMessage = {
  id: string;
  role: "agent" | "user";
  text: string;
};

interface AgentChatProps {
  runState: RunState;
  result: TabRunResult | null;
  lastInput: TabRunRequest | null;
  onApproveRun: (input: TabRunRequest) => void;
  manualControls: ReactNode;
  runPanel: ReactNode;
}

type ContextTab = "tools" | "policy" | "receipts" | "trace";

const quickPrompts = [
  "Analyze USDC with approval",
  "Tight budget check",
  "One paid call only",
  "Inspect before spending",
];

const INITIAL_AGENT_MESSAGE =
  "Tell me what you want the agent to do. I’ll turn it into a spend request before anything runs.";

const TOOL_CATALOG = [
  {
    id: "market-signal",
    provider: "DexScreener",
    price: "$0.020",
    category: "market-data",
    status: "Available",
    badge: "border-green-500/20 bg-green-500/8 text-green-300",
    decision: "Selected within budget and policy",
    desc: "Real-time DEX liquidity data for token pairs on Base.",
  },
  {
    id: "model-call",
    provider: "Anthropic",
    price: "$0.001",
    category: "inference",
    status: "Conditional",
    badge: "border-amber-500/20 bg-amber-500/8 text-amber-300",
    decision: "Selected if remaining budget allows",
    desc: "Fast synthesis and reasoning at minimal cost.",
  },
  {
    id: "trading-execution",
    provider: "External",
    price: "variable",
    category: "trading-execution",
    status: "Blocked",
    badge: "border-red-500/20 bg-red-500/8 text-red-300",
    decision: "Blocked: category denied by policy",
    desc: "On-chain trade execution. Prevented by Tab policy for this run.",
  },
];

const POLICY_RULES = [
  { label: "Approval mode", value: "Human approval gate", tone: "neutral" },
  { label: "Allowed categories", value: "market-data · inference", tone: "allowed" },
  { label: "Blocked categories", value: "trading-execution", tone: "blocked" },
  { label: "Budget check", value: "Before every spend request", tone: "neutral" },
  { label: "Overspend protection", value: "Hard cap - no overruns", tone: "allowed" },
  { label: "Payment rail", value: "x402 · base-sepolia", tone: "neutral" },
];

const contextTabs: Array<{ id: ContextTab; label: string }> = [
  { id: "tools", label: "Tools" },
  { id: "policy", label: "Policy" },
  { id: "receipts", label: "Receipts" },
  { id: "trace", label: "Trace" },
];

function makeId(prefix: string) {
  return `${prefix}_${Date.now()}_${Math.random().toString(16).slice(2, 8)}`;
}

function statusCopy(status: ApprovalStatus, runState: RunState) {
  if (status === "pending") return "Pending";
  if (status === "inspected") return "Inspected";
  if (status === "declined") return "Declined";
  if (status === "running" || runState.status === "loading") return "Running";
  if (status === "completed" || runState.status === "success") return "Completed";
  if (status === "error" || runState.status === "error") return "Needs review";
  return "Idle";
}

function metricValue(input: TabRunRequest | null, result: TabRunResult | null, proposedRun: ProposedTabRun | null) {
  const budget = proposedRun?.payload.budget_usd ?? input?.budget_usd ?? result?.startingBudgetUsd ?? 0.05;
  const estimated = proposedRun?.estimatedSpendUsd ?? result?.totalSpentUsd ?? 0;
  const remaining = proposedRun?.estimatedRemainingUsd ?? result?.remainingBudgetUsd ?? budget;
  const maxCalls = proposedRun?.payload.max_tool_calls ?? input?.max_tool_calls ?? 3;
  const token = proposedRun?.payload.token ?? input?.token ?? DEMO_USDC_TOKEN;

  return { budget, estimated, remaining, maxCalls, token };
}

function MessageBubble({ message, index }: { message: ChatMessage; index: number }) {
  const isUser = message.role === "user";

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min(index * 0.02, 0.14), duration: 0.22 }}
      className={`flex gap-3 ${isUser ? "justify-end" : "justify-start"}`}
    >
      {!isUser && (
        <span className="mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-[#FF5848]/24 bg-[#FF5848]/12 text-[#FFB39E]">
          <Bot className="h-3.5 w-3.5" />
        </span>
      )}
      <div
        className={`max-w-[86%] rounded-[1.2rem] px-3.5 py-2.5 text-sm leading-6 shadow-[0_10px_28px_rgba(0,0,0,0.12)] ${
          isUser
            ? "rounded-tr-md bg-[#FF5848] text-white"
            : "rounded-tl-md border border-[#FFF8F2]/10 bg-[#FFF8F2]/8 text-[#FFF8F2]/72"
        }`}
      >
        {message.text}
      </div>
      {isUser && (
        <span className="mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-[#FFF8F2]/14 bg-[#FFF8F2]/8 text-[#FFF8F2]/72">
          <UserRound className="h-3.5 w-3.5" />
        </span>
      )}
    </motion.div>
  );
}

function MetricStrip({
  proposedRun,
  result,
  lastInput,
  status,
  runState,
}: {
  proposedRun: ProposedTabRun | null;
  result: TabRunResult | null;
  lastInput: TabRunRequest | null;
  status: ApprovalStatus;
  runState: RunState;
}) {
  const metrics = metricValue(lastInput, result, proposedRun);
  const items = [
    { label: "Budget", value: formatPlannerUsd(metrics.budget) },
    { label: "Estimated spend", value: formatPlannerUsd(metrics.estimated, 3) },
    { label: "Remaining", value: formatPlannerUsd(metrics.remaining) },
    { label: "Max calls", value: String(metrics.maxCalls) },
    { label: "Approval state", value: statusCopy(status, runState) },
  ];

  return (
    <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-5">
      {items.map((item) => (
        <div key={item.label} className="rounded-[1rem] border border-[#FFF8F2]/10 bg-[#100C0B]/36 px-3 py-2.5">
          <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-[#FFF8F2]/34">{item.label}</p>
          <p className="mt-1 truncate font-mono text-sm font-bold text-[#FFF8F2]">{item.value}</p>
        </div>
      ))}
      <div className="rounded-[1rem] border border-[#FFF8F2]/10 bg-[#100C0B]/36 px-3 py-2.5 sm:col-span-2 xl:col-span-5">
        <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-[#FFF8F2]/34">Token</p>
        <p className="mt-1 break-all font-mono text-[11px] text-[#FFF8F2]/62">{metrics.token}</p>
      </div>
    </div>
  );
}

function ProposedPlanSummary({ proposedRun }: { proposedRun: ProposedTabRun }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-[1.25rem] border border-[#FFF8F2]/12 bg-[#1E1917]/42 p-4"
    >
      <div className="mb-3 flex items-start justify-between gap-3">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#FF5848]">Proposed plan</p>
          <h3 className="mt-1 text-base font-semibold text-[#FFF8F2]">Paid tool request ready for approval.</h3>
        </div>
        <span className="inline-flex items-center gap-1.5 rounded-full border border-[#F0B28C]/24 bg-[#F0B28C]/10 px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.14em] text-[#FFD0BB]">
          <LockKeyhole className="h-3 w-3" />
          Approval
        </span>
      </div>

      <dl className="grid gap-2 text-xs">
        <div className="rounded-xl border border-[#FFF8F2]/8 bg-[#FFF8F2]/5 p-3">
          <dt className="text-[#FFF8F2]/38">Purpose</dt>
          <dd className="mt-1 leading-5 text-[#FFF8F2]/72">{proposedRun.payload.goal}</dd>
        </div>
        <div className="grid gap-2 sm:grid-cols-3">
          <div className="rounded-xl border border-[#FFF8F2]/8 bg-[#FFF8F2]/5 p-3">
            <dt className="text-[#FFF8F2]/38">Budget</dt>
            <dd className="mt-1 font-mono font-bold text-amber-300">{formatPlannerUsd(proposedRun.payload.budget_usd)}</dd>
          </div>
          <div className="rounded-xl border border-[#FFF8F2]/8 bg-[#FFF8F2]/5 p-3">
            <dt className="text-[#FFF8F2]/38">Estimate</dt>
            <dd className="mt-1 font-mono font-bold text-amber-300">{formatPlannerUsd(proposedRun.estimatedSpendUsd, 3)}</dd>
          </div>
          <div className="rounded-xl border border-[#FFF8F2]/8 bg-[#FFF8F2]/5 p-3">
            <dt className="text-[#FFF8F2]/38">Max calls</dt>
            <dd className="mt-1 font-mono font-bold text-[#FFF8F2]">{proposedRun.payload.max_tool_calls}</dd>
          </div>
        </div>
      </dl>
    </motion.section>
  );
}

function EmptyApprovalState({ runState }: { runState: RunState }) {
  const copy =
    runState.status === "idle"
      ? "Send a chat request or open a manual Tab to activate the spend approval surface."
      : "The latest Tab run is active below.";

  return (
    <div className="rounded-[1.75rem] border border-dashed border-[#FFF8F2]/16 bg-[#1E1917]/28 p-6">
      <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-full border border-[#FF5848]/24 bg-[#FF5848]/10 text-[#FFB39E]">
        <ShieldCheck className="h-5 w-5" />
      </div>
      <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#FFF8F2]/38">Active approval</p>
      <h3 className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-[#FFF8F2]">No pending spend request</h3>
      <p className="mt-3 max-w-md text-sm leading-6 text-[#FFF8F2]/56">{copy}</p>
    </div>
  );
}

function ReceiptRows({ receipts }: { receipts: Receipt[] }) {
  if (receipts.length === 0) {
    return (
      <div className="rounded-[1.25rem] border border-dashed border-[#FFF8F2]/14 bg-[#FFF8F2]/5 p-4">
        <p className="text-sm font-semibold text-[#FFF8F2]">No receipts yet</p>
        <p className="mt-2 text-xs leading-5 text-[#FFF8F2]/50">
          Receipts are only written for approved calls. Declined approvals do not create fake receipt entries.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {receipts.map((receipt, index) => (
        <motion.div
          key={receipt.id}
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.05 }}
          className="rounded-[1.1rem] border border-[#FFF8F2]/10 bg-[#FFF8F2]/5 p-3"
        >
          <div className="mb-2 flex items-start justify-between gap-3">
            <p className="break-all font-mono text-[10px] font-bold uppercase tracking-[0.08em] text-[#FFF8F2]/42">
              {receipt.id}
            </p>
            <span className="rounded-full border border-green-500/20 bg-green-500/8 px-2 py-0.5 text-[9px] font-bold uppercase tracking-widest text-green-300">
              {receipt.status}
            </span>
          </div>
          <dl className="grid grid-cols-2 gap-2 text-xs">
            <div>
              <dt className="text-[#FFF8F2]/38">Tool</dt>
              <dd className="mt-0.5 font-mono font-semibold text-[#FFF8F2]">{receipt.tool}</dd>
            </div>
            <div>
              <dt className="text-[#FFF8F2]/38">Amount</dt>
              <dd className="mt-0.5 font-mono font-bold text-amber-300">{formatPlannerUsd(receipt.amountUsd, 3)}</dd>
            </div>
            <div>
              <dt className="text-[#FFF8F2]/38">Provider</dt>
              <dd className="mt-0.5 text-[#FFF8F2]/70">{receipt.provider}</dd>
            </div>
            <div>
              <dt className="text-[#FFF8F2]/38">Rail</dt>
              <dd className="mt-0.5 font-mono text-[#FFF8F2]/58">{receipt.rail} · {receipt.network}</dd>
            </div>
          </dl>
        </motion.div>
      ))}
    </div>
  );
}

function ContextPanel({
  activeTab,
  onTabChange,
  result,
  lifecycleState,
  auditEvents,
}: {
  activeTab: ContextTab;
  onTabChange: (tab: ContextTab) => void;
  result: TabRunResult | null;
  lifecycleState: LifecycleState;
  auditEvents: string[];
}) {
  return (
    <aside className="dashboard-context-column tab-card overflow-hidden rounded-[1.75rem] xl:sticky xl:top-[4.5rem]">
      <div className="border-b border-[#FFF8F2]/10 p-4">
        <div className="mb-3 flex items-center justify-between gap-3">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#FFF8F2]/40">Context panel</p>
            <h2 className="mt-1 text-lg font-semibold text-[#FFF8F2]">Tools, policy, receipts, trace</h2>
          </div>
          <PanelRight className="h-5 w-5 text-[#FFB39E]" />
        </div>
        <div className="grid grid-cols-4 gap-1 rounded-2xl border border-[#FFF8F2]/10 bg-[#100C0B]/42 p-1">
          {contextTabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => onTabChange(tab.id)}
              className={`h-9 rounded-xl text-xs font-bold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF5848]/50 ${
                activeTab === tab.id
                  ? "bg-[#FF5848] text-white shadow-[0_10px_24px_rgba(255,88,72,0.2)]"
                  : "text-[#FFF8F2]/46 hover:bg-[#FFF8F2]/7 hover:text-[#FFF8F2]"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="dashboard-context-body p-4">
        <AnimatePresence mode="wait">
          {activeTab === "tools" && (
            <motion.div
              key="tools"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              className="space-y-3"
            >
              {TOOL_CATALOG.map((tool) => (
                <article key={tool.id} className="rounded-[1.25rem] border border-[#FFF8F2]/10 bg-[#FFF8F2]/5 p-4">
                  <div className="mb-3 flex items-start justify-between gap-3">
                    <div>
                      <h3 className="font-mono text-base font-black text-[#FFF8F2]">{tool.id}</h3>
                      <p className="mt-0.5 text-xs text-[#FFF8F2]/46">
                        {tool.provider} · {tool.category}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-mono text-sm font-black text-amber-300">{tool.price}</p>
                      <span className={`mt-1 inline-flex rounded-full border px-2 py-0.5 text-[9px] font-bold uppercase tracking-widest ${tool.badge}`}>
                        {tool.status}
                      </span>
                    </div>
                  </div>
                  <p className="text-xs leading-5 text-[#FFF8F2]/58">{tool.desc}</p>
                  <p className="mt-2 font-mono text-[10px] text-[#FFF8F2]/32">{tool.decision}</p>
                </article>
              ))}
            </motion.div>
          )}

          {activeTab === "policy" && (
            <motion.div
              key="policy"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              className="rounded-[1.25rem] border border-[#FFF8F2]/10 bg-[#FFF8F2]/5"
            >
              {POLICY_RULES.map((rule) => (
                <div key={rule.label} className="flex items-center justify-between gap-4 border-b border-[#FFF8F2]/10 px-4 py-3 last:border-b-0">
                  <span className="text-xs text-[#FFF8F2]/45">{rule.label}</span>
                  <span
                    className={`text-right font-mono text-xs font-semibold ${
                      rule.tone === "allowed"
                        ? "text-green-300"
                        : rule.tone === "blocked"
                        ? "text-red-300"
                        : "text-[#FFF8F2]/72"
                    }`}
                  >
                    {rule.value}
                  </span>
                </div>
              ))}
            </motion.div>
          )}

          {activeTab === "receipts" && (
            <motion.div
              key="receipts"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              className="space-y-3"
            >
              <div className="flex items-center justify-between gap-3">
                <p className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.18em] text-[#FFF8F2]/44">
                  <ReceiptText className="h-4 w-4 text-[#FF5848]" />
                  Latest run receipts
                </p>
                <span className="rounded-full border border-[#FFF8F2]/14 px-2.5 py-0.5 font-mono text-[10px] text-[#FFF8F2]/48">
                  {result?.receipts.length ?? 0} paid
                </span>
              </div>
              <ReceiptRows receipts={result?.receipts ?? []} />
            </motion.div>
          )}

          {activeTab === "trace" && (
            <motion.div
              key="trace"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
            >
              <ChatAuditTrail lifecycleState={lifecycleState} auditEvents={auditEvents} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </aside>
  );
}

export function AgentChat({ runState, result, lastInput, onApproveRun, manualControls, runPanel }: AgentChatProps) {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: "agent_initial", role: "agent", text: INITIAL_AGENT_MESSAGE },
  ]);
  const [proposedRun, setProposedRun] = useState<ProposedTabRun | null>(null);
  const [approvalStatus, setApprovalStatus] = useState<ApprovalStatus>("idle");
  const [inspectOpen, setInspectOpen] = useState(false);
  const [auditEvents, setAuditEvents] = useState<string[]>([]);
  const [lifecycleState, setLifecycleState] = useState<LifecycleState>("idle");
  const [planning, setPlanning] = useState(false);
  const [activeContextTab, setActiveContextTab] = useState<ContextTab>("tools");
  const sequenceRef = useRef(1);
  const timersRef = useRef<number[]>([]);

  useEffect(() => {
    return () => {
      timersRef.current.forEach((timer) => window.clearTimeout(timer));
    };
  }, []);

  useEffect(() => {
    if (approvalStatus !== "running") return;

    if (runState.status === "success") {
      const runResult = runState.result;
      setApprovalStatus("completed");
      setLifecycleState("closed");
      setActiveContextTab("receipts");
      setAuditEvents((events) => [
        ...events,
        "Run executed through /v1/tab/run.",
        `Receipt ledger updated with ${runResult.receipts.length} receipt(s).`,
      ]);
      setMessages((current) => [
        ...current,
        {
          id: makeId("agent_complete"),
          role: "agent",
          text: `Tab closed. I spent ${formatPlannerUsd(runResult.totalSpentUsd, 3)}, returned ${formatPlannerUsd(runResult.remainingBudgetUsd)}, and wrote ${runResult.receipts.length} receipt(s).`,
        },
      ]);
    }

    if (runState.status === "error") {
      setApprovalStatus("error");
      setLifecycleState("error");
      setActiveContextTab("trace");
      setAuditEvents((events) => [...events, "Approved run returned an error before closing Tab."]);
      setMessages((current) => [
        ...current,
        {
          id: makeId("agent_error"),
          role: "agent",
          text: `The approved Tab run failed: ${runState.error}`,
        },
      ]);
    }
  }, [approvalStatus, runState]);

  const appendAgentMessageLater = (text: string, delay: number) => {
    const timer = window.setTimeout(() => {
      setMessages((current) => [...current, { id: makeId("agent"), role: "agent", text }]);
    }, delay);
    timersRef.current.push(timer);
  };

  const planFromMessage = (rawMessage: string) => {
    const message = rawMessage.trim();
    if (!message || planning || approvalStatus === "running") return;

    timersRef.current.forEach((timer) => window.clearTimeout(timer));
    timersRef.current = [];

    const nextPlan = createChatPlan(message, sequenceRef.current);
    sequenceRef.current += 1;

    setInput("");
    setPlanning(true);
    setProposedRun(null);
    setInspectOpen(false);
    setApprovalStatus("idle");
    setLifecycleState("message");
    setActiveContextTab("trace");
    setAuditEvents(["Message received from human operator."]);
    setMessages((current) => [...current, { id: makeId("user"), role: "user", text: message }]);

    appendAgentMessageLater("I parsed the goal and budget.", 220);
    appendAgentMessageLater("I found a paid tool plan.", 520);
    appendAgentMessageLater("Tab needs approval before executing this spend.", 820);

    const timer = window.setTimeout(() => {
      setProposedRun(nextPlan);
      setApprovalStatus("pending");
      setLifecycleState("waiting");
      setActiveContextTab("policy");
      setAuditEvents((events) => [
        ...events,
        "Plan created from chat message.",
        "Approval requested for proposed Tab run.",
      ]);
      setPlanning(false);
    }, 900);
    timersRef.current.push(timer);
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    planFromMessage(input);
  };

  const handleInspect = () => {
    setInspectOpen((open) => !open);
    setApprovalStatus((status) => (status === "pending" ? "inspected" : status));
    setLifecycleState((state) =>
      state === "declined" || state === "running" || state === "closed" || state === "error" ? state : "inspected"
    );
    setActiveContextTab("trace");
    setAuditEvents((events) =>
      events.includes("Human inspected request payload and budget impact.")
        ? events
        : [...events, "Human inspected request payload and budget impact."]
    );
  };

  const handleDecline = () => {
    if (!proposedRun || approvalStatus === "running") return;
    setApprovalStatus("declined");
    setLifecycleState("declined");
    setActiveContextTab("trace");
    setAuditEvents((events) => [...events, "Human declined proposed Tab run."]);
    setMessages((current) => [
      ...current,
      {
        id: makeId("agent_declined"),
        role: "agent",
        text: "No paid call executed. No receipt created.",
      },
    ]);
  };

  const handleApprove = () => {
    if (!proposedRun || approvalStatus === "running") return;
    setApprovalStatus("running");
    setLifecycleState("running");
    setActiveContextTab("trace");
    setAuditEvents((events) => [...events, "Human approved proposed Tab run."]);
    setMessages((current) => [
      ...current,
      { id: makeId("agent_approved"), role: "agent", text: "Approved. Running the Tab plan now." },
    ]);
    onApproveRun(proposedRun.payload);
  };

  const promptFromChip = (chip: string) => {
    const prompts: Record<string, string> = {
      "Analyze USDC with approval": "Analyze USDC on Base with a 5 cent budget, ask me before spending.",
      "Tight budget check": "Analyze USDC on Base with a tight 2.05 cent budget, ask me before spending.",
      "One paid call only": "Analyze USDC on Base with a 5 cent budget and one call maximum.",
      "Inspect before spending": "Analyze USDC on Base with a 5 cent budget, but ask me before spending.",
    };
    planFromMessage(prompts[chip] ?? chip);
  };

  const isBusy = planning || approvalStatus === "running" || runState.status === "loading";
  const showRunPanel =
    runState.status !== "idle" &&
    (approvalStatus === "idle" || approvalStatus === "running" || approvalStatus === "completed" || approvalStatus === "error");

  return (
    <motion.section
      id="agent-chat"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.36, ease: [0.16, 1, 0.3, 1] }}
      className="space-y-4"
    >
      <header className="tab-card overflow-hidden rounded-[1.75rem]">
        <div className="grid gap-4 p-4 lg:grid-cols-[minmax(0,1fr)_minmax(360px,0.72fr)] lg:items-end">
          <div>
            <div className="mb-3 flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-2 rounded-full border border-[#FF5848]/26 bg-[#FF5848]/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-[#FFB39E]">
                <MessageSquareText className="h-3.5 w-3.5" />
                Agent Chat
              </span>
              <span className="inline-flex items-center gap-2 rounded-full border border-[#0E4A43]/45 bg-[#0E4A43]/18 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-[#9BE3D6]">
                <ShieldCheck className="h-3.5 w-3.5" />
                Human approval gate
              </span>
            </div>
            <h1 className="text-[clamp(2rem,3.2vw,3.6rem)] font-semibold leading-none tracking-[-0.055em] text-[#FFF8F2]">
              Agent spend control
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-[#FFF8F2]/62">
              Chat with an agent, inspect the paid tool plan, and approve x402-backed spend before execution.
            </p>
            <p className="mt-1.5 text-xs leading-5 text-[#FFF8F2]/42">
              Chat planning is deterministic for this demo. Approved runs execute through /v1/tab/run.
            </p>
          </div>
          <MetricStrip
            proposedRun={proposedRun}
            result={result}
            lastInput={lastInput}
            status={approvalStatus}
            runState={runState}
          />
        </div>
      </header>

      <div className="dashboard-workspace-grid">
        <section className="dashboard-command-column tab-card overflow-hidden rounded-[1.75rem]">
          <div className="border-b border-[#FFF8F2]/10 p-4">
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#FF5848]">Agent command</p>
            <h2 className="mt-1 text-xl font-semibold text-[#FFF8F2]">Chat request</h2>
          </div>

          <div className="dashboard-command-body space-y-4 p-4">
            <div className="dashboard-command-log min-h-[250px] rounded-[1.35rem] border border-[#FFF8F2]/10 bg-[#100C0B]/38 p-4">
              <div className="space-y-3">
                {messages.map((message, index) => (
                  <MessageBubble key={message.id} message={message} index={index} />
                ))}
                {planning && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-3 text-xs text-[#FFF8F2]/42">
                    <span className="h-2 w-2 animate-pulse rounded-full bg-[#FF5848]" />
                    Planning spend request
                  </motion.div>
                )}
              </div>
            </div>

            <form onSubmit={handleSubmit} className="rounded-[1.35rem] border border-[#FFF8F2]/10 bg-[#1E1917]/34 p-3">
              <div className="mb-3 flex flex-wrap gap-2">
                {quickPrompts.map((chip) => (
                  <button
                    key={chip}
                    type="button"
                    disabled={isBusy}
                    onClick={() => promptFromChip(chip)}
                    className="cursor-pointer rounded-full border border-[#FFF8F2]/12 bg-[#FFF8F2]/6 px-3 py-1.5 text-xs font-semibold text-[#FFF8F2]/64 transition hover:border-[#FF5848]/40 hover:text-[#FFF8F2] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF5848]/60 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    {chip}
                  </button>
                ))}
              </div>
              <div className="flex gap-3">
                <input
                  value={input}
                  onChange={(event) => setInput(event.target.value)}
                  placeholder="Analyze USDC on Base with a 5 cent budget, ask me before spending."
                  disabled={isBusy}
                  className="min-h-12 min-w-0 flex-1 rounded-2xl border border-[#FFF8F2]/10 bg-[#100C0B]/58 px-4 text-sm text-[#FFF8F2] outline-none transition placeholder:text-[#FFF8F2]/28 focus:border-[#FF5848]/50 focus:ring-2 focus:ring-[#FF5848]/14 disabled:opacity-55"
                />
                <button
                  type="submit"
                  disabled={!input.trim() || isBusy}
                  className="inline-flex h-12 w-12 shrink-0 cursor-pointer items-center justify-center rounded-2xl bg-[#FF5848] text-white shadow-[0_16px_38px_rgba(255,88,72,0.22)] transition hover:bg-[#F05A4A] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFF8F2]/75 disabled:cursor-not-allowed disabled:opacity-40"
                  aria-label="Send chat message"
                >
                  <Send className="h-4 w-4" />
                </button>
              </div>
            </form>

            <AnimatePresence>
              {proposedRun && <ProposedPlanSummary proposedRun={proposedRun} />}
            </AnimatePresence>

            <details className="group rounded-[1.35rem] border border-[#FFF8F2]/10 bg-[#1E1917]/34">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-3 text-sm font-semibold text-[#FFF8F2] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF5848]/60">
                <span className="inline-flex items-center gap-2">
                  <SlidersHorizontal className="h-4 w-4 text-[#FFB39E]" />
                  Advanced run controls
                </span>
                <span className="text-xs text-[#FFF8F2]/40 group-open:hidden">Open manual form</span>
                <span className="hidden text-xs text-[#FFF8F2]/40 group-open:inline">Collapse</span>
              </summary>
              <div className="border-t border-[#FFF8F2]/10 p-3">{manualControls}</div>
            </details>
          </div>
        </section>

        <section className="dashboard-approval-column tab-card overflow-hidden rounded-[1.75rem]">
          <div className="flex items-center justify-between gap-3 border-b border-[#FFF8F2]/10 p-4">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#FF5848]">Live spend state</p>
              <h2 className="mt-1 text-xl font-semibold text-[#FFF8F2]">Approval and run</h2>
            </div>
            <span className="rounded-full border border-[#FFF8F2]/14 bg-[#FFF8F2]/7 px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-widest text-[#FFF8F2]/58">
              {statusCopy(approvalStatus, runState)}
            </span>
          </div>

          <div className="dashboard-approval-body space-y-4 p-4">
            <AnimatePresence mode="wait">
              {proposedRun ? (
                <ApprovalCard
                  key={proposedRun.id}
                  proposedRun={proposedRun}
                  status={approvalStatus}
                  inspectOpen={inspectOpen}
                  isRunning={runState.status === "loading"}
                  onInspect={handleInspect}
                  onApprove={handleApprove}
                  onDecline={handleDecline}
                />
              ) : (
                <EmptyApprovalState key="empty-approval" runState={runState} />
              )}
            </AnimatePresence>

            {showRunPanel && (
              <div className="rounded-[1.5rem] border border-[#FFF8F2]/10 bg-[#100C0B]/30 p-3">
                {runPanel}
              </div>
            )}
          </div>
        </section>

        <ContextPanel
          activeTab={activeContextTab}
          onTabChange={setActiveContextTab}
          result={result}
          lifecycleState={lifecycleState}
          auditEvents={auditEvents}
        />
      </div>

      <div className="grid gap-3 text-xs text-[#FFF8F2]/48 md:grid-cols-3">
        {[
          { label: "Approve the paid tool plan before execution.", Icon: CheckCircle2 },
          { label: "Declining stops the run before any paid call executes.", Icon: XCircle },
          { label: "Receipts are only written for approved calls.", Icon: FileText },
        ].map(({ label, Icon }) => (
          <div key={label} className="flex items-center gap-3 rounded-[1rem] border border-[#FFF8F2]/10 bg-[#1E1917]/28 px-3 py-2.5">
            <Icon className="h-4 w-4 shrink-0 text-[#FFB39E]" />
            <p>{label}</p>
          </div>
        ))}
      </div>
    </motion.section>
  );
}
