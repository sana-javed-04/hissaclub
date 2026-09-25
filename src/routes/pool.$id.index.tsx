import { useState, useEffect } from "react";
import { createFileRoute, Link, useParams, useNavigate } from "@tanstack/react-router";
import {
  Building2,
  Check,
  Copy,
  HandCoins,
  ShieldCheck,
  Smartphone,
  Lock,
  Clock,
  CheckCircle2,
  XCircle,
  Share2,
} from "lucide-react";
import { ProgressBar } from "@/components/ProgressBar";
import { StatusBadge } from "@/components/Badge";
import { ClaimShareModal } from "@/components/ClaimShareModal";
import { collected, formatPKR, usePool } from "@/lib/poolStore";

export const Route = createFileRoute("/pool/$id/")({
  head: () => ({
    meta: [
      { title: "Pool details — HissaClub" },
      {
        name: "description",
        content:
          "See how much of the group target is collected, copy the payment details and claim your share in a few taps.",
      },
      { property: "og:title", content: "Pool details — HissaClub" },
      {
        property: "og:description",
        content: "Live group pool with a secure privacy ledger.",
      },
    ],
  }),
  component: PoolDetail,
});

function PoolDetail() {
  const { id } = useParams({ from: "/pool/$id/" });
  const navigate = useNavigate();
  const pool = usePool(id);
  const [claiming, setClaiming] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  const [linkCopied, setLinkCopied] = useState(false);

  const [pinModal, setPinModal] = useState(false);
  const [enteredPin, setEnteredPin] = useState("");
  const [pinError, setPinError] = useState("");

  const [myClaimId, setMyClaimId] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = window.localStorage.getItem(`hissaclub_myclaim_${id}`);
      setMyClaimId(stored);
    }
  }, [id]);

  if (!pool) {
    return (
      <div className="mx-auto max-w-xl px-4 py-20 text-center">
        <h1 className="text-2xl font-bold">This pool isn't here</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          The link may be old, or the pool was created in another browser.
        </p>
        <Link to="/" className="btn-primary mt-6 inline-flex">
          Back home
        </Link>
      </div>
    );
  }

  const raised = collected(pool);
  const remaining = Math.max(0, pool.target - raised);
  const myClaim = pool.claims.find((c) => c.id === myClaimId);

  function copy(label: string, value: string) {
    navigator.clipboard?.writeText(value);
    setCopied(label);
    setTimeout(() => setCopied(null), 1600);
  }

  function copyPoolLink() {
    if (typeof window !== "undefined") {
      navigator.clipboard?.writeText(window.location.href);
      setLinkCopied(true);
      setTimeout(() => setLinkCopied(false), 2000);
    }
  }

  function handleAdminUnlock(e: React.FormEvent) {
    e.preventDefault();
    const correctPin = pool?.adminPin || "1234";
    if (enteredPin === correctPin) {
      if (typeof window !== "undefined") {
        sessionStorage.setItem(`admin_auth_${id}`, "true");
      }
      navigate({ to: "/pool/$id/admin", params: { id } });
    } else {
      setPinError("Incorrect PIN. Please enter the valid 4-digit code.");
    }
  }

  return (
    <div className="mx-auto max-w-5xl px-3 py-5 sm:px-6 sm:py-10">
      {/* Category & Shares Tag */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
          <span className="rounded-full bg-accent px-2.5 py-0.5 text-xs font-semibold text-accent-foreground">
            {pool.category}
          </span>
          <span className="rounded-full border border-border px-2.5 py-0.5 text-xs font-semibold text-muted-foreground">
            {pool.splitType === "equal"
              ? `${pool.totalShares} shares of ${formatPKR(pool.shareAmount)}`
              : "Open contribution"}
          </span>
        </div>

        <button
          type="button"
          onClick={copyPoolLink}
          className="inline-flex items-center gap-1 rounded-full border border-border bg-card px-2.5 py-1 text-xs font-semibold text-muted-foreground hover:text-foreground cursor-pointer"
        >
          {linkCopied ? (
            <>
              <Check className="h-3 w-3 text-primary" /> Link Copied
            </>
          ) : (
            <>
              <Share2 className="h-3 w-3" /> Share Pool
            </>
          )}
        </button>
      </div>

      {/* Pool Header */}
      <h1 className="mt-3 text-2xl font-extrabold tracking-tight sm:text-4xl">{pool.title}</h1>
      <p className="mt-2 text-xs leading-relaxed text-muted-foreground sm:text-sm max-w-2xl">
        {pool.description}
      </p>

      {/* Main Grid: Progress & Payment Info */}
      <div className="mt-5 grid gap-4 lg:grid-cols-[1.25fr_0.75fr]">
        {/* Progress & Actions */}
        <div className="card-surface p-4 sm:p-6 flex flex-col justify-between">
          <div>
            <div className="grid grid-cols-3 gap-2 text-center">
              <Stat label="Target" value={formatPKR(pool.target)} />
              <Stat label="Collected" value={formatPKR(raised)} highlight />
              <Stat label="Remaining" value={formatPKR(remaining)} />
            </div>

            <div className="mt-4">
              <ProgressBar value={raised} target={pool.target} />
            </div>
          </div>

          <div className="mt-5 grid grid-cols-1 gap-2 sm:grid-cols-2">
            <button
              type="button"
              className="btn-primary text-xs sm:text-sm py-2.5 w-full justify-center"
              onClick={() => setClaiming(true)}
            >
              <HandCoins className="h-4 w-4" /> Claim your share
            </button>
            <button
              type="button"
              onClick={() => setPinModal(true)}
              className="btn-ghost text-xs sm:text-sm py-2.5 w-full justify-center"
            >
              <ShieldCheck className="h-4 w-4" /> Organiser view
            </button>
          </div>
        </div>

        {/* Payment Account Details */}
        <div className="card-surface p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold sm:text-base">Payment Details</h2>
            <span className="text-[11px] text-muted-foreground">Admin: {pool.admin.name}</span>
          </div>

          <div className="mt-3 space-y-2">
            <PayRow
              icon={Smartphone}
              label={pool.admin.walletType}
              value={pool.admin.wallet}
              copied={copied === "wallet"}
              onCopy={() => copy("wallet", pool.admin.wallet)}
            />
            <PayRow
              icon={Building2}
              label={pool.admin.bank || "Bank Account"}
              value={pool.admin.iban}
              copied={copied === "iban"}
              onCopy={() => copy("iban", pool.admin.iban)}
            />
          </div>
        </div>
      </div>

      {/* Contributor's Private Submission Status */}
      {myClaim && (
        <div className="card-surface mt-4 p-4 sm:p-5 border-l-4 border-l-primary">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
              <span className="text-[10px] font-bold tracking-wider text-primary uppercase">
                Your Submission Status
              </span>
              <h3 className="text-sm sm:text-base font-bold text-foreground mt-0.5">
                {myClaim.name}
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Share:{" "}
                <span className="font-semibold text-foreground">{formatPKR(myClaim.amount)}</span>
                {myClaim.txnId && myClaim.txnId !== "—" ? ` • Txn: ${myClaim.txnId}` : ""}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2 pt-1 sm:pt-0">
              <StatusBadge status={myClaim.status} />

              {myClaim.status === "pending" && (
                <span className="text-xs text-amber-500 font-medium flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" /> Awaiting organiser approval
                </span>
              )}
              {myClaim.status === "verified" && (
                <span className="text-xs text-emerald-500 font-medium flex items-center gap-1">
                  <CheckCircle2 className="h-3.5 w-3.5" /> Payment verified
                </span>
              )}
              {myClaim.status === "rejected" && (
                <span className="text-xs text-destructive font-medium flex items-center gap-1">
                  <XCircle className="h-3.5 w-3.5" /> Receipt rejected
                </span>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Secret PIN Modal */}
      {pinModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/60 p-3 backdrop-blur-sm">
          <form
            onSubmit={handleAdminUnlock}
            className="w-full max-w-xs rounded-2xl border border-border bg-card p-5 shadow-lift text-center sm:max-w-sm sm:p-6"
          >
            <div className="mx-auto w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-2.5">
              <Lock className="h-5 w-5" />
            </div>
            <h3 className="text-lg font-bold">Organiser Access</h3>
            <p className="text-xs text-muted-foreground mt-1 mb-4">
              Enter 4-digit PIN to manage claims and approvals.
            </p>
            <input
              type="password"
              maxLength={4}
              autoFocus
              className="field text-center text-xl font-bold tracking-[0.4em] mb-2"
              placeholder="••••"
              value={enteredPin}
              onChange={(e) => {
                setEnteredPin(e.target.value.replace(/\D/g, ""));
                setPinError("");
              }}
            />
            {pinError && (
              <p className="text-[11px] font-medium text-destructive mb-2">{pinError}</p>
            )}
            <div className="flex gap-2 mt-3">
              <button
                type="button"
                className="btn-ghost flex-1 text-xs py-2"
                onClick={() => setPinModal(false)}
              >
                Cancel
              </button>
              <button type="submit" className="btn-primary flex-1 text-xs py-2">
                Unlock
              </button>
            </div>
          </form>
        </div>
      )}

      {claiming ? (
        <ClaimShareModal
          pool={pool}
          onClose={() => {
            setClaiming(false);
            if (typeof window !== "undefined") {
              const stored = window.localStorage.getItem(`hissaclub_myclaim_${id}`);
              setMyClaimId(stored);
            }
          }}
        />
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

function PayRow({
  icon: Icon,
  label,
  value,
  copied,
  onCopy,
}: {
  icon: typeof Smartphone;
  label: string;
  value: string;
  copied: boolean;
  onCopy: () => void;
}) {
  if (!value) return null;
  return (
    <div className="flex items-center justify-between gap-2 rounded-xl border border-border bg-secondary/30 px-3 py-2.5">
      <div className="min-w-0">
        <p className="flex items-center gap-1.5 text-[11px] font-semibold text-muted-foreground">
          <Icon className="h-3.5 w-3.5 text-primary" /> {label}
        </p>
        <p className="mt-0.5 truncate text-xs sm:text-sm font-bold">{value}</p>
      </div>
      <button
        type="button"
        onClick={onCopy}
        className="shrink-0 rounded-lg border border-border bg-card p-1.5 text-muted-foreground transition-colors hover:text-primary cursor-pointer"
        aria-label={`Copy ${label}`}
      >
        {copied ? <Check className="h-3.5 w-3.5 text-primary" /> : <Copy className="h-3.5 w-3.5" />}
      </button>
    </div>
  );
}
