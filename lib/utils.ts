import { type ClassValue, clsx } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function formatDeadline(deadline: string | null): string {
  if (!deadline) return 'No deadline';
  
  const date = new Date(deadline);
  const now = new Date();
  const diff = date.getTime() - now.getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  
  if (diff < 0) {
    return 'Past due';
  } else if (days === 0) {
    return `${hours}h remaining`;
  } else if (days === 1) {
    return '1 day';
  } else {
    return `${days} days`;
  }
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit'
  });
}

export function getStatusColor(status: string): string {
  switch (status) {
    case 'open':
      return 'bg-blue-100 text-blue-800';
    case 'watch':
      return 'bg-yellow-100 text-yellow-800';
    case 'responding':
      return 'bg-green-100 text-green-800';
    case 'closed':
      return 'bg-gray-100 text-gray-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
}

export function getScoreColor(score: number): string {
  if (score >= 80) return 'text-green-600 font-semibold';
  if (score >= 60) return 'text-blue-600 font-semibold';
  if (score >= 40) return 'text-yellow-600';
  return 'text-gray-500';
}

export function getScoreBadgeColor(score: number): string {
  if (score >= 80) return 'bg-green-100 text-green-800';
  if (score >= 60) return 'bg-blue-100 text-blue-800';
  if (score >= 40) return 'bg-yellow-100 text-yellow-800';
  return 'bg-gray-100 text-gray-600';
}
