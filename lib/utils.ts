import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

export function calculatePercentage(value: number): string {
  return `${Math.round(value * 100)}%`;
}

export function priorityColor(priority: string): string {
  const colors: Record<string, string> = {
    low: 'text-blue-600',
    medium: 'text-yellow-600',
    high: 'text-orange-600',
    critical: 'text-red-600',
  };
  return colors[priority] || 'text-gray-600';
}

export function scoreColor(score: number): string {
  if (score >= 0.8) return 'text-green-600';
  if (score >= 0.6) return 'text-blue-600';
  if (score >= 0.4) return 'text-yellow-600';
  return 'text-gray-600';
}

export function strengthBadge(strength: string): string {
  const badges: Record<string, string> = {
    weak: 'bg-gray-100 text-gray-700',
    moderate: 'bg-blue-100 text-blue-700',
    strong: 'bg-green-100 text-green-700',
    excellent: 'bg-purple-100 text-purple-700',
  };
  return badges[strength] || 'bg-gray-100 text-gray-700';
}
