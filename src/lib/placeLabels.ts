const BUDGET_LABELS: Record<string, string> = {
  low: "Budget-friendly",
  medium: "Moderate",
  high: "Premium",
};

const SEASON_LABELS: Record<string, string> = {
  winter: "Winter",
  spring: "Spring",
  summer: "Summer",
  autumn: "Autumn",
  fall: "Autumn",
};

const CROWD_LABELS: Record<string, string> = {
  quiet: "Quiet",
  moderate: "Moderate",
  crowded: "Crowded",
};

const SUITABLE_FOR_LABELS: Record<string, string> = {
  family: "Family",
  couple: "Couples",
  solo: "Solo travelers",
  friends: "Friends",
};

const SUITABLE_AGE_LABELS: Record<string, string> = {
  kid: "Kids",
  teen: "Teens",
  adult: "Adults",
  senior: "Seniors",
};

export function formatPlaceLabel(
  value: string,
  labels: Record<string, string>
): string {
  return labels[value.trim().toLowerCase()] ?? value.trim();
}

export function parseCommaTags(value?: string): string[] {
  if (!value) return [];
  return value.split(",").map((tag) => tag.trim()).filter(Boolean);
}

export function formatBudget(value: string): string {
  return formatPlaceLabel(value, BUDGET_LABELS);
}

export function formatSeason(value: string): string {
  return formatPlaceLabel(value, SEASON_LABELS);
}

export function formatCrowd(value: string): string {
  return formatPlaceLabel(value, CROWD_LABELS);
}

export function formatSuitableFor(value: string): string {
  return formatPlaceLabel(value, SUITABLE_FOR_LABELS);
}

export function formatSuitableAge(value: string): string {
  return formatPlaceLabel(value, SUITABLE_AGE_LABELS);
}

export function formatRelativeDate(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays <= 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
  return `${Math.floor(diffDays / 365)} years ago`;
}
