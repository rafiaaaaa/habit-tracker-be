export type PlanType = "FREE" | "PRO";

type PlanConfig = { habit_limit: number };

export const PLAN_CONFIG: Record<PlanType, PlanConfig> = {
  FREE: {
    habit_limit: 3,
  },
  PRO: {
    habit_limit: Infinity,
  },
} as const;
