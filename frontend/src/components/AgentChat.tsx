import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowUpRight,
  Bot,
  CheckCircle2,
  CircleDollarSign,
  FileText,
  LockKeyhole,
  MessageSquareText,
  Send,
  ShieldCheck,
  UserRound,
  WalletCards,
  XCircle,
} from "lucide-react";
import { type FormEvent, useEffect, useRef, useState } from "react";
import { createChatPlan, formatPlannerUsd, type ProposedTabRun } from "../lib/chatPlanner";
import type { RunState, TabRunRequest } from "../lib/types";
import { ApprovalCard, type ApprovalStatus } from "./ApprovalCard";
import { ChatAuditTrail, type LifecycleState } from "./ChatAuditTrail";

type ChatMessage = {
  id: string;
  role: "agent" | "user";
  text: string;
};

interface AgentChatProps {
  runState: RunState;
  onApproveRun: (input: TabRunRequest) => void;
}

const quickPrompts = [
  "Analyze USDC with approval",
  "Tight budget check",
  "One paid call only",
  "Inspect before spending",
];

const INITIAL_AGENT_MESSAGE =
  "Tell me what you want the agent to do. I’ll turn it into a spend request before anything runs.";

function makeId(prefix: string) {
  return `${prefix}_${Date.now()}_${Math.random().toString(16).slice(2, 8)}`;
}

function MessageBubble({ message, index }: { message: ChatMessage; index: number }) {
  const isUser = message.role === "user";

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min(index * 0.025, 0.18), duration: 0.28 }}
      className={`flex gap-3 ${isUser ? "justify-end" : "justify-start"}`}
    >
      {!isUser && (
        <span className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[#FF5848]/26 bg-[#FF5848]/12 text-[#FFB39E]">
          <Bot className="h-4 w-4" />
        </span>
      )}
      <div
        className={`max-w-[82%] rounded-2xl px-4 py-3 text-sm leading-6 shadow-[0_12px_30px_rgba(0,0,0,0.12)] ${
          isUser
            ? "rounded-tr-md bg-[#FF5848] text-white"
            : "rounded-tl-md border border-[#FFF8F2]/10 bg-[#FFF8F2]/8 text-[#FFF8F2]/72"
        }`}
      >
        {message.text}
      </div>
      {isUser && (
        <span className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[#FFF8F2]/14 bg-[#FFF8F2]/8 text-[#FFF8F2]/72">
          <UserRound className="h-4 w-4" />
        </span>
      )}
    </motion.div>
  );
}

