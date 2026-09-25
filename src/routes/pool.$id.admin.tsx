import { useState } from "react";
import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { ArrowLeft, Check, Eye, FileText, Printer, X, Zap } from "lucide-react";
import { StatusBadge } from "@/components/Badge";
import { NudgeQueueModal } from "@/components/NudgeQueueModal";
import { ProgressBar } from "@/components/ProgressBar";
import { collected, formatPKR, pendingTotal, setClaimStatus, usePool } from "@/lib/poolStore";

export const Route = createFileRoute("/pool/$id/admin")({
  head: () => ({
    meta: [
      { title: "Organiser dashboard — HissaClub" },
      {
        name: "description",
        content:
          "Approve or reject payment slips, nudge pending members on WhatsApp one by one, and print a clean audit ledger.",
      },
      { property: "og:title", content: "Organiser dashboard — HissaClub" },
      {
        property: "og:description",
        content: "Manage claims and reminders for your group pool.",
      },
    ],
  }),
  component: AdminDashboard,
});

function AdminDashboard() {
  const { id } = useParams({ from: "/pool/$id/admin" });
  const pool = usePool(id);
  const [nudging, setNudging] = useState(false);
  const [ledger, setLedger] = useState(false);
  const [viewingSlip, setViewingSlip] = useState<{ url: string; name: string } | null>(null);

  if (!pool) {
    return (
      <div className="mx-auto max-w-xl px-4 py-24 text-center">
        <h1 className="text-2xl font-bold">This pool isn't here</h1>
        <Link to="/" className="btn-primary mt-6">
          Back home
        </Link>
      </div>
    );
  }

  const pending = pool.claims.filter((c) => c.status === "pending");
  const verified = pool.claims.filter((c) => c.status === "verified");
  const raised = collected(pool);

  const sortedClaims = [...pool.claims].sort((a, b) => {
    const aSubmitted = Boolean(a.screenshotUrl || (a.txnId && a.txnId !== "—"));
    const bSubmitted = Boolean(b.screenshotUrl || (b.txnId && b.txnId !== "—"));

    const getPriority = (c: typeof a, submitted: boolean) => {
      if (c.status === "pending" && submitted) return 1;
      if (c.status === "pending" && !submitted) return 2;
      if (c.status === "verified") return 3;
      return 4;
    };

    return getPriority(a, aSubmitted) - getPriority(b, bSubmitted);
  });

  return (
    <div className="mx-auto max-w-4xl px-3 py-5 sm:px-6 sm:py-10">
      <Link
        to="/pool/$id"
        params={{ id: pool.id }}
        className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-3.5 w-3.5" /> Back to public pool
      </Link>

      {/* Header Area */}
      <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <span className="inline-block rounded-md bg-primary/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-primary">
            Organiser View
          </span>
          <h1 className="mt-1 text-2xl font-extrabold tracking-tight sm:text-3xl">{pool.title}</h1>
        </div>
        <div className="grid grid-cols-2 gap-2 sm:flex sm:items-center">
          <button
            type="button"
            className="btn-ghost text-xs py-2 px-3 justify-center"
            onClick={() => setLedger(true)}
          >
            <FileText className="h-3.5 w-3.5" /> Ledger
          </button>
          <button
            type="button"
            className="btn-primary text-xs py-2 px-3 justify-center"
            disabled={pending.length === 0}
            onClick={() => setNudging(true)}
          >
            <Zap className="h-3.5 w-3.5" /> Nudge ({pending.length})
          </button>
        </div>
      </div>

      {/* Metrics Card */}
      <div className="card-surface mt-4 p-4 sm:p-5">
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          <Stat label="Target" value={formatPKR(pool.target)} />
          <Stat label="Verified" value={formatPKR(raised)} highlight />
          <Stat label="Awaiting" value={formatPKR(pendingTotal(pool))} />
          <Stat label="Remaining" value={formatPKR(Math.max(0, pool.target - raised))} />
        </div>
        <div className="mt-3">
          <ProgressBar value={raised} target={pool.target} />
        </div>
      </div>

      {/* Structured Member Cards */}
      <div className="mt-6">
        <div className="mb-3 flex items-center justify-between px-1">
          <div>
            <h2 className="text-sm font-bold sm:text-base">Members & Submissions</h2>
            <p className="text-[11px] text-muted-foreground">
              Review slips and approve claims to complete collection.
            </p>
          </div>
          <span className="text-xs font-semibold text-muted-foreground">
            {pool.claims.length} total
          </span>
        </div>

        <div className="space-y-2.5">
          {sortedClaims.map((c) => {
            const hasSlip = Boolean(c.screenshotUrl);
            const isPending = c.status === "pending";

            return (
              <div key={c.id} className="card-surface p-3.5 sm:p-4 transition-all">
                {/* Top: Name, Badge, and Amount */}
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm sm:text-base text-foreground truncate">
                        {c.name}
                      </span>
                      <StatusBadge status={c.status} />
                    </div>
                    <p className="mt-0.5 text-[11px] text-muted-foreground">
                      +{c.phone} {c.txnId && c.txnId !== "—" ? `• Txn: ${c.txnId}` : ""}
                    </p>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="font-extrabold text-sm sm:text-base text-foreground">
                      {formatPKR(c.amount)}
                    </span>
                    <p className="text-[10px] text-muted-foreground">{c.date}</p>
                  </div>
                </div>

                {/* Bottom Actions if Pending */}
                {isPending && (
                  <div className="mt-3 pt-2.5 border-t border-border/60 flex items-center gap-1.5">
                    {hasSlip ? (
                      <button
                        type="button"
                        onClick={() => setViewingSlip({ url: c.screenshotUrl!, name: c.name })}
                        className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-lg border border-border bg-secondary/60 py-1.5 text-xs font-semibold text-foreground hover:bg-secondary cursor-pointer"
                      >
                        <Eye className="h-3.5 w-3.5 text-primary" /> View Slip
                      </button>
                    ) : (
                      <span className="text-[11px] text-muted-foreground italic flex-1 py-1">
                        Awaiting slip
                      </span>
                    )}

                    <button
                      type="button"
                      onClick={() => setClaimStatus(pool.id, c.id, "verified")}
                      className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-lg bg-primary py-1.5 text-xs font-semibold text-primary-foreground hover:opacity-90 shadow-sm cursor-pointer"
                    >
                      <Check className="h-3.5 w-3.5" /> Approve
                    </button>

                    <button
                      type="button"
                      onClick={() => setClaimStatus(pool.id, c.id, "rejected")}
                      className="inline-flex items-center justify-center rounded-lg border border-border p-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 cursor-pointer"
                      title="Reject"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                )}
              </div>
            );
          })}

          {sortedClaims.length === 0 && (
            <div className="card-surface p-8 text-center text-xs text-muted-foreground">
              No claims recorded yet.
            </div>
          )}
        </div>
      </div>

      {/* Slip Preview Modal */}
      {viewingSlip ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/60 p-3 backdrop-blur-sm">
          <div className="max-h-[90vh] w-full max-w-md overflow-hidden rounded-2xl border border-border bg-card p-4 shadow-lift sm:rounded-3xl sm:p-5">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <div>
                <h3 className="font-bold text-base sm:text-lg">Payment Receipt</h3>
                <p className="text-xs text-muted-foreground">Submitted by {viewingSlip.name}</p>
              </div>
              <button
                type="button"
                onClick={() => setViewingSlip(null)}
                className="rounded-full p-1.5 text-muted-foreground hover:bg-secondary cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="mt-3 max-h-[60vh] overflow-y-auto rounded-xl border border-border flex items-center justify-center bg-secondary/30 p-2">
              <img
                src={viewingSlip.url}
                alt="Payment Receipt Slip"
                className="w-full object-contain rounded-lg shadow-sm"
              />
            </div>
            <div className="mt-3">
              <button
                type="button"
                className="btn-primary w-full text-xs py-2"
                onClick={() => setViewingSlip(null)}
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {nudging ? (
        <NudgeQueueModal pool={pool} pending={pending} onClose={() => setNudging(false)} />
      ) : null}

      {ledger ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/40 p-3 backdrop-blur-sm">
          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-border bg-card p-4 shadow-lift sm:rounded-3xl sm:p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-lg font-bold sm:text-xl">Audit ledger</h3>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {pool.title} • {verified.length} verified contributions
                </p>
              </div>
              <button
                type="button"
                onClick={() => setLedger(false)}
                className="rounded-full p-1.5 text-muted-foreground hover:bg-secondary cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <ul className="mt-4 divide-y divide-border rounded-xl border border-border">
              {verified.map((c) => (
                <li
                  key={c.id}
                  className="flex items-center justify-between gap-3 px-3 py-2.5 sm:px-4 sm:py-3"
                >
                  <div>
                    <p className="text-xs sm:text-sm font-semibold">{c.name}</p>
                    <p className="text-[11px] text-muted-foreground">
                      Txn {c.txnId} • {c.date}
                    </p>
                  </div>
                  <span className="text-xs sm:text-sm font-bold">{formatPKR(c.amount)}</span>
                </li>
              ))}
              {verified.length === 0 ? (
                <li className="px-4 py-6 text-center text-sm text-muted-foreground">
                  Nothing verified yet.
                </li>
              ) : null}
            </ul>

            <div className="mt-3 flex items-center justify-between rounded-xl bg-secondary/50 px-3 py-2.5">
              <span className="text-xs font-semibold">Total verified</span>
              <span className="brand-text font-bold text-sm">{formatPKR(raised)}</span>
            </div>

            <div className="mt-5 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <button
                type="button"
                className="btn-ghost text-xs py-2 px-3"
                onClick={() => setLedger(false)}
              >
                Close
              </button>
              <button
                type="button"
                className="btn-primary text-xs py-2 px-3"
                onClick={() => window.print()}
              >
                <Printer className="h-3.5 w-3.5" /> Print summary
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function Stat({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="rounded-xl border border-border bg-secondary/40 p-2 sm:p-2.5">
      <p className="text-[10px] font-semibold tracking-wider text-muted-foreground uppercase">
        {label}
      </p>
      <p className={`mt-0.5 text-xs sm:text-sm font-bold ${highlight ? "brand-text" : ""}`}>
        {value}
      </p>
    </div>
  );
}
