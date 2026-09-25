import { useSyncExternalStore } from "react";
import { createClient } from "@supabase/supabase-js";
import { seedPools, type Claim, type Pool } from "@/data/mockData";

const SUPABASE_URL =
  (import.meta.env["VITE_SUPABASE_URL"] as string) || "https://wkitxfkzqhawbypcdotp.supabase.co";

const SUPABASE_ANON_KEY = (import.meta.env["VITE_SUPABASE_ANON_KEY"] as string) || "";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const KEY = "hissaclub.pools.v1";
let pools: Pool[] = seedPools;
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((l) => l());
}

// 1. Initial Load & Cloud Sync
async function initStore() {
  // Pehle localStorage se instant render
  if (typeof window !== "undefined") {
    try {
      const raw = window.localStorage.getItem(KEY);
      if (raw) pools = JSON.parse(raw);
    } catch (e) {
      /* ignore */
    }
    emit();
  }

  // Phir Cloud Database se latest data fetch
  try {
    const { data, error } = await supabase.from("pools").select("data");
    if (!error && data && data.length > 0) {
      const cloudPools = data.map((row: { data: Pool }) => row.data);
      pools = cloudPools;
      if (typeof window !== "undefined") {
        window.localStorage.setItem(KEY, JSON.stringify(pools));
      }
      emit();
    }
  } catch (err) {
    console.warn("Using offline data:", err);
  }
}

initStore();

function subscribe(cb: () => void) {
  listeners.add(cb);
  return () => listeners.delete(cb);
}

export function usePools(): Pool[] {
  return useSyncExternalStore(
    subscribe,
    () => pools,
    () => seedPools,
  );
}

export function usePool(id: string): Pool | undefined {
  return usePools().find((p) => p.id === id);
}

// 2. Cloud par Save & Update
async function syncPoolToCloud(pool: Pool) {
  try {
    await supabase.from("pools").upsert({ id: pool.id, data: pool });
  } catch (err) {
    console.error("Cloud sync failed:", err);
  }
}

export function slugify(title: string) {
  const base =
    title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 28) || "pool";
  return `${base}-${Math.random().toString(36).slice(2, 6)}`;
}

export function createPool(pool: Pool) {
  pools = [pool, ...pools];
  if (typeof window !== "undefined") {
    window.localStorage.setItem(KEY, JSON.stringify(pools));
  }
  emit();
  syncPoolToCloud(pool);
}

export function addClaim(poolId: string, claim: Claim) {
  pools = pools.map((p) => {
    if (p.id === poolId) {
      const existsIndex = p.claims.findIndex(
        (c) => c.id === claim.id || (c.phone === claim.phone && c.status === "pending"),
      );

      let updatedClaims: Claim[];
      if (existsIndex >= 0) {
        updatedClaims = p.claims.map((c, idx) => (idx === existsIndex ? claim : c));
      } else {
        updatedClaims = [...p.claims, claim];
      }

      const updated = { ...p, claims: updatedClaims };
      syncPoolToCloud(updated);
      return updated;
    }
    return p;
  });

  if (typeof window !== "undefined") {
    window.localStorage.setItem(KEY, JSON.stringify(pools));
  }
  emit();
}

export function setClaimStatus(poolId: string, claimId: string, status: Claim["status"]) {
  pools = pools.map((p) => {
    if (p.id === poolId) {
      const updated = {
        ...p,
        claims: p.claims.map((c) => (c.id === claimId ? { ...c, status } : c)),
      };
      syncPoolToCloud(updated);
      return updated;
    }
    return p;
  });
  if (typeof window !== "undefined") {
    window.localStorage.setItem(KEY, JSON.stringify(pools));
  }
  emit();
}

export function collected(pool: Pool) {
  return pool.claims.filter((c) => c.status === "verified").reduce((s, c) => s + c.amount, 0);
}

export function pendingTotal(pool: Pool) {
  return pool.claims.filter((c) => c.status === "pending").reduce((s, c) => s + c.amount, 0);
}

export function formatPKR(n: number) {
  return `Rs. ${n.toLocaleString("en-PK")}`;
}

// Banane wale ke pools track karne ke liye
const MY_POOLS_KEY = "hissaclub_created_pools";

export function saveCreatedPoolId(poolId: string) {
  if (typeof window === "undefined") return;
  try {
    const existing: string[] = JSON.parse(window.localStorage.getItem(MY_POOLS_KEY) || "[]");
    if (!existing.includes(poolId)) {
      existing.unshift(poolId);
      window.localStorage.setItem(MY_POOLS_KEY, JSON.stringify(existing));
    }
  } catch (e) {
    /* ignore */
  }
}

export function getMyPoolIds(): string[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(window.localStorage.getItem(MY_POOLS_KEY) || "[]");
  } catch (e) {
    return [];
  }
}
