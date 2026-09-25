import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  BadgeCheck,
  HeartHandshake,
  Home as HomeIcon,
  Link2,
  PartyPopper,
  Plane,
  ShieldCheck,
  Sparkles,
  Wallet,
  CheckCircle2,
  Lock,
  BookOpen,
  Check,
  Clock,
} from "lucide-react";
import { ProgressBar } from "@/components/ProgressBar";
import { seedPools } from "@/data/mockData";
import { formatPKR } from "@/lib/poolStore";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "HissaClub — Collect Group Money Without Awkward Reminders" },
      {
        name: "description",
        content:
          "Start a shared money pool for trips, hostel dues, weddings, or family gifts. Zero signup, private payment slips, and 1-click WhatsApp reminders.",
      },
      { property: "og:title", content: "HissaClub — Group Expense Pooling Platform" },
      {
        property: "og:description",
        content: "Collect everyone's hissa without the awkward reminders.",
      },
    ],
  }),
  component: Home,
});

const categories = [
  {
    icon: Plane,
    title: "Tours & Trips",
    copy: "Transport fuel, hotel bookings & group meals",
  },
  {
    icon: HomeIcon,
    title: "Hostel & Roommates",
    copy: "Monthly flat rent, groceries & utility bills",
  },
  {
    icon: PartyPopper,
    title: "Events & Weddings",
    copy: "Group gifts, valima dinners & farewells",
  },
  {
    icon: HeartHandshake,
    title: "Mohalla & Welfare",
    copy: "Charity funds, donations & community pools",
  },
];

const steps = [
  {
    step: "01",
    icon: Wallet,
    title: "Create your pool",
    copy: "Set your target budget, equal or custom split, and a secret 4-digit PIN.",
  },
  {
    step: "02",
    icon: Link2,
    title: "Share one simple link",
    copy: "Friends open on any phone. No app download or signup required.",
  },
  {
    step: "03",
    icon: BadgeCheck,
    title: "Verify slips & nudge",
    copy: "Review uploaded receipts in your private dashboard and nudge on WhatsApp.",
  },
];

