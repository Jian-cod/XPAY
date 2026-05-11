import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number, currency: string = "KSH"): string {
  if (currency === "KSH") {
    return `KSH ${amount.toLocaleString()}`;
  }
  return `$${amount.toFixed(2)}`;
}

export function calculateWithdrawalFee(amount: number): number {
  return Math.ceil(amount / 9);
}

export function daysBetween(date1: Date, date2: Date): number {
  const oneDay = 24 * 60 * 60 * 1000;
  return Math.round(Math.abs((date1.getTime() - date2.getTime()) / oneDay));
}

export function isWithdrawalEligible(user: any): boolean {
  const requirements = [
    user.account_age_days >= (user.tier === "elite" ? 35 : user.tier === "pro" ? 45 : 60),
    user.tasks_completed >= (user.tier === "elite" ? 75 : user.tier === "pro" ? 100 : 150),
    user.streak_days >= (user.tier === "elite" ? 14 : user.tier === "pro" ? 21 : 30),
    user.approval_rate >= (user.tier === "elite" ? 90 : user.tier === "pro" ? 85 : 80),
    user.points_balance >= (user.tier === "elite" ? 3250 : user.tier === "pro" ? 4500 : 6500),
    user.has_marketplace_purchase,
    user.registration_paid,
  ];
  return requirements.every(Boolean);
}
