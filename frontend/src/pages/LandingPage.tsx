import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowRight,
  BadgeCheck,
  ChevronDown,
  CircleDollarSign,
  ClipboardList,
  FileText,
  Globe2,
  Home,
  PlusCircle,
  ReceiptText,
  Send,
  Settings,
  ShieldCheck,
  SlidersHorizontal,
  UserRound,
  UsersRound,
} from "lucide-react";
import { Link } from "react-router-dom";

const navItems = [
  {
    label: "Product",
    href: "#product",
    chevron: true,
    items: [
      { label: "Budget controls", href: "#product" },
      { label: "Spend requests", href: "#workflow" },
      { label: "Receipt ledger", href: "#receipt-ledger" },
      { label: "Policy approvals", href: "#policy-approvals" },
    ],
  },
  { label: "Developers", href: "#developers" },
  {
    label: "Use Cases",
    href: "#use-cases",
    chevron: true,
    items: [
      { label: "Research agents", href: "#use-cases" },
      { label: "Trading/data agents", href: "#use-cases" },
      { label: "Browser agents", href: "#use-cases" },
      { label: "API-buying agents", href: "#use-cases" },
    ],
  },
  { label: "Docs", href: "#docs" },
  { label: "Pricing", href: "#pricing" },
];

const featureChips = [
  { label: "Budget controls", href: "#product", Icon: ShieldCheck },
  { label: "Receipt ledger", href: "#receipt-ledger", Icon: ReceiptText },
  { label: "Policy approvals", href: "#policy-approvals", Icon: BadgeCheck },
];

const workflowSteps = [
  { label: "Open a Tab", Icon: PlusCircle },
  { label: "Set a limit", Icon: SlidersHorizontal },
  { label: "Spend request", Icon: Send },
  { label: "Auto-approved", Icon: ShieldCheck },
  { label: "Receipt", Icon: FileText },
];

const spendRequests = [
  {
    tool: "OpenAI API",
    detail: "gpt-4o · Responses API",
    amount: "$0.421",
    status: "Auto-approved",
    Icon: CircleDollarSign,
    tone: "approved",
  },
  {
    tool: "Notion API",
    detail: "Retrieve page · v2",
    amount: "$0.0013",
    status: "Auto-approved",
    Icon: FileText,
    tone: "approved",
  },
  {
    tool: "Browser task",
    detail: "Extract data · 3 steps",
    amount: "$0.157",
    status: "Pending",
    Icon: Globe2,
    tone: "pending",
  },
];

const receipts = [
  { tool: "OpenAI API", id: "apr_1N4...9k1", date: "2024-05-24", amount: "$1.24" },
  { tool: "Notion API", id: "apr_1N3...7pQ", date: "2024-05-24", amount: "$1.29" },
];

const bottomNav = [
  { label: "Overview", Icon: Home, active: true },
  { label: "Requests", Icon: ClipboardList },
  { label: "Receipts", Icon: ReceiptText },
  { label: "Agents", Icon: UsersRound },
  { label: "Settings", Icon: Settings },
];