function Home() {
  const demo = seedPools[0];
  const target = demo ? demo.target : 60000;
  const raised = 30000;

  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative">
        <div className="pointer-events-none absolute -top-32 -right-24 h-80 w-80 rounded-full bg-primary/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 -left-24 h-80 w-80 rounded-full bg-violet/15 blur-3xl" />

        <div className="relative mx-auto grid max-w-6xl gap-6 px-3.5 py-6 sm:px-6 sm:py-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-12 lg:py-16 lg:items-center">
          {/* Left Hero Content */}
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/10 px-3 py-0.5 text-xs font-bold text-primary shadow-sm">
              <Sparkles className="h-3 w-3" /> Hissa barabar, hisaab saaf
            </div>

            <h1 className="mt-3 text-3xl font-extrabold leading-[1.12] sm:text-5xl lg:text-6xl text-foreground">
              Collect everyone's <span className="brand-text">hissa</span> without the awkward
              reminders.
            </h1>

            <p className="mt-3 max-w-xl text-xs leading-relaxed text-muted-foreground sm:text-base">
              HissaClub removes the stress from group collections. Share one link, let members claim
              their share with a payment screenshot, and nudge pending members directly on WhatsApp.
            </p>

            {/* CTAs */}
            <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:items-center">
              <Link
                to="/create"
                className="btn-primary text-xs sm:text-sm py-2 px-4 justify-center shadow-lift"
              >
                Start a free pool <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/how-it-works"
                className="btn-ghost text-xs sm:text-sm py-2 px-4 justify-center"
              >
                <BookOpen className="h-4 w-4 text-primary" /> See how it works
              </Link>
            </div>

            {/* Trust Badges */}
            <div className="mt-5 flex flex-wrap items-center gap-1.5 sm:gap-2">
              <span className="inline-flex items-center gap-1 rounded-full border border-border bg-card/90 px-2.5 py-0.5 text-[10px] sm:text-[11px] font-semibold text-muted-foreground">
                <CheckCircle2 className="h-3 w-3 text-primary" /> Zero sign-up
              </span>
              <span className="inline-flex items-center gap-1 rounded-full border border-border bg-card/90 px-2.5 py-0.5 text-[10px] sm:text-[11px] font-semibold text-muted-foreground">
                <Lock className="h-3 w-3 text-primary" /> Private slips
              </span>
              <span className="inline-flex items-center gap-1 rounded-full border border-border bg-card/90 px-2.5 py-0.5 text-[10px] sm:text-[11px] font-semibold text-muted-foreground">
                <Sparkles className="h-3 w-3 text-primary" /> WhatsApp nudge
              </span>
            </div>
          </div>

          {/* Right Hero Showcase Card (Compact & Balanced) */}
          <div className="card-surface p-4 sm:p-5 shadow-lift relative">
            {/* Header */}
            <div className="flex items-center justify-between gap-2 border-b border-border/80 pb-2.5">
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[10px] font-bold uppercase tracking-wider text-primary">
                    Live Demo Pool
                  </span>
                </div>
                <h3 className="mt-0.5 text-base font-bold sm:text-lg text-foreground truncate">
                  Murree Group Tour 2026
                </h3>
              </div>
              <span className="rounded-full bg-accent px-2.5 py-0.5 text-[11px] font-semibold text-accent-foreground shrink-0">
                Tours & Trips
              </span>
            </div>

            {/* Stats Row */}
            <div className="mt-3 grid grid-cols-3 gap-1.5 text-center">
              <Stat label="Target" value={formatPKR(target)} />
              <Stat label="Collected" value={formatPKR(raised)} highlight />
              <Stat label="Remaining" value={formatPKR(target - raised)} />
            </div>

            <div className="mt-3">
              <ProgressBar value={raised} target={target} />
            </div>

            {/* Compact Mini Feed (2 Clean Rows instead of bulky cards) */}
            <div className="mt-3.5 space-y-1.5">
              <div className="flex items-center justify-between text-[11px] font-bold text-muted-foreground px-0.5">
                <span>Recent Submissions</span>
                <span className="text-[10px] font-normal">2 of 4 verified</span>
              </div>

              {/* Contributor Row 1 */}
              <div className="flex items-center justify-between rounded-lg bg-secondary/40 px-3 py-1.5 border border-border/60">
                <span className="text-xs font-semibold text-foreground">Bilal Khan</span>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-foreground">Rs. 10,000</span>
                  <span className="inline-flex items-center gap-0.5 rounded-md bg-emerald-500/15 px-1.5 py-0.5 text-[10px] font-bold text-emerald-500">
                    <Check className="h-3 w-3" /> Verified
                  </span>
                </div>
              </div>

              {/* Contributor Row 2 */}
              <div className="flex items-center justify-between rounded-lg bg-secondary/40 px-3 py-1.5 border border-border/60">
                <span className="text-xs font-semibold text-foreground">Hamza Malik</span>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-foreground">Rs. 10,000</span>
                  <span className="inline-flex items-center gap-0.5 rounded-md bg-amber-500/15 px-1.5 py-0.5 text-[10px] font-bold text-amber-500">
                    <Clock className="h-3 w-3" /> Pending
                  </span>
                </div>
              </div>
            </div>

            {/* Clean Footer Bar */}
            <div className="mt-3 flex items-center justify-between border-t border-border/70 pt-2 text-[10px] sm:text-[11px] text-muted-foreground">
              <span className="flex items-center gap-1">
                <Lock className="h-3 w-3 text-primary" /> PIN Protected
              </span>
              <span>JazzCash • EasyPaisa • Bank</span>
            </div>
          </div>
        </div>
      </section>

      {/* How it works 3 Steps */}
      <section className="mx-auto max-w-6xl px-3.5 py-8 sm:px-6 sm:py-14 sm:pb-24 border-t border-border/60">
        <div className="text-center max-w-xl mx-auto">
          <span className="text-[10px] font-bold uppercase tracking-wider text-primary">
            Simple 3-Step Flow
          </span>
          <h2 className="mt-0.5 text-xl font-bold sm:text-3xl text-foreground">
            How HissaClub works
          </h2>
          <p className="mt-1 text-xs text-muted-foreground">
            Zero complicated accounts. Simple group collections in under two minutes.
          </p>
        </div>

        <div className="mt-6 grid gap-2.5 sm:gap-4 md:grid-cols-3">
          {steps.map((s) => {
            const Icon = s.icon;
            return (
              <div
                key={s.step}
                className="card-surface p-4 sm:p-5 flex flex-col justify-between hover:border-primary/40"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="brand-gradient flex h-8 w-8 items-center justify-center rounded-lg text-primary-foreground shadow-sm">
                      <Icon className="h-4 w-4" />
                    </span>
                    <span className="font-mono text-xs font-extrabold text-muted-foreground">
                      STEP {s.step}
                    </span>
                  </div>
                  <h3 className="mt-3 text-sm font-bold text-foreground">{s.title}</h3>
                  <p className="mt-1 text-xs text-muted-foreground leading-relaxed">{s.copy}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Made for Every Group (Fixed: Sleek Horizontal List on Mobile, Grid on Desktop) */}
      <section className="mx-auto max-w-6xl px-3.5 pb-10 sm:px-6 sm:pb-30">
        <div className="mb-4">
          <span className="text-[10px] font-bold uppercase tracking-wider text-primary">
            Popular Use Cases
          </span>
          <h2 className="mt-0.5 text-xl font-bold sm:text-2xl text-foreground">
            Made for every group
          </h2>
        </div>

        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((c) => {
            const Icon = c.icon;
            return (
              <div
                key={c.title}
                className="card-surface p-3 sm:p-4 flex items-center gap-3 transition-all hover:border-primary/40"
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-accent text-accent-foreground">
                  <Icon className="h-4.5 w-4.5" />
                </span>
                <div className="min-w-0 flex-1">
                  <h3 className="text-xs sm:text-sm font-bold text-foreground truncate">
                    {c.title}
                  </h3>
                  <p className="text-[11px] text-muted-foreground truncate sm:whitespace-normal">
                    {c.copy}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Privacy & Trust CTA Banner */}
      <section className="mx-auto max-w-6xl px-3.5 pb-12 sm:px-6 sm:pb-20">
        <div className="card-surface p-4 sm:p-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-primary/20">
          <div className="max-w-xl">
            <span className="inline-flex items-center gap-1 rounded-full bg-amber-soft px-2 py-0.5 text-[10px] font-bold text-amber-ink">
              <ShieldCheck className="h-3 w-3" /> Privacy & Verification
            </span>
            <h2 className="mt-1.5 text-base sm:text-2xl font-extrabold text-foreground">
              Zero awkwardness. Total privacy & trust.
            </h2>
            <p className="mt-1 text-xs text-muted-foreground leading-relaxed sm:text-sm">
              Group members track live pool progress without exposing individual payment slips.
              Organisers verify submissions securely with a 4-digit PIN and generate instant
              WhatsApp reminders.
            </p>
          </div>

          <Link
            to="/create"
            className="btn-primary text-xs sm:text-sm py-2 px-4 shrink-0 justify-center shadow-lift"
          >
            Start a free pool <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </section>
    </div>
  );
}

function Stat({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="rounded-lg border border-border bg-secondary/30 p-1.5 sm:p-2">
      <p className="text-[9px] sm:text-[10px] font-bold tracking-wider text-muted-foreground uppercase">
        {label}
      </p>
      <p className={`mt-0.5 text-xs sm:text-sm font-extrabold ${highlight ? "brand-text" : ""}`}>
        {value}
      </p>
    </div>
  );
}
