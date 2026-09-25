import { useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, Check, Plus, Trash2, UserPlus, ClipboardPaste } from "lucide-react";
import { CATEGORIES, type PoolCategory, type Claim } from "@/data/mockData";
import { createPool, formatPKR, slugify, saveCreatedPoolId } from "@/lib/poolStore";

export const Route = createFileRoute("/create")({
  head: () => ({
    meta: [
      { title: "Create a pool — HissaClub" },
      {
        name: "description",
        content:
          "Set your target amount, choose equal shares or open contribution, add your payment details and get a shareable pool link in seconds.",
      },
      { property: "og:title", content: "Create a pool — HissaClub" },
      {
        property: "og:description",
        content: "Launch a group money pool in three quick steps.",
      },
    ],
  }),
  component: CreatePool,
});

const stepTitles = ["What's the pool for?", "Money, shares & members", "Where should members pay?"];

interface MemberInput {
  name: string;
  phone: string;
}

function CreatePool() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [members, setMembers] = useState<MemberInput[]>([]);
  const [bulkText, setBulkText] = useState("");
  const [showBulkInput, setShowBulkInput] = useState(false);

  const [form, setForm] = useState({
    title: "",
    category: CATEGORIES[1] as PoolCategory,
    description: "",
    target: 60000,
    splitType: "equal" as "equal" | "open",
    totalShares: 4,
    adminName: "",
    adminPhone: "",
    walletType: "JazzCash",
    wallet: "",
    bank: "",
    iban: "",
    adminPin: "1234",
  });

  const set = <K extends keyof typeof form>(key: K, value: (typeof form)[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  const shareAmount =
    form.splitType === "equal" && form.totalShares > 0
      ? Math.round(form.target / form.totalShares)
      : 0;

  function addMemberRow() {
    setMembers((prev) => [...prev, { name: "", phone: "" }]);
  }

  function removeMemberRow(index: number) {
    setMembers((prev) => prev.filter((_, i) => i !== index));
  }

  function updateMember(index: number, key: keyof MemberInput, value: string) {
    setMembers((prev) => prev.map((m, i) => (i === index ? { ...m, [key]: value } : m)));
  }

  function handleParseBulk() {
    if (!bulkText.trim()) return;

    const lines = bulkText.split("\n");
    const parsed: MemberInput[] = [];

    for (const rawLine of lines) {
      const line = rawLine.trim();
      if (!line) continue;

      let name = "";
      let phone = "";

      if (line.includes(",")) {
        const parts = line.split(",");
        name = parts[0]?.trim() || "";
        phone = parts.slice(1).join("").trim();
      } else if (line.includes("-")) {
        const parts = line.split("-");
        name = parts[0]?.trim() || "";
        phone = parts.slice(1).join("").trim();
      } else {
        const match = line.match(/^(.*?)(?:\s+)?((?:92|0|\+92)?\d{9,11})$/);
        if (match) {
          name = match[1]?.trim() || "";
          phone = match[2]?.trim() || "";
        } else {
          name = line;
          phone = "";
        }
      }

      if (name) {
        parsed.push({ name, phone });
      }
    }

    if (parsed.length > 0) {
      setMembers((prev) => [...prev, ...parsed]);
      setBulkText("");
      setShowBulkInput(false);
    }
  }

  function validate(current: number) {
    const e: Record<string, string> = {};
    if (current === 0) {
      if (form.title.trim().length < 4) e["title"] = "Give your pool a clear name.";
      if (form.description.trim().length < 10)
        e["description"] = "Add a line or two so members know what this is.";
    }
    if (current === 1) {
      if (form.target < 1000) e["target"] = "Target should be at least Rs. 1,000.";
      if (form.splitType === "equal" && form.totalShares < 1)
        e["totalShares"] = "Need at least one share.";
    }
    if (current === 2) {
      if (form.adminName.trim().length < 3) e["adminName"] = "Please add your name.";
      if (!/^(92|0)\d{9,11}$/.test(form.adminPhone.replace(/\D/g, "")))
        e["adminPhone"] = "Use a number like 03001234567.";
      if (form.wallet.trim().length < 10 && form.iban.trim().length < 10)
        e["wallet"] = "Add a wallet number or an IBAN so members can pay.";
      if (form.adminPin.trim().length !== 4) e["adminPin"] = "Set a 4-digit secret PIN.";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function next() {
    if (!validate(step)) return;
    setStep((s) => s + 1);
  }

  function submit() {
    if (!validate(2)) return;
    const digits = form.adminPhone.replace(/\D/g, "");
    const id = slugify(form.title);

    const initialClaims: Claim[] = members
      .filter((m) => m.name.trim().length > 0)
      .map((m, idx) => {
        const cleanPhone = m.phone.replace(/\D/g, "");
        const formattedPhone = cleanPhone.startsWith("0") ? `92${cleanPhone.slice(1)}` : cleanPhone;
        return {
          id: `pre_${Date.now()}_${idx}`,
          name: m.name.trim(),
          phone: formattedPhone || "03000000000",
          shares: 1,
          amount: form.splitType === "equal" ? shareAmount : 0,
          txnId: "—",
          date: new Date().toISOString().slice(0, 10),
          status: "pending",
          screenshotUrl: "",
        };
      });

    createPool({
      id,
      title: form.title.trim(),
      category: form.category,
      description: form.description.trim(),
      target: form.target,
      splitType: form.splitType,
      shareAmount,
      totalShares: form.splitType === "equal" ? form.totalShares : 0,
      adminPin: form.adminPin.trim() || "1234",
      admin: {
        name: form.adminName.trim(),
        phone: digits.startsWith("0") ? `92${digits.slice(1)}` : digits,
        wallet: form.wallet.trim(),
        walletType: form.walletType,
        iban: form.iban.trim(),
        bank: form.bank.trim(),
      },
      createdAt: new Date().toISOString().slice(0, 10),
      claims: initialClaims,
    });

    saveCreatedPoolId(id);
    navigate({ to: "/pool/$id", params: { id } });
  }

  return (
    <div className="mx-auto max-w-xl px-3 py-6 sm:px-4 sm:py-10">
      <h1 className="text-2xl font-bold sm:text-3xl">Start a new pool</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Three short steps and your link is ready.
      </p>

      {/* Steps Indicator */}
      <div className="mt-6 flex items-center gap-2">
        {stepTitles.map((t, i) => (
          <div key={t} className="flex flex-1 items-center gap-2">
            <span
              className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                i <= step
                  ? "brand-gradient text-primary-foreground"
                  : "bg-secondary text-muted-foreground"
              }`}
            >
              {i < step ? <Check className="h-3.5 w-3.5" /> : i + 1}
            </span>
            {i < stepTitles.length - 1 ? (
              <span
                className={`hidden h-0.5 flex-1 rounded-full sm:block ${i < step ? "bg-primary" : "bg-border"}`}
              />
            ) : null}
          </div>
        ))}
      </div>

      {/* Compact Card */}
      <div className="card-surface mt-5 p-2 sm:p-5">
        <h2 className="text-lg font-bold sm:text-xl">{stepTitles[step]}</h2>

        <div className="mt-5 space-y-4">
          {step === 0 ? (
            <>
              <Field label="Pool title" error={errors["title"]}>
                <input
                  className="field"
                  value={form.title}
                  onChange={(e) => set("title", e.target.value)}
                  placeholder="Murree Group Tour 2026"
                />
              </Field>
              <Field label="Category">
                <div className="grid gap-2 sm:grid-cols-2">
                  {CATEGORIES.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => set("category", c)}
                      className={`rounded-xl border px-3 py-2.5 text-left text-xs font-semibold transition-colors ${
                        form.category === c
                          ? "border-primary bg-accent text-accent-foreground"
                          : "border-border bg-card text-muted-foreground hover:border-primary/50"
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </Field>
              <Field label="Short description" error={errors["description"]}>
                <textarea
                  className="field min-h-24 text-sm"
                  value={form.description}
                  onChange={(e) => set("description", e.target.value)}
                  placeholder="What the money covers and by when it's needed."
                />
              </Field>
            </>
          ) : null}

          {step === 1 ? (
            <>
              <Field label="Target amount (PKR)" error={errors["target"]}>
                <input
                  type="number"
                  className="field"
                  value={form.target}
                  onChange={(e) => set("target", Number(e.target.value))}
                />
              </Field>
              <Field label="How should it be split?">
                <div className="grid gap-2 sm:grid-cols-2">
                  {(
                    [
                      ["equal", "Equal shares", "Everyone pays the same amount."],
                      ["open", "Open contribution", "Members give whatever they can."],
                    ] as const
                  ).map(([value, title, copy]) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => set("splitType", value)}
                      className={`rounded-xl border p-3 text-left transition-colors ${
                        form.splitType === value
                          ? "border-primary bg-accent"
                          : "border-border bg-card hover:border-primary/50"
                      }`}
                    >
                      <p className="text-xs font-bold">{title}</p>
                      <p className="mt-0.5 text-[11px] text-muted-foreground">{copy}</p>
                    </button>
                  ))}
                </div>
              </Field>
              {form.splitType === "equal" ? (
                <Field label="Number of shares" error={errors["totalShares"]}>
                  <input
                    type="number"
                    min={1}
                    className="field"
                    value={form.totalShares}
                    onChange={(e) => set("totalShares", Number(e.target.value))}
                  />
                  <p className="mt-1 text-xs text-muted-foreground">
                    That's{" "}
                    <span className="font-bold text-foreground">{formatPKR(shareAmount)}</span> per
                    person.
                  </p>
                </Field>
              ) : null}

              {/* Members to Track */}
              <div className="border-t border-border pt-4 mt-5">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <h3 className="text-xs font-bold flex items-center gap-1.5">
                      <UserPlus className="h-3.5 w-3.5 text-primary" /> Expected Contributors
                      (Optional)
                    </h3>
                    <p className="text-[11px] text-muted-foreground">
                      Pre-add members to send instant WhatsApp reminders.
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => setShowBulkInput(!showBulkInput)}
                      className="text-xs font-semibold text-primary hover:underline flex items-center gap-1 bg-primary/10 px-2 py-1 rounded-lg cursor-pointer"
                    >
                      <ClipboardPaste className="h-3 w-3" /> Bulk
                    </button>
                    <button
                      type="button"
                      onClick={addMemberRow}
                      className="text-xs font-semibold text-primary hover:underline flex items-center gap-1 bg-secondary px-2 py-1 rounded-lg cursor-pointer"
                    >
                      <Plus className="h-3 w-3" /> Add
                    </button>
                  </div>
                </div>

                {showBulkInput && (
                  <div className="mb-3 mt-2 p-2.5 bg-secondary/30 rounded-xl border border-border">
                    <p className="text-xs font-semibold text-foreground mb-1">
                      Paste from WhatsApp (One per line):
                    </p>
                    <p className="text-[11px] text-muted-foreground mb-1.5">
                      Format: <code className="bg-card px-1 py-0.5 rounded">Name, 03001234567</code>
                    </p>
                    <textarea
                      rows={3}
                      className="field font-mono text-xs w-full bg-card"
                      placeholder={"Ali, 03001234567\nHamza, 03217654321"}
                      value={bulkText}
                      onChange={(e) => setBulkText(e.target.value)}
                    />
                    <div className="flex justify-end gap-2 mt-2">
                      <button
                        type="button"
                        onClick={() => setShowBulkInput(false)}
                        className="btn-ghost text-xs py-1 px-2.5"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={handleParseBulk}
                        className="btn-primary text-xs py-1 px-2.5"
                      >
                        Parse Members
                      </button>
                    </div>
                  </div>
                )}

                <div className="space-y-2 mt-2">
                  {members.map((m, idx) => (
                    <div key={idx} className="flex items-center gap-1.5">
                      <input
                        className="field flex-1 text-xs"
                        placeholder="Name (e.g. Fatima)"
                        value={m.name}
                        onChange={(e) => updateMember(idx, "name", e.target.value)}
                      />
                      <input
                        className="field flex-1 text-xs"
                        placeholder="WhatsApp (03001234567)"
                        value={m.phone}
                        onChange={(e) => updateMember(idx, "phone", e.target.value)}
                      />
                      <button
                        type="button"
                        onClick={() => removeMemberRow(idx)}
                        className="p-1.5 text-muted-foreground hover:text-destructive transition-colors cursor-pointer"
                        title="Remove"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ))}
                  {members.length === 0 && !showBulkInput && (
                    <p className="text-[11px] text-muted-foreground bg-secondary/30 p-2.5 rounded-xl border border-dashed border-border text-center">
                      No pre-added members. Anyone with the link can contribute directly.
                    </p>
                  )}
                </div>
              </div>
            </>
          ) : null}

          {step === 2 ? (
            <>
              <Field label="Your name (organiser)" error={errors["adminName"]}>
                <input
                  className="field"
                  value={form.adminName}
                  onChange={(e) => set("adminName", e.target.value)}
                  placeholder="Bilal Ahmed"
                />
              </Field>
              <Field label="Your phone number" error={errors["adminPhone"]}>
                <input
                  className="field"
                  value={form.adminPhone}
                  onChange={(e) => set("adminPhone", e.target.value)}
                  placeholder="03335557788"
                />
              </Field>

              <Field label="4-Digit Organiser Secret PIN" error={errors["adminPin"]}>
                <input
                  type="password"
                  maxLength={4}
                  className="field text-center font-bold tracking-widest text-lg"
                  value={form.adminPin}
                  onChange={(e) => set("adminPin", e.target.value.replace(/\D/g, ""))}
                  placeholder="1234"
                />
                <p className="mt-1 text-[11px] text-muted-foreground">
                  Keep this PIN confidential. Required to access dashboard and verify receipts.
                </p>
              </Field>

              <div className="grid gap-3 sm:grid-cols-[130px_1fr]">
                <Field label="Wallet">
                  <select
                    className="field text-xs sm:text-sm"
                    value={form.walletType}
                    onChange={(e) => set("walletType", e.target.value)}
                  >
                    <option>JazzCash</option>
                    <option>EasyPaisa</option>
                    <option>SadaPay</option>
                    <option>NayaPay</option>
                  </select>
                </Field>
                <Field label="Wallet number" error={errors["wallet"]}>
                  <input
                    className="field text-xs sm:text-sm"
                    value={form.wallet}
                    onChange={(e) => set("wallet", e.target.value)}
                    placeholder="03335557788"
                  />
                </Field>
              </div>
              <div className="grid gap-3 sm:grid-cols-[130px_1fr]">
                <Field label="Bank">
                  <input
                    className="field text-xs sm:text-sm"
                    value={form.bank}
                    onChange={(e) => set("bank", e.target.value)}
                    placeholder="Meezan"
                  />
                </Field>
                <Field label="IBAN">
                  <input
                    className="field text-xs sm:text-sm uppercase"
                    value={form.iban}
                    onChange={(e) => set("iban", e.target.value.toUpperCase())}
                    placeholder="PK36SCBL0000001123456702"
                  />
                </Field>
              </div>
            </>
          ) : null}
        </div>

        {/* Buttons */}
        <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-between">
          <button
            type="button"
            className="btn-ghost text-xs sm:text-sm py-2 px-3"
            disabled={step === 0}
            onClick={() => setStep((s) => Math.max(0, s - 1))}
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Back
          </button>
          {step < 2 ? (
            <button
              type="button"
              className="btn-primary text-xs sm:text-sm py-2 px-4"
              onClick={next}
            >
              Continue <ArrowRight className="h-3.5 w-3.5" />
            </button>
          ) : (
            <button
              type="button"
              className="btn-primary text-xs sm:text-sm py-2 px-4"
              onClick={submit}
            >
              Create pool <Check className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>
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
    <div className="space-y-1">
      <label className="text-xs font-semibold text-foreground">{label}</label>
      {children}
      {error ? <p className="text-[11px] font-medium text-destructive">{error}</p> : null}
    </div>
  );
}
