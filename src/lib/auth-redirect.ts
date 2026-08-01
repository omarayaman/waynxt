export function getPostAuthRedirect(
  searchParams: Pick<URLSearchParams, "get"> | null
): string {
  const redirect = searchParams?.get("redirect");

  if (redirect && redirect.startsWith("/") && !redirect.startsWith("//")) {
    return redirect;
  }

  return "/planner";
}
