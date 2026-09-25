import { useState } from "react";
import { ImagePlus, X } from "lucide-react";
import type { Pool } from "@/data/mockData";
import { addClaim, formatPKR } from "@/lib/poolStore";

export function ClaimShareModal({ pool, onClose }: { pool: Pool; onClose: () => void }) {
  const equal = pool.splitType === "equal";
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [shares, setShares] = useState(1);
  const [amount, setAmount] = useState(equal ? pool.shareAmount : 5000);
  const [txnId, setTxnId] = useState("");
  const [fileName, setFileName] = useState<string | null>(null);
  const [screenshotData, setScreenshotData] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const finalAmount = equal ? shares * pool.shareAmount : amount;

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      const reader = new FileReader();
      reader.onloadend = () => {
        setScreenshotData(reader.result as string);
        // Error clear kar dein jab file select ho jaye
        setErrors((prev) => {
          const rest = { ...prev };
          delete rest["screenshot"];
          return rest;
        });
      };
      reader.readAsDataURL(file);
    }
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const next: Record<string, string> = {};

    if (name.trim().length < 3) next["name"] = "Please write your full name.";

    const rawDigits = phone.replace(/\D/g, "");
    if (rawDigits.length < 10) {
      next["phone"] = "Please enter a valid phone number (e.g. 03001234567).";
    }

    if (finalAmount <= 0) next["amount"] = "Amount must be more than zero.";

    // Screenshot ko mandatory check karein
    if (!screenshotData) {
      next["screenshot"] = "Payment screenshot is required.";
    }

    setErrors(next);
    if (Object.keys(next).length) return;

    // Aakhri 10 digits se match
    const normalizedDigits = rawDigits.startsWith("0") ? `92${rawDigits.slice(1)}` : rawDigits;
    const last10Digits = rawDigits.slice(-10);

    const existingSlot = pool.claims.find((c) => {
      const cDigits = (c.phone || "").replace(/\D/g, "");
      return cDigits.endsWith(last10Digits) && c.status === "pending";
    });

    const targetClaimId = existingSlot ? existingSlot.id : `c${Date.now()}`;

    addClaim(pool.id, {
      id: targetClaimId,
      name: name.trim() || existingSlot?.name || "Member",
      phone: normalizedDigits,
      shares: equal ? shares : 1,
      amount: finalAmount,
      txnId: txnId.trim() || "—",
      date: new Date().toISOString().slice(0, 10),
      status: "pending",
      screenshotUrl: screenshotData || "",
    });

    if (typeof window !== "undefined") {
      window.localStorage.setItem(`hissaclub_myclaim_${pool.id}`, targetClaimId);
    }

    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-foreground/40 p-0 backdrop-blur-sm sm:items-center sm:p-4">
      <form
        onSubmit={submit}
        className="max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-t-3xl border border-border bg-card p-6 shadow-lift sm:rounded-3xl"
      >
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <h3 className="text-xl font-bold">Claim your share</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Send the money first, then record it here for the organiser to verify.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-1.5 text-muted-foreground hover:bg-secondary cursor-pointer"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-4">
          <Field label="Your full name" error={errors["name"]}>
            <input
              className="field"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Sana Tariq"
            />
          </Field>

          <Field label="WhatsApp / Phone number" error={errors["phone"]}>
            <input
              className="field"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="03291234567"
            />
            <p className="mt-1 text-xs text-muted-foreground">
              Enter the same number the organiser used for you to update your status.
            </p>
          </Field>

          {equal ? (
            <Field label={`Shares (${formatPKR(pool.shareAmount)} each)`}>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  min={1}
                  max={pool.totalShares || 100}
                  className="field"
                  value={shares}
                  onChange={(e) => setShares(Math.max(1, Number(e.target.value)))}
                />
                <span className="shrink-0 rounded-full bg-secondary px-3 py-2 text-sm font-semibold">
                  {formatPKR(finalAmount)}
                </span>
              </div>
            </Field>
          ) : (
            <Field label="Amount you are contributing (PKR)" error={errors["amount"]}>
              <input
                type="number"
                min={1}
                className="field"
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
              />
            </Field>
          )}

          <Field label="Transaction ID (optional)">
            <input
              className="field"
              value={txnId}
              onChange={(e) => setTxnId(e.target.value)}
              placeholder="e.g. JC-884213 or Bank Ref"
            />
          </Field>

          {/* Screenshot Upload with Required Validation */}
          <div className="space-y-1.5">
            <label
              className={`flex cursor-pointer items-center gap-3 rounded-xl border border-dashed px-4 py-4 text-sm transition-colors ${
                errors["screenshot"]
                  ? "border-destructive bg-destructive/10 text-destructive"
                  : "border-border bg-secondary/40 text-muted-foreground hover:border-primary"
              }`}
            >
              <ImagePlus
                className={`h-5 w-5 ${errors["screenshot"] ? "text-destructive" : "text-primary"}`}
              />
              <span className="truncate">{fileName ?? "Upload payment screenshot *"}</span>
              <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
            </label>
            {errors["screenshot"] ? (
              <p className="text-xs font-medium text-destructive">{errors["screenshot"]}</p>
            ) : null}
          </div>
        </div>

        <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <button type="button" className="btn-ghost" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className="btn-primary">
            Submit claim
          </button>
        </div>
      </form>
    </div>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string | undefined;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label className="text-sm font-semibold">{label}</label>
      {children}
      {error ? <p className="text-xs font-medium text-destructive">{error}</p> : null}
    </div>
  );
}