function ProposedPlanCard({ proposedRun }: { proposedRun: ProposedTabRun }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-[1.5rem] border border-[#FFF8F2]/12 bg-[#1E1917]/38 p-4 sm:p-5"
    >
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#FF5848]">Proposed Plan</p>
          <h3 className="mt-1 text-lg font-semibold tracking-[-0.04em] text-[#FFF8F2]">
            Approve the paid tool plan before execution.
          </h3>
        </div>
        <span className="inline-flex w-fit items-center gap-2 rounded-full border border-[#F0B28C]/24 bg-[#F0B28C]/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-[#FFD0BB]">
          <LockKeyhole className="h-3.5 w-3.5" />
          Human approval required
        </span>
      </div>

      <dl className="grid gap-3 text-xs md:grid-cols-3">
        <div className="md:col-span-3 rounded-2xl border border-[#FFF8F2]/8 bg-[#FFF8F2]/5 p-3">
          <dt className="text-[#FFF8F2]/38">Goal</dt>
          <dd className="mt-1 text-sm leading-6 text-[#FFF8F2]/74">{proposedRun.payload.goal}</dd>
        </div>
        <div className="rounded-2xl border border-[#FFF8F2]/8 bg-[#FFF8F2]/5 p-3">
          <dt className="text-[#FFF8F2]/38">Token / asset address</dt>
          <dd className="mt-1 break-all font-mono text-[11px] text-[#FFF8F2]/72">{proposedRun.payload.token}</dd>
        </div>
        <div className="rounded-2xl border border-[#FFF8F2]/8 bg-[#FFF8F2]/5 p-3">
          <dt className="text-[#FFF8F2]/38">Chain</dt>
          <dd className="mt-1 font-mono font-bold text-[#FFF8F2]">Base</dd>
        </div>
        <div className="rounded-2xl border border-[#FFF8F2]/8 bg-[#FFF8F2]/5 p-3">
          <dt className="text-[#FFF8F2]/38">Budget</dt>
          <dd className="mt-1 font-mono font-bold text-amber-300">{formatPlannerUsd(proposedRun.payload.budget_usd)}</dd>
        </div>
        <div className="rounded-2xl border border-[#FFF8F2]/8 bg-[#FFF8F2]/5 p-3">
          <dt className="text-[#FFF8F2]/38">Max calls</dt>
          <dd className="mt-1 font-mono font-bold text-[#FFF8F2]">{proposedRun.payload.max_tool_calls}</dd>
        </div>
        <div className="rounded-2xl border border-[#FFF8F2]/8 bg-[#FFF8F2]/5 p-3">
          <dt className="text-[#FFF8F2]/38">Estimated max spend</dt>
          <dd className="mt-1 font-mono font-bold text-amber-300">{formatPlannerUsd(proposedRun.estimatedSpendUsd, 3)}</dd>
        </div>
        <div className="rounded-2xl border border-[#FFF8F2]/8 bg-[#FFF8F2]/5 p-3">
          <dt className="text-[#FFF8F2]/38">Estimated remaining</dt>
          <dd className="mt-1 font-mono font-bold text-green-300">{formatPlannerUsd(proposedRun.estimatedRemainingUsd)}</dd>
        </div>
      </dl>

      <div className="mt-4 grid gap-3 lg:grid-cols-[1fr_0.8fr]">
        <div className="rounded-2xl border border-[#FFF8F2]/8 bg-[#FFF8F2]/5 p-3">
          <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.16em] text-[#FFF8F2]/40">Tool plan</p>
          <div className="space-y-2">
            {proposedRun.tools.map((tool) => (
              <div key={tool.id} className="flex items-center justify-between gap-3 rounded-xl bg-[#1E1917]/42 px-3 py-2">
                <span className="text-xs font-semibold text-[#FFF8F2]/70">{tool.label}</span>
                <span className="font-mono text-xs font-bold text-amber-300">{formatPlannerUsd(tool.priceUsd, 3)}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-2xl border border-[#0E4A43]/42 bg-[#0E4A43]/16 p-3">
          <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.16em] text-[#9BE3D6]">Policy</p>
          <p className="text-sm font-semibold text-[#FFF8F2]">Human approval required</p>
          {proposedRun.warnings.map((warning) => (
            <p key={warning} className="mt-2 text-xs leading-5 text-amber-200">{warning}</p>
          ))}
          {proposedRun.notes.map((note) => (
            <p key={note} className="mt-2 text-xs leading-5 text-[#FFF8F2]/48">{note}</p>
          ))}
        </div>
      </div>
    </motion.section>
  );
}

export function AgentChat({ runState, onApproveRun }: AgentChatProps) {
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
      const result = runState.result;
      setApprovalStatus("completed");
      setLifecycleState("closed");
      setAuditEvents((events) => [
        ...events,
        "Run executed through /v1/tab/run.",
        `Receipt ledger updated with ${result.receipts.length} receipt(s).`,
      ]);
      setMessages((current) => [
        ...current,
        {
          id: makeId("agent_complete"),
          role: "agent",
          text: `Tab closed. I spent ${formatPlannerUsd(result.totalSpentUsd, 3)}, returned ${formatPlannerUsd(result.remainingBudgetUsd)}, and wrote ${result.receipts.length} receipt(s).`,
        },
      ]);
    }

    if (runState.status === "error") {
      setApprovalStatus("error");
      setLifecycleState("error");
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
    setAuditEvents(["Message received from human operator."]);
    setMessages((current) => [...current, { id: makeId("user"), role: "user", text: message }]);

    appendAgentMessageLater("I parsed the goal and budget.", 280);
    appendAgentMessageLater("I found a paid tool plan.", 680);
    appendAgentMessageLater("Tab needs approval before executing this spend.", 1080);

    const timer = window.setTimeout(() => {
      setProposedRun(nextPlan);
      setApprovalStatus("pending");
      setLifecycleState("waiting");
      setAuditEvents((events) => [
        ...events,
        "Plan created from chat message.",
        "Approval requested for proposed Tab run.",
      ]);
      setPlanning(false);
    }, 1180);
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
    setAuditEvents((events) => [...events, "Human declined proposed Tab run."]);
    setMessages((current) => [
      ...current,
      {
        id: makeId("agent_declined"),
        role: "agent",
        text: "Spend request declined. No paid tool call was executed and no receipt was created.",
      },
    ]);
  };

  const handleApprove = () => {
    if (!proposedRun || approvalStatus === "running") return;
    setApprovalStatus("running");
    setLifecycleState("running");
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

  return (
    <motion.section
      id="agent-chat"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      className="tab-card overflow-hidden rounded-[2rem]"
    >
      <div className="relative overflow-hidden border-b border-[#FFF8F2]/10 p-5 sm:p-6">
        <div className="pointer-events-none absolute right-[-120px] top-[-140px] h-72 w-72 rounded-full bg-[#0E4A43]/34 blur-3xl" />
        <div className="pointer-events-none absolute bottom-[-160px] left-[28%] h-64 w-64 rounded-full bg-[#FF5848]/14 blur-3xl" />
        <div className="relative grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <div className="mb-4 flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-2 rounded-full border border-[#FF5848]/26 bg-[#FF5848]/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-[#FFB39E]">
                <MessageSquareText className="h-3.5 w-3.5" />
                Agent Chat
              </span>
              <span className="inline-flex items-center gap-2 rounded-full border border-[#0E4A43]/45 bg-[#0E4A43]/18 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-[#9BE3D6]">
                <ShieldCheck className="h-3.5 w-3.5" />
                Human approval gate
              </span>
            </div>
            <h2 className="text-3xl font-semibold tracking-[-0.055em] text-[#FFF8F2] sm:text-4xl">
              Agent Chat
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-[#FFF8F2]/64">
              Chat with an agent, inspect its paid tool plan, and approve spend before anything runs.
            </p>
            <p className="mt-2 text-xs leading-5 text-[#FFF8F2]/42">
              Chat planning is deterministic for this demo. Approved runs execute through /v1/tab/run.
            </p>
          </div>

          <div className="rounded-2xl border border-[#FFF8F2]/10 bg-[#1E1917]/42 p-4 lg:w-[310px]">
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#FFF8F2]/40">Control posture</p>
            <p className="mt-2 text-sm leading-6 text-[#FFF8F2]/68">
              Tab does not just let agents pay. It lets humans control what agents are allowed to buy.
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-5 p-5 sm:p-6 xl:grid-cols-[minmax(0,1fr)_360px]">
        <div className="space-y-5">
          <div className="min-h-[320px] rounded-[1.5rem] border border-[#FFF8F2]/10 bg-[#100C0B]/36 p-4">
            <div className="space-y-4">
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

          <form onSubmit={handleSubmit} className="rounded-[1.5rem] border border-[#FFF8F2]/10 bg-[#1E1917]/34 p-3">
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
                placeholder="Analyze USDC on Base with a 5 cent budget, but ask me before spending."
                disabled={isBusy}
                className="min-h-12 flex-1 rounded-2xl border border-[#FFF8F2]/10 bg-[#100C0B]/58 px-4 text-sm text-[#FFF8F2] outline-none transition placeholder:text-[#FFF8F2]/28 focus:border-[#FF5848]/50 focus:ring-2 focus:ring-[#FF5848]/14 disabled:opacity-55"
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
            {proposedRun && (
              <motion.div
                key={proposedRun.id}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="space-y-4"
              >
                <ProposedPlanCard proposedRun={proposedRun} />
                <ApprovalCard
                  proposedRun={proposedRun}
                  status={approvalStatus}
                  inspectOpen={inspectOpen}
                  isRunning={runState.status === "loading"}
                  onInspect={handleInspect}
                  onApprove={handleApprove}
                  onDecline={handleDecline}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <aside className="space-y-4">
          <div className="rounded-[1.5rem] border border-[#FFF8F2]/10 bg-[#1E1917]/34 p-4">
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#FF5848]">Session guardrails</p>
            <div className="mt-4 space-y-3">
              {[
                { label: "Approve the paid tool plan before execution.", Icon: CheckCircle2 },
                { label: "Declining stops the run before any paid call executes.", Icon: XCircle },
                { label: "Receipts are only written for approved calls.", Icon: FileText },
                { label: "Approved runs use the existing Tab backend.", Icon: ArrowUpRight },
              ].map(({ label, Icon }) => (
                <div key={label} className="flex gap-3 rounded-2xl border border-[#FFF8F2]/8 bg-[#FFF8F2]/5 p-3">
                  <Icon className="mt-0.5 h-4 w-4 shrink-0 text-[#FFB39E]" />
                  <p className="text-xs leading-5 text-[#FFF8F2]/58">{label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[1.5rem] border border-[#FFF8F2]/10 bg-[#1E1917]/34 p-4">
            <p className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.18em] text-[#FFF8F2]/42">
              <CircleDollarSign className="h-4 w-4 text-[#FF5848]" />
              Price memory
            </p>
            <div className="mt-4 space-y-2">
              <div className="flex items-center justify-between rounded-xl bg-[#FFF8F2]/5 px-3 py-2 text-xs">
                <span className="text-[#FFF8F2]/56">market-signal</span>
                <span className="font-mono font-bold text-amber-300">$0.020</span>
              </div>
              <div className="flex items-center justify-between rounded-xl bg-[#FFF8F2]/5 px-3 py-2 text-xs">
                <span className="text-[#FFF8F2]/56">model-call</span>
                <span className="font-mono font-bold text-amber-300">$0.001</span>
              </div>
              <div className="flex items-center justify-between rounded-xl bg-[#FF5848]/10 px-3 py-2 text-xs">
                <span className="text-[#FFF8F2]/72">both tools</span>
                <span className="font-mono font-bold text-[#FFF8F2]">$0.021</span>
              </div>
            </div>
          </div>

          <div className="rounded-[1.5rem] border border-[#0E4A43]/42 bg-[#0E4A43]/16 p-4">
            <p className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.18em] text-[#9BE3D6]">
              <WalletCards className="h-4 w-4" />
              Scope boundary
            </p>
            <p className="mt-3 text-xs leading-5 text-[#FFF8F2]/58">
              This is a deterministic approval demo. It does not move card funds, book services, or store approvals persistently.
            </p>
          </div>
        </aside>
      </div>

      <div className="border-t border-[#FFF8F2]/10 p-5 sm:p-6">
        <ChatAuditTrail lifecycleState={lifecycleState} auditEvents={auditEvents} />
      </div>
    </motion.section>
  );
}
