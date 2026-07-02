export function buildPlaceAskPrompt({
  name,
  city,
}: {
  name: string;
  city: string;
}): string {
  return `Tell me about ${name} in ${city}. What are the highlights, best time to visit, and practical tips I should know before going?`;
}

export function buildPlaceAskUrl({
  name,
  city,
}: {
  name: string;
  city: string;
}): string {
  return `/ask-waynx?q=${encodeURIComponent(buildPlaceAskPrompt({ name, city }))}`;
}
