"use client";

import { useEffect, useSyncExternalStore } from "react";
import type { ApplicationDraft } from "./types";

const STORAGE_KEY = "gks-for-u:draft:v1";

function emptyDraft(): ApplicationDraft {
  return {
    id: crypto.randomUUID(),
    cycle: 2026,
    updatedAt: new Date().toISOString(),
    profile: {},
    education: {},
    languages: { topikLevel: 0 },
    universities: { choices: [{}, {}, {}] },
    essays: { personalStatement: "", studyPlan: "", recommendation: "" },
    flags: {},
  };
}

let memo: ApplicationDraft | null = null;
let serverSnapshot: ApplicationDraft | null = null;
const listeners = new Set<() => void>();

function getServerSnapshot(): ApplicationDraft {
  if (!serverSnapshot) serverSnapshot = emptyDraft();
  return serverSnapshot;
}

function load(): ApplicationDraft {
  if (memo) return memo;
  if (typeof window === "undefined") {
    memo = emptyDraft();
    return memo;
  }
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    memo = raw ? (JSON.parse(raw) as ApplicationDraft) : emptyDraft();
  } catch {
    memo = emptyDraft();
  }
  return memo!;
}

function persist(d: ApplicationDraft) {
  memo = { ...d, updatedAt: new Date().toISOString() };
  if (typeof window !== "undefined") {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(memo));
  }
  listeners.forEach((l) => l());
}

export function getDraft(): ApplicationDraft {
  return load();
}

export function updateDraft(updater: (d: ApplicationDraft) => ApplicationDraft) {
  persist(updater(load()));
}

export function patchSection<K extends keyof ApplicationDraft>(
  section: K,
  patch: Partial<ApplicationDraft[K]>,
) {
  updateDraft((d) => {
    const current = d[section] as Record<string, unknown>;
    return { ...d, [section]: { ...current, ...patch } } as ApplicationDraft;
  });
}

export function resetDraft() {
  persist(emptyDraft());
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  return () => listeners.delete(cb);
}

export function useDraft(): ApplicationDraft {
  const draft = useSyncExternalStore(subscribe, load, getServerSnapshot);
  // Hydrate from localStorage on mount (SSR-safe)
  useEffect(() => {
    if (typeof window !== "undefined") {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        memo = JSON.parse(raw) as ApplicationDraft;
        listeners.forEach((l) => l());
      }
    }
  }, []);
  return draft;
}
