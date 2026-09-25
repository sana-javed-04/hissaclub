import { createFileRoute, Link } from "@tanstack/react-router";
import { Plus, Wallet, ArrowRight, ShieldCheck, Clock } from "lucide-react";
import { usePools, getMyPoolIds, formatPKR, collected } from "@/lib/poolStore";
import { ProgressBar } from "@/components/ProgressBar";

export const Route = createFileRoute("/my-pools")({
  component: MyPoolsPage,
});

function MyPoolsPage() {
  const allPools = usePools();
  const myIds = getMyPoolIds();

  // Sirf wahi pools jo is device par banaye gaye hain
  const myPools = allPools.filter((p) => myIds.includes(p.id));

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-14">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Pools</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage the expense and milestone pools created by you.
          </p>
        </div>
        <Link to="/create" className="btn-primary">
          <Plus className="h-4 w-4" /> Start New Pool
        </Link>
      </div>

      {myPools.length === 0 ? (
        <div className="card-surface mt-10 p-12 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <Wallet className="h-7 w-7" />
          </div>
          <h3 className="mt-4 text-xl font-bold">No pools created yet</h3>
          <p className="mt-1 text-sm text-muted-foreground max-w-md mx-auto">
            You haven't launched any pooling fund from this browser. Start a pool for family, trips,
            or flat expenses.
          </p>
          <Link to="/create" className="btn-primary mt-6 inline-flex">
            Create Your First Pool
          </Link>
        </div>
      ) : (
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {myPools.map((pool) => {
            const raised = collected(pool);
            const pendingCount = pool.claims.filter((c) => c.status === "pending").length;

            return (
              <div
                key={pool.id}
                className="card-surface p-6 flex flex-col justify-between hover:shadow-lift transition-shadow"
              >
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="rounded-full bg-accent px-2.5 py-0.5 text-xs font-semibold text-accent-foreground">
                      {pool.category}
                    </span>
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Clock className="h-3 w-3" /> {pool.createdAt}
                    </span>
                  </div>

                  <h3 className="mt-3 text-lg font-bold truncate">{pool.title}</h3>
                  <p className="mt-1 text-xs text-muted-foreground line-clamp-2">
                    {pool.description}
                  </p>

                  <div className="mt-5 space-y-2">
                    <div className="flex justify-between text-xs font-semibold">
                      <span className="text-muted-foreground">Collected</span>
                      <span className="brand-text">
                        {formatPKR(raised)} / {formatPKR(pool.target)}
                      </span>
                    </div>
                    <ProgressBar value={raised} target={pool.target} />
                  </div>

                  {pendingCount > 0 && (
                    <div className="mt-3 rounded-lg bg-amber-soft px-2.5 py-1 text-xs font-medium text-amber-ink">
                      ⚡ {pendingCount} claims awaiting approval
                    </div>
                  )}
                </div>

                <div className="mt-6 pt-4 border-t border-border flex items-center justify-between gap-2">
                  <Link
                    to="/pool/$id"
                    params={{ id: pool.id }}
                    className="btn-ghost text-xs py-2 px-3 flex-1 text-center"
                  >
                    Public Link
                  </Link>
                  <Link
                    to="/pool/$id/admin"
                    params={{ id: pool.id }}
                    className="btn-primary text-xs py-2 px-3 flex-1 text-center flex items-center justify-center gap-1"
                  >
                    <ShieldCheck className="h-3.5 w-3.5" /> Dashboard
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