const footerColumns = [
  {
    title: "Get Started",
    links: [
      { label: "Open a Tab", href: "/dashboard", route: true },
      { label: "Sign in", href: "/login", route: true },
    ],
  },
  {
    title: "Product",
    links: [
      { label: "Budget controls", href: "#product" },
      { label: "Spend requests", href: "#workflow" },
      { label: "Receipt ledger", href: "#receipt-ledger" },
      { label: "Policy approvals", href: "#policy-approvals" },
    ],
  },
  {
    title: "Developers",
    links: [
      { label: "Docs", href: "#docs" },
      { label: "API", href: "#developers" },
      { label: "x402 router", href: "#developers" },
      { label: "Bazaar metadata", href: "#developers" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "Hackathon scope", href: "#docs" },
      { label: "About", href: "#footer" },
      { label: "Contact", href: "#pricing" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy", href: "#footer" },
      { label: "Terms", href: "#footer" },
      { label: "Not financial advice", href: "#pricing" },
    ],
  },
];

const productStats = [
  { label: "Budget controls", value: "Hard caps before paid calls", Icon: ShieldCheck, href: "#product" },
  { label: "Spend requests", value: "Policy verdicts per tool", Icon: Send, href: "#workflow" },
  { label: "Receipt ledger", value: "Auditable traces after execution", Icon: ReceiptText, href: "#receipt-ledger" },
  { label: "Policy approvals", value: "Allowed, denied, or skipped", Icon: BadgeCheck, href: "#policy-approvals" },
];

const useCases = [
  "Research agents buying data APIs",
  "Trading/data agents with strict no-execution policy",
  "Browser agents paying for metered services",
  "API-buying agents that need receipts",
];

const pricingTiers = [
  {
    name: "Builder",
    price: "Free",
    subtitle: "For demos, prototypes, and hackathon agents.",
    features: [
      "100 simulated Tab runs / month",
      "3 agent policies",
      "Receipt ledger preview",
      "Local/dev x402 router",
      "Community support",
    ],
    cta: "Start building",
    href: "/signup",
    route: true,
  },
  {
    name: "Pro",
    price: "$29",
    cadence: "/ month",
    subtitle: "For solo builders shipping agent workflows.",
    features: [
      "10,000 Tab runs / month",
      "Budget policies",
      "Spend request approvals",
      "Receipt export",
      "Hosted dashboard",
      "Email support",
    ],
    cta: "Open a Pro Tab",
    href: "/signup",
    route: true,
  },
  {
    name: "Team",
    price: "$99",
    cadence: "/ month",
    subtitle: "For teams running paid tool-use workflows.",
    features: [
      "100,000 Tab runs / month",
      "Team workspaces",
      "Policy templates",
      "Audit logs",
      "Webhooks",
      "Bazaar/x402 metadata tools",
    ],
    cta: "Start team plan",
    href: "/signup",
    route: true,
    popular: true,
  },
  {
    name: "Scale",
    price: "Custom",
    subtitle: "For platforms giving agents controlled spend.",
    features: [
      "Custom run volume",
      "Custom policy engine",
      "Dedicated x402 routes",
      "Compliance review workflows",
      "SLA/support",
      "Private deployment options",
    ],
    cta: "Contact us",
    href: "#footer",
  },
];

function LandingNav() {
  return (
    <motion.header
      initial={{ opacity: 0, y: -18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
      className="absolute inset-x-0 top-0 z-50"
    >
      <nav
        className="mx-auto flex h-24 max-w-[1680px] items-center justify-between px-5 text-[#FFF8F2] sm:px-8 lg:px-[4.3vw]"
        aria-label="Main navigation"
      >
        <Link
          to="/"
          className="rounded-xl text-[2rem] font-semibold leading-none tracking-[-0.06em] outline-none transition-opacity hover:opacity-80 focus-visible:ring-2 focus-visible:ring-[#FF6A5D]/70 sm:text-[2.55rem]"
        >
          Tab
        </Link>

        <div className="hidden items-center gap-9 text-[0.98rem] font-medium text-[#FFF8F2]/90 lg:flex">
          {navItems.map((item) => (
            <div key={item.label} className="group relative">
              <a
                href={item.href}
                className="inline-flex items-center gap-1.5 rounded-md outline-none transition-opacity hover:opacity-75 focus-visible:ring-2 focus-visible:ring-[#FF6A5D]/70"
              >
                <span className="relative after:absolute after:-bottom-2 after:left-0 after:h-px after:w-full after:origin-left after:scale-x-0 after:bg-[#FFF8F2]/70 after:transition-transform group-hover:after:scale-x-100">
                  {item.label}
                </span>
                {item.chevron && <ChevronDown className="h-3.5 w-3.5 opacity-80" strokeWidth={2.1} />}
              </a>
              {"items" in item && item.items && (
                <div className="pointer-events-none absolute left-1/2 top-full w-56 -translate-x-1/2 pt-4 opacity-0 transition-all duration-150 group-hover:pointer-events-auto group-hover:opacity-100 group-focus-within:pointer-events-auto group-focus-within:opacity-100">
                  <div className="rounded-2xl border border-white/12 bg-[#241C19]/94 p-2 shadow-[0_24px_64px_rgba(20,12,10,0.34)] backdrop-blur-xl">
                    {item.items.map((child) => (
                      <a
                        key={child.label}
                        href={child.href}
                        className="block rounded-xl px-3 py-2 text-sm text-[#FFF8F2]/72 outline-none transition-colors hover:bg-white/8 hover:text-[#FFF8F2] focus-visible:ring-2 focus-visible:ring-[#FF6A5D]/70"
                      >
                        {child.label}
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="flex items-center gap-4 sm:gap-6">
          <Link
            to="/login"
            className="hidden rounded-lg px-2 py-2 text-[0.98rem] font-medium text-[#FFF8F2]/90 outline-none transition-opacity hover:opacity-75 focus-visible:ring-2 focus-visible:ring-[#FF6A5D]/70 sm:inline-flex"
          >
            Sign in
          </Link>
          <Link
            to="/dashboard"
            className="inline-flex h-12 items-center justify-center rounded-xl bg-[#FF5848] px-5 text-[0.98rem] font-semibold text-white shadow-[0_18px_42px_rgba(255,88,72,0.28)] outline-none transition-colors hover:bg-[#F05A4A] focus-visible:ring-2 focus-visible:ring-[#FFF8F2]/80 sm:h-14 sm:px-7"
          >
            Open a Tab
          </Link>
        </div>
      </nav>
    </motion.header>
  );
}

function BackgroundSculpture() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      <div className="absolute inset-y-0 left-0 w-[56%] bg-[radial-gradient(circle_at_34%_48%,rgba(95,52,43,0.72),transparent_42%),linear-gradient(120deg,#2B211E_0%,#31231F_42%,#1E1917_100%)]" />
      <div className="absolute inset-y-0 right-0 w-[54%] bg-[radial-gradient(circle_at_63%_40%,rgba(15,90,82,0.55),transparent_38%),linear-gradient(145deg,#0E4A43_0%,#123F3A_45%,#0B3430_100%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_78%_22%,rgba(255,248,242,0.11),transparent_20%),linear-gradient(90deg,rgba(0,0,0,0.08),transparent_42%,rgba(255,255,255,0.05))]" />

      <div className="landing-ribbed-arc absolute left-[45.5%] top-[-4%] h-[112vh] w-[19vw] min-w-[230px] rounded-[999px] opacity-95" />

      <div className="landing-ring absolute right-[3.2%] top-[-21%] h-[114vh] w-[54vw] min-w-[610px] rounded-full" />
      <div className="landing-inner-ring absolute right-[11%] top-[19%] h-[57vh] w-[32vw] min-w-[360px] rounded-full" />
      <div className="absolute right-[8.5%] top-[27%] h-[52vh] w-[30vw] min-w-[340px] rounded-full bg-[radial-gradient(circle_at_35%_35%,#F0B28C_0%,#D97955_58%,#A34B38_100%)] opacity-95 shadow-[inset_28px_18px_70px_rgba(255,248,242,0.22)]" />
      <div className="absolute bottom-[-9%] right-[2.5%] h-[22vh] w-[51vw] min-w-[560px] rounded-[50%_50%_0_0] bg-[radial-gradient(circle_at_40%_18%,#F0B28C_0%,#E89A72_48%,#B86149_100%)] shadow-[inset_0_18px_50px_rgba(255,248,242,0.34),0_-24px_60px_rgba(43,33,30,0.28)]" />
      <div className="absolute bottom-0 left-0 h-[16vh] w-full bg-[linear-gradient(180deg,transparent,#F0B28C_95%)] opacity-55" />
    </div>
  );
}

function HeroCopy() {
  return (
    <div className="landing-hero-copy relative z-20 max-w-[760px] pt-28 lg:-mt-8 lg:pt-8">
      <motion.h1
        initial={{ opacity: 0, y: 32 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.12, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="landing-hero-title text-[clamp(4.35rem,6.6vw,7.75rem)] font-semibold leading-[0.98] tracking-[-0.065em] text-[#FFF8F2] drop-shadow-[0_8px_28px_rgba(0,0,0,0.24)]"
      >
        The spend layer
        <br />
        for AI agents
        <motion.span
          className="ml-1 inline-block text-[#FF5848]"
          animate={{ opacity: [1, 0.55, 1], scale: [1, 1.08, 1] }}
          transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
        >
          .
        </motion.span>
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 26 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.28, duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
        className="landing-hero-subtitle mt-8 max-w-[650px] text-[1.25rem] font-normal leading-[1.42] text-white/75 sm:text-[1.48rem]"
      >
        Tab lets autonomous agents buy paid internet
        <br className="hidden sm:block" />
        tools under a budget and return receipts for every call.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 22 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.45, duration: 0.72, ease: [0.16, 1, 0.3, 1] }}
        className="landing-hero-actions mt-9 flex flex-col gap-6"
      >
        <Link
          to="/dashboard"
          className="group inline-flex h-[62px] w-fit items-center overflow-hidden rounded-xl bg-[#FF5848] text-[1.18rem] font-semibold text-white shadow-[0_18px_42px_rgba(255,88,72,0.27)] outline-none transition-colors hover:bg-[#F05A4A] focus-visible:ring-2 focus-visible:ring-[#FFF8F2]/80"
        >
          <span className="px-7">Open a Tab</span>
          <span className="flex h-full w-[62px] items-center justify-center border-l border-white/24">
            <ArrowRight className="h-5 w-5 transition-transform duration-200 group-hover:translate-x-1" />
          </span>
        </Link>

        <div className="flex flex-wrap gap-4">
          {featureChips.map(({ label, href, Icon }) => (
            <a
              key={label}
              href={href}
              className="group inline-flex h-11 items-center gap-3 rounded-xl border border-white/18 bg-white/[0.035] px-4 text-[0.96rem] font-semibold text-[#FFF8F2] shadow-[inset_0_1px_0_rgba(255,255,255,0.07)] outline-none backdrop-blur-sm transition-colors hover:border-[#FF6A5D]/65 hover:bg-white/[0.07] focus-visible:ring-2 focus-visible:ring-[#FF6A5D]/70"
            >
              <Icon className="h-5 w-5 text-[#FFF8F2]/95 transition-colors group-hover:text-[#FF6A5D]" strokeWidth={1.9} />
              {label}
            </a>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

function PhoneStatusBar() {
  return (
    <div className="flex h-9 items-center justify-between px-7 pt-2 text-[0.72rem] font-semibold text-[#17110F]">
      <span>9:41</span>
      <div className="absolute left-1/2 top-[13px] h-7 w-[88px] -translate-x-1/2 rounded-full bg-black shadow-[inset_12px_0_14px_rgba(255,255,255,0.08)]">
        <span className="absolute right-[10px] top-[6px] h-[14px] w-[14px] rounded-full bg-[#0B1720] ring-2 ring-black">
          <span className="absolute left-[3px] top-[3px] h-[4px] w-[4px] rounded-full bg-[#31546F]" />
        </span>
      </div>
      <div className="flex items-center gap-1.5">
        <span className="h-2.5 w-4 rounded-[3px] border border-black/80">
          <span className="block h-full w-[70%] rounded-[2px] bg-black" />
        </span>
        <span className="h-2.5 w-3 rounded-sm border-t-2 border-black" />
      </div>
    </div>
  );
}

function BudgetCard() {
  return (
    <section className="overflow-hidden rounded-[18px] bg-[linear-gradient(135deg,#FF5848_0%,#FF6A5D_45%,#FFA28D_100%)] p-4 text-white shadow-[0_18px_42px_rgba(255,88,72,0.25)]">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[0.78rem] font-medium text-white/86">Agent budget</p>
          <p className="mt-1 text-[1.6rem] font-semibold tracking-[-0.04em]">$2,500.00</p>
        </div>
        <button className="mt-2 rounded-full bg-white/15 px-3 py-1 text-[0.62rem] font-medium text-white outline-none transition-colors hover:bg-white/22 focus-visible:ring-2 focus-visible:ring-white/75">
          Monthly <ChevronDown className="ml-1 inline h-3 w-3" />
        </button>
      </div>
      <div className="landing-budget-track mt-5 h-2 overflow-hidden rounded-full bg-white/36">
        <div className="landing-budget-fill h-full w-[65%] rounded-full bg-white" />
      </div>
      <div className="mt-3 flex justify-between text-[0.65rem] font-semibold text-white/84">
        <span>$1,620.42 used</span>
        <span>$879.58 remaining</span>
      </div>
    </section>
  );
}

function MiniCards() {
  return (
    <div className="mt-3 grid grid-cols-2 gap-2.5">
      <div className="rounded-[14px] border border-[#34231E]/10 bg-white/55 p-3 shadow-[0_8px_20px_rgba(43,33,30,0.06)]">
        <div className="flex items-center gap-2 text-[0.61rem] text-[#7B625C]">
          <CircleDollarSign className="h-3.5 w-3.5 text-[#FF5848]" />
          Remaining balance
        </div>
        <p className="mt-1.5 text-[0.95rem] font-semibold text-[#17110F]">$879.58</p>
      </div>
      <div className="rounded-[14px] border border-[#34231E]/10 bg-white/55 p-3 shadow-[0_8px_20px_rgba(43,33,30,0.06)]">
        <div className="flex items-center gap-2 text-[0.61rem] text-[#7B625C]">
          <BadgeCheck className="h-3.5 w-3.5 text-[#FF5848]" />
          Max calls
        </div>
        <p className="mt-1.5 text-[0.95rem] font-semibold text-[#17110F]">250</p>
      </div>
    </div>
  );
}

function SpendRow({
  tool,
  detail,
  amount,
  status,
  Icon,
  tone,
  index,
}: (typeof spendRequests)[number] & { index: number }) {
  const isPending = tone === "pending";

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.86 + index * 0.08, duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      className="group flex items-center gap-3 rounded-[13px] border border-[#34231E]/8 bg-white/48 px-3 py-2.5 shadow-[0_8px_18px_rgba(43,33,30,0.045)] transition-transform hover:-translate-y-0.5"
    >
      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-[#34231E]/12 bg-white text-[#17110F]">
        <Icon className="h-4 w-4" strokeWidth={1.8} />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate text-[0.72rem] font-semibold text-[#17110F]">{tool}</span>
        <span className="block truncate text-[0.62rem] text-[#7B625C]">{detail}</span>
      </span>
      <span className="text-right">
        <span className="block text-[0.68rem] font-semibold text-[#17110F]">{amount}</span>
        <span className={`inline-flex items-center gap-1 text-[0.51rem] ${isPending ? "text-[#D97955]" : "text-[#10A66E]"}`}>
          <span className={`h-1.5 w-1.5 rounded-full ${isPending ? "bg-[#D97955]" : "bg-[#10A66E]"}`} />
          {status}
        </span>
      </span>
      <ArrowRight className="h-3.5 w-3.5 text-[#D97955]/70" />
    </motion.div>
  );
}

function ReceiptRow({ tool, id, date, amount, index }: (typeof receipts)[number] & { index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.06 + index * 0.08, duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      className="group flex items-center gap-3 rounded-[13px] border border-[#34231E]/8 bg-white/42 px-3 py-2.5 shadow-[0_8px_18px_rgba(43,33,30,0.04)] transition-transform hover:-translate-y-0.5"
    >
      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-[#34231E]/12 bg-white">
        <ReceiptText className="h-4 w-4 text-[#17110F]" strokeWidth={1.8} />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate text-[0.72rem] font-semibold text-[#17110F]">{tool}</span>
        <span className="block truncate text-[0.61rem] text-[#7B625C]">
          {id} · {date}
        </span>
      </span>
      <span className="text-right">
        <span className="block text-[0.68rem] font-semibold text-[#17110F]">{amount}</span>
        <span className="inline-flex items-center gap-1 text-[0.51rem] text-[#10A66E]">
          <span className="h-1.5 w-1.5 rounded-full bg-[#10A66E]" />
          Approved
        </span>
      </span>
      <ArrowRight className="h-3.5 w-3.5 text-[#D97955]/70" />
    </motion.div>
  );
}

function PhoneMockup() {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={{ opacity: 0, x: 90, rotate: 1.5 }}
      animate={{ opacity: 1, x: 0, rotate: 0, y: reduceMotion ? 0 : [0, -10, 0] }}
      transition={{
        opacity: { delay: 0.28, duration: 0.8 },
        x: { delay: 0.28, type: "spring", stiffness: 74, damping: 16 },
        rotate: { delay: 0.28, duration: 0.7 },
        y: { delay: 1.1, duration: 5.4, repeat: Infinity, ease: "easeInOut" },
      }}
      className="relative z-30 mx-auto w-[315px] sm:w-[345px] xl:w-[382px]"
    >
      <div className="rounded-[48px] border-[6px] border-[#1A1715] bg-[#1A1715] p-[5px] shadow-[0_34px_76px_rgba(12,22,20,0.46),0_8px_20px_rgba(0,0,0,0.45)]">
        <div className="relative overflow-hidden rounded-[39px] border border-white/16 bg-[#FFF8F2] text-[#17110F]">
          <PhoneStatusBar />
          <div className="px-4 pb-3">
            <header className="flex items-center justify-between py-3">
              <span className="text-[1.02rem] font-semibold tracking-[-0.05em] text-[#FF5848]">Tab</span>
              <button className="inline-flex items-center gap-1 rounded-md text-[0.78rem] font-semibold outline-none focus-visible:ring-2 focus-visible:ring-[#FF5848]/70">
                Acme AI Lab <ChevronDown className="h-3 w-3" />
              </button>
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#FFD8CE] text-[0.6rem] font-semibold text-[#FF5848]">
                AL
              </span>
            </header>

            <BudgetCard />
            <MiniCards />

            <section className="mt-4">
              <div className="mb-2.5 flex items-center justify-between">
                <h2 className="text-[0.75rem] font-semibold tracking-[-0.02em]">Spend requests</h2>
                <a href="#workflow" className="text-[0.56rem] font-medium text-[#FF5848]">
                  View all <ArrowRight className="inline h-2.5 w-2.5" />
                </a>
              </div>
              <div className="space-y-2">
                {spendRequests.map((request, index) => (
                  <SpendRow key={request.tool} {...request} index={index} />
                ))}
              </div>
            </section>

            <section className="mt-4">
              <div className="mb-2.5 flex items-center justify-between">
                <h2 className="text-[0.75rem] font-semibold tracking-[-0.02em]">Receipts</h2>
                <a href="#receipt-ledger" className="text-[0.56rem] font-medium text-[#FF5848]">
                  View all <ArrowRight className="inline h-2.5 w-2.5" />
                </a>
              </div>
              <div className="space-y-2">
                {receipts.map((receipt, index) => (
                  <ReceiptRow key={receipt.id} {...receipt} index={index} />
                ))}
              </div>
            </section>

            <nav className="mt-4 grid grid-cols-5 border-t border-[#34231E]/10 pt-3">
              {bottomNav.map(({ label, Icon, active }) => (
                <a
                  key={label}
                  href={label === "Requests" ? "#workflow" : label === "Receipts" ? "#receipt-ledger" : label === "Agents" ? "#use-cases" : label === "Settings" ? "#policy-approvals" : "#product"}
                  className={`flex flex-col items-center gap-1 rounded-lg py-1 text-[0.52rem] font-medium outline-none transition-colors focus-visible:ring-2 focus-visible:ring-[#FF5848]/70 ${
                    active ? "text-[#FF5848]" : "text-[#5D4D48]"
                  }`}
                >
                  <Icon className="h-4 w-4" strokeWidth={1.8} />
                  {label}
                </a>
              ))}
            </nav>
          </div>
          <div className="mx-auto mb-2 h-1 w-28 rounded-full bg-black" />
        </div>
      </div>
    </motion.div>
  );
}

function WorkflowPill() {
  return (
    <motion.div
      id="workflow"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.72, duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
      className="relative z-40 mt-12 w-full overflow-x-auto pb-2 lg:absolute lg:bottom-[3.8vh] lg:left-[4.2vw] lg:mt-0 lg:w-auto lg:origin-left lg:scale-[0.86] lg:overflow-visible lg:pb-0 xl:bottom-[8.5vh] xl:scale-100"
    >
      <div className="flex w-max items-center gap-3 rounded-full bg-[#F8F2EA] px-5 py-3.5 text-[#17110F] shadow-[0_22px_54px_rgba(28,18,15,0.22)] sm:gap-5 sm:px-8 sm:py-4">
        {workflowSteps.map(({ label, Icon }, index) => (
          <div key={label} className="group flex items-center gap-4">
            <a
              href={index === 0 ? "#top" : "#workflow"}
              className="inline-flex items-center gap-3 rounded-full outline-none transition-opacity hover:opacity-70 focus-visible:ring-2 focus-visible:ring-[#FF5848]/70"
            >
              <Icon className="h-[18px] w-[18px] transition-colors group-hover:text-[#FF5848] sm:h-5 sm:w-5" strokeWidth={1.8} />
              <span className="whitespace-nowrap text-[0.78rem] font-semibold sm:text-[0.84rem]">{label}</span>
            </a>
            {index < workflowSteps.length - 1 && <ArrowRight className="h-4 w-4 text-[#17110F]/55" strokeWidth={1.8} />}
          </div>
        ))}
      </div>
    </motion.div>
  );
}

function ProductSections() {
  return (
    <section className="relative z-20 bg-[#FFF8F2] text-[#241C19]">
      <div className="mx-auto max-w-[1680px] px-5 py-20 sm:px-8 lg:px-[4.3vw] lg:py-24">
        <div id="product" className="scroll-mt-28">
          <div className="grid gap-10 lg:grid-cols-[0.78fr_1fr] lg:items-end">
            <div>
              <p className="text-[0.72rem] font-bold uppercase tracking-[0.22em] text-[#FF5848]">
                Product
              </p>
              <h2 className="mt-4 max-w-3xl text-[clamp(2.6rem,4.6vw,5.8rem)] font-semibold leading-[0.98] tracking-[-0.065em] text-[#17110F]">
                Agent spend controls before money moves.
              </h2>
            </div>
            <p className="max-w-2xl text-lg leading-8 text-[#241C19]/62">
              Tab sits between autonomous agents and paid tools. It checks budgets, evaluates policy, records spend requests, and returns receipts without pretending to be a wallet or payment processor.
            </p>
          </div>

          <div className="mt-12 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {productStats.map(({ label, value, Icon, href }) => (
              <a
                key={label}
                href={href}
                className="group rounded-2xl border border-[#241C19]/8 bg-white/72 p-5 shadow-[0_18px_54px_rgba(36,28,25,0.08)] outline-none transition-all duration-200 hover:-translate-y-1 hover:border-[#FF5848]/26 hover:shadow-[0_24px_64px_rgba(36,28,25,0.12)] focus-visible:ring-2 focus-visible:ring-[#FF5848]/40"
              >
                <Icon className="h-6 w-6 text-[#FF5848]" strokeWidth={1.8} />
                <h3 className="mt-5 text-xl font-semibold tracking-[-0.035em] text-[#17110F]">{label}</h3>
                <p className="mt-2 text-sm leading-6 text-[#241C19]/58">{value}</p>
              </a>
            ))}
          </div>
        </div>

        <div id="receipt-ledger" className="mt-20 scroll-mt-28 rounded-[2rem] bg-[#241C19] p-6 text-[#FFF8F2] shadow-[0_30px_90px_rgba(36,28,25,0.18)] lg:p-8">
          <div className="grid gap-8 lg:grid-cols-[0.85fr_1fr] lg:items-center">
            <div>
              <p className="text-[0.72rem] font-bold uppercase tracking-[0.22em] text-[#F0B28C]">
                Receipt ledger
              </p>
              <h2 className="mt-4 text-[clamp(2.2rem,3.4vw,4.2rem)] font-semibold leading-none tracking-[-0.06em]">
                Every approved paid call leaves a receipt.
              </h2>
              <p className="mt-5 max-w-xl text-base leading-7 text-[#FFF8F2]/64">
                Teams can see the tool, amount, provider, network, status, and policy context that produced a spend decision.
              </p>
            </div>
            <div className="overflow-hidden rounded-2xl border border-[#FFF8F2]/12 bg-[#FFF8F2]/7">
              {receipts.map((receipt) => (
                <div key={receipt.id} className="grid gap-3 border-b border-[#FFF8F2]/10 px-5 py-4 last:border-b-0 sm:grid-cols-[1fr_auto_auto] sm:items-center">
                  <div>
                    <p className="font-mono text-xs font-bold text-[#FFF8F2]">{receipt.id}</p>
                    <p className="mt-1 text-sm text-[#FFF8F2]/52">{receipt.tool} · {receipt.date}</p>
                  </div>
                  <span className="font-mono text-sm font-bold text-[#F0B28C]">{receipt.amount}</span>
                  <span className="w-fit rounded-full border border-green-400/22 bg-green-400/10 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-green-300">
                    Approved
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div id="policy-approvals" className="mt-20 scroll-mt-28">
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-1">
              <p className="text-[0.72rem] font-bold uppercase tracking-[0.22em] text-[#FF5848]">
                Policy approvals
              </p>
              <h2 className="mt-4 text-[clamp(2.2rem,3.2vw,4rem)] font-semibold leading-none tracking-[-0.06em]">
                Clear verdicts, not mystery spend.
              </h2>
            </div>
            {spendRequests.map(({ tool, detail, amount, status, tone }) => (
              <div key={tool} className="rounded-2xl border border-[#241C19]/8 bg-white/76 p-5 shadow-[0_18px_54px_rgba(36,28,25,0.08)]">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="font-mono text-base font-bold text-[#17110F]">{tool}</h3>
                    <p className="mt-1 text-sm text-[#241C19]/54">{detail}</p>
                  </div>
                  <span className="font-mono text-sm font-bold text-[#FF5848]">{amount}</span>
                </div>
                <p className={`mt-6 w-fit rounded-full border px-3 py-1 text-[10px] font-bold uppercase tracking-widest ${tone === "pending" ? "border-[#D97955]/28 bg-[#D97955]/10 text-[#B86149]" : "border-green-600/18 bg-green-600/8 text-green-700"}`}>
                  {status}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function DeveloperSections() {
  return (
    <section className="relative z-20 bg-[#F7EEE5] text-[#241C19]">
      <div className="mx-auto grid max-w-[1680px] gap-8 px-5 py-20 sm:px-8 lg:grid-cols-3 lg:px-[4.3vw] lg:py-24">
        <div id="developers" className="scroll-mt-28 rounded-2xl border border-[#241C19]/8 bg-[#241C19] p-6 text-[#FFF8F2] lg:col-span-2 lg:p-8">
          <p className="text-[0.72rem] font-bold uppercase tracking-[0.22em] text-[#F0B28C]">
            Developers
          </p>
          <h2 className="mt-4 max-w-3xl text-[clamp(2.3rem,3.6vw,4.8rem)] font-semibold leading-none tracking-[-0.06em]">
            A focused control plane for paid agent tools.
          </h2>
          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            {["POST /v1/tab/run", "Local/dev x402 router", "Bazaar metadata helpers", "Receipt export-ready traces"].map((item) => (
              <div key={item} className="rounded-xl border border-[#FFF8F2]/12 bg-[#FFF8F2]/7 px-4 py-3 font-mono text-sm text-[#FFF8F2]/72">
                {item}
              </div>
            ))}
          </div>
        </div>

        <div id="docs" className="scroll-mt-28 rounded-2xl border border-[#241C19]/8 bg-white/76 p-6 shadow-[0_18px_54px_rgba(36,28,25,0.08)] lg:p-8">
          <p className="text-[0.72rem] font-bold uppercase tracking-[0.22em] text-[#FF5848]">Docs</p>
          <h2 className="mt-4 text-3xl font-semibold tracking-[-0.05em] text-[#17110F]">Demo-safe integration notes.</h2>
          <p className="mt-4 text-sm leading-7 text-[#241C19]/60">
            The live demo keeps pricing transparent, preserves policy thresholds, and shows the exact request payload before every run.
          </p>
          <a href="#pricing" className="mt-6 inline-flex rounded-xl bg-[#FF5848] px-5 py-3 text-sm font-semibold text-white outline-none transition-colors hover:bg-[#F05A4A] focus-visible:ring-2 focus-visible:ring-[#FF5848]/40">
            View demo pricing
          </a>
        </div>

        <div id="use-cases" className="scroll-mt-28 rounded-2xl border border-[#241C19]/8 bg-white/76 p-6 shadow-[0_18px_54px_rgba(36,28,25,0.08)] lg:col-span-3 lg:p-8">
          <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
            <div>
              <p className="text-[0.72rem] font-bold uppercase tracking-[0.22em] text-[#FF5848]">Use cases</p>
              <h2 className="mt-4 text-[clamp(2.2rem,3.4vw,4.4rem)] font-semibold leading-none tracking-[-0.06em] text-[#17110F]">
                Spend boundaries for agents that touch paid APIs.
              </h2>
            </div>
            <Link to="/dashboard" className="inline-flex h-12 w-fit items-center rounded-xl bg-[#241C19] px-5 text-sm font-semibold text-[#FFF8F2] outline-none transition-opacity hover:opacity-85 focus-visible:ring-2 focus-visible:ring-[#FF5848]/40">
              Try the dashboard
            </Link>
          </div>
          <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {useCases.map((item) => (
              <div key={item} className="rounded-xl border border-[#241C19]/8 bg-[#FFF8F2] p-4 text-sm font-semibold leading-6 text-[#241C19]/72">
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function PricingSection() {
  return (
    <section id="pricing" className="relative z-20 scroll-mt-28 bg-[#241C19] text-[#FFF8F2]">
      <div className="mx-auto max-w-[1680px] px-5 py-20 sm:px-8 lg:px-[4.3vw] lg:py-24">
        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <div>
            <p className="text-[0.72rem] font-bold uppercase tracking-[0.22em] text-[#F0B28C]">Pricing</p>
            <h2 className="mt-4 max-w-4xl text-[clamp(2.6rem,4.5vw,5.6rem)] font-semibold leading-[0.98] tracking-[-0.065em]">
              Built like infrastructure. Priced like a tool teams can try.
            </h2>
          </div>
          <p className="max-w-xl text-base leading-7 text-[#FFF8F2]/62">
            Tab controls budgets, approvals, and receipts for agent spend. Paid tool costs are pass-through; payment rails and providers may charge separately.
          </p>
        </div>

        <div className="mt-12 grid gap-4 lg:grid-cols-4">
          {pricingTiers.map((tier) => {
            const card = (
              <article className={`relative flex h-full flex-col rounded-2xl border p-5 transition-transform duration-200 hover:-translate-y-1 ${tier.popular ? "border-[#FF5848]/58 bg-[#FF5848] text-white shadow-[0_28px_78px_rgba(255,88,72,0.22)]" : "border-[#FFF8F2]/12 bg-[#FFF8F2]/7"}`}>
                {tier.popular && (
                  <span className="absolute right-5 top-5 rounded-full bg-white/18 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-white">
                    Popular
                  </span>
                )}
                <h3 className="text-2xl font-semibold tracking-[-0.04em]">{tier.name}</h3>
                <p className={`mt-3 text-sm leading-6 ${tier.popular ? "text-white/76" : "text-[#FFF8F2]/58"}`}>{tier.subtitle}</p>
                <p className="mt-7">
                  <span className="text-4xl font-semibold tracking-[-0.05em]">{tier.price}</span>
                  {"cadence" in tier && tier.cadence && <span className={tier.popular ? "text-white/66" : "text-[#FFF8F2]/48"}>{tier.cadence}</span>}
                </p>
                <ul className="mt-7 flex-1 space-y-3 text-sm">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex gap-2 leading-6">
                      <span className={tier.popular ? "text-white" : "text-[#F0B28C]"}>•</span>
                      <span className={tier.popular ? "text-white/82" : "text-[#FFF8F2]/66"}>{feature}</span>
                    </li>
                  ))}
                </ul>
                {"route" in tier && tier.route ? (
                  <Link to={tier.href} className={`mt-8 inline-flex h-12 items-center justify-center rounded-xl px-5 text-sm font-semibold outline-none transition-colors focus-visible:ring-2 focus-visible:ring-white/70 ${tier.popular ? "bg-white text-[#FF5848] hover:bg-[#FFF8F2]" : "bg-[#FF5848] text-white hover:bg-[#F05A4A]"}`}>
                    {tier.cta}
                  </Link>
                ) : (
                  <a href={tier.href} className="mt-8 inline-flex h-12 items-center justify-center rounded-xl border border-[#FFF8F2]/16 px-5 text-sm font-semibold text-[#FFF8F2] outline-none transition-colors hover:bg-[#FFF8F2]/8 focus-visible:ring-2 focus-visible:ring-white/70">
                    {tier.cta}
                  </a>
                )}
              </article>
            );
            return <div key={tier.name}>{card}</div>;
          })}
        </div>

        <div className="mt-8 grid gap-3 text-sm leading-6 text-[#FFF8F2]/58 lg:grid-cols-2">
          <p className="rounded-2xl border border-[#FFF8F2]/10 bg-[#FFF8F2]/6 p-4">
            Pricing shown for product demonstration. x402 tool prices in the live demo are $0.020 for market-signal and $0.001 for model-call.
          </p>
          <p className="rounded-2xl border border-[#FFF8F2]/10 bg-[#FFF8F2]/6 p-4">
            Tab is agent spend infrastructure, not a wallet or payment processor.
          </p>
        </div>
      </div>
    </section>
  );
}

function LandingFooter() {
  return (
    <footer id="footer" className="relative z-20 scroll-mt-28 overflow-hidden bg-[#FFF8F2] text-[#241C19]">
      <div className="pointer-events-none absolute -right-28 top-0 h-72 w-72 rounded-full bg-[#F0B28C]/45 blur-3xl" />
      <div className="pointer-events-none absolute -left-24 bottom-16 h-64 w-64 rounded-full bg-[#FF5848]/10 blur-3xl" />

      <div className="relative mx-auto max-w-[1680px] px-5 pb-[clamp(1.5rem,2vw,2.6rem)] pt-16 sm:px-8 lg:px-[4.3vw] lg:pt-20">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10%" }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="grid gap-10 border-b border-[#241C19]/10 pb-12 lg:grid-cols-[1.08fr_2fr]"
        >
          <div>
            <p className="text-[0.72rem] font-bold uppercase tracking-[0.22em] text-[#FF5848]">
              Agent spend infrastructure
            </p>
            <h2 className="mt-4 max-w-xl text-[clamp(2.4rem,4vw,5rem)] font-semibold leading-[0.98] tracking-[-0.065em]">
              Controlled paid-tool access for autonomous teams.
            </h2>
            <p className="mt-5 max-w-md text-base leading-7 text-[#241C19]/62">
              Budget controls, policy approvals, and receipts for every agent run.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:grid-cols-5">
            {footerColumns.map((column) => (
              <div key={column.title}>
                <h3 className="text-sm font-semibold text-[#FF5848]">{column.title}</h3>
                <ul className="mt-4 space-y-3">
                  {column.links.map((link) => (
                    <li key={link.label}>
                      {"route" in link && link.route ? (
                        <Link
                          to={link.href}
                          className="rounded-md text-sm font-medium text-[#241C19]/74 outline-none transition-colors hover:text-[#FF5848] focus-visible:ring-2 focus-visible:ring-[#FF5848]/40"
                        >
                          {link.label}
                        </Link>
                      ) : (
                        <a
                          href={link.href}
                          className="rounded-md text-sm font-medium text-[#241C19]/74 outline-none transition-colors hover:text-[#FF5848] focus-visible:ring-2 focus-visible:ring-[#FF5848]/40"
                        >
                          {link.label}
                        </a>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </motion.div>

        <div className="relative flex flex-col gap-8 pt-8 lg:min-h-[28vw]">
          <div className="flex flex-col justify-between gap-4 text-sm text-[#241C19]/52 sm:flex-row">
            <p>© 2026 Tab. Agent spend infrastructure for autonomous tool use.</p>
            <div className="flex gap-4">
              <a href="#top" className="rounded-md font-medium text-[#241C19]/62 transition-colors hover:text-[#FF5848] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF5848]/40">
                Back to top
              </a>
              <Link to="/dashboard" className="rounded-md font-medium text-[#FF5848] transition-opacity hover:opacity-75 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF5848]/40">
                Open a Tab
              </Link>
            </div>
          </div>

          <motion.p
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-14%" }}
            transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
            className="pointer-events-none -mb-[6vw] select-none text-[clamp(13rem,37vw,43rem)] font-black leading-[0.72] tracking-[-0.12em] text-[#FF5848]"
            aria-hidden="true"
          >
            Tab
          </motion.p>
        </div>
      </div>
    </footer>
  );
}

export default function LandingPage() {
  return (
    <div
      id="top"
      className="relative min-h-screen overflow-x-hidden bg-[#2B211E] font-sans text-[#FFF8F2]"
      style={{
        fontFamily:
          'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif',
      }}
    >
      <BackgroundSculpture />
      <LandingNav />

      <main className="landing-hero-main relative z-10 min-h-screen overflow-hidden px-5 sm:px-8 lg:h-screen lg:min-h-0 lg:px-[4.3vw]">
        <div className="landing-hero-grid grid min-h-screen items-center gap-10 pt-20 lg:h-full lg:min-h-0 lg:grid-cols-[minmax(0,0.95fr)_minmax(390px,0.72fr)] lg:gap-2 lg:pt-0">
          <HeroCopy />
          <div className="landing-phone-stage relative flex min-h-[600px] items-center justify-center pb-32 pt-6 lg:min-h-0 lg:translate-x-4 lg:self-start lg:items-start lg:justify-end lg:pb-0 lg:pt-[4.6rem] xl:translate-x-0">
            <PhoneMockup />
          </div>
        </div>
        <WorkflowPill />
      </main>

      <ProductSections />
      <DeveloperSections />
      <PricingSection />
      <LandingFooter />
    </div>
  );
}
