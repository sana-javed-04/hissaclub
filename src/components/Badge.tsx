import type { ClaimStatus } from "@/data/mockData";

const styles: Record<ClaimStatus, string> = {
  verified: "bg-accent text-accent-foreground",
  pending: "bg-amber-soft text-amber-ink",
  rejected: "bg-destructive/12 text-destructive",
};

const labels: Record<ClaimStatus, string> = {
  verified: "Verified",
  pending: "Pending",
  rejected: "Rejected",
};

export function StatusBadge({ status }: { status: ClaimStatus }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${styles[status]}`}
    >
      {labels[status]}
    </span>
  );
}
