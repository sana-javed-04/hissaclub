import { useEffect, useState } from "react";
import { MessageCircle, PartyPopper, SkipForward, X } from "lucide-react";
import type { Claim, Pool } from "@/data/mockData";
import { formatPKR } from "@/lib/poolStore";

export function buildMessage(pool: Pool, claim: Claim) {
  return `Assalam o Alaikum ${claim.name}! 👋\n\nThis is a gentle reminder for "${pool.title}". Your share of ${formatPKR(claim.amount)} is still pending.\n\nYou can send it to ${pool.admin.walletType}: ${pool.admin.wallet} (${pool.admin.name}) or IBAN ${pool.admin.iban}.\n\nOnce sent, please share the screenshot. Shukriya! 🙏`;
}

export function NudgeQueueModal({
  pool,
  pending,
  onClose,
}: {
  pool: Pool;
  pending: Claim[];
  onClose: () => void;
}) {
  const [index, setIndex] = useState(0);
  const current = pending[index];

  useEffect(() => {
    if (index > pending.length) setIndex(pending.length);
  }, [pending.length, index]);

  function send() {
    if (!current) return;
    const url = `https://wa.me/${current.phone}?text=${encodeURIComponent(buildMessage(pool, current))}`;
    window.open(url, "_blank", "noopener,noreferrer");
    setIndex((i) => i + 1);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-foreground/40 backdrop-blur-sm sm:items-center sm:p-4">
      <div className="max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-t-3xl border border-border bg-card p-6 shadow-lift sm:rounded-3xl">
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <h3 className="text-xl font-bold">Nudge pending members</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              No contact saving needed — each message opens straight in WhatsApp.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-1.5 text-muted-foreground hover:bg-secondary"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {current ? (
          <>
            <p className="mb-3 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
              Member {index + 1} of {pending.length}
            </p>
            <div className="rounded-2xl border border-border bg-secondary/40 p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <p className="font-display text-lg font-bold">{current.name}</p>
                  <p className="text-sm text-muted-foreground">+{current.phone}</p>
                </div>
                <span className="rounded-full bg-amber-soft px-3 py-1 text-sm font-semibold text-amber-ink">
                  {formatPKR(current.amount)} pending
                </span>
              </div>
            </div>

            <p className="mt-4 mb-2 text-sm font-semibold">Message preview</p>
            <pre className="max-h-48 overflow-y-auto rounded-2xl border border-border bg-background p-4 text-sm whitespace-pre-wrap text-muted-foreground">
              {buildMessage(pool, current)}
            </pre>

            <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <button type="button" className="btn-ghost" onClick={() => setIndex((i) => i + 1)}>
                <SkipForward className="h-4 w-4" /> Skip
              </button>
              <button type="button" className="btn-primary" onClick={send}>
                <MessageCircle className="h-4 w-4" /> Send via WhatsApp
              </button>
            </div>
          </>
        ) : (
          <div className="py-10 text-center">
            <PartyPopper className="mx-auto h-10 w-10 text-primary" />
            <p className="mt-4 font-display text-xl font-bold">All pending members nudged!</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Sit back — the reminders are on their way.
            </p>
            <button type="button" className="btn-primary mt-6" onClick={onClose}>
              Done
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
