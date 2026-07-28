export function getPostAuthRedirect(
  searchParams: Pick<URLSearchParams, "get"> | null
): string {
  let redirect = searchParams?.get("redirect");

  if (redirect) {
    try {
      redirect = decodeURIComponent(redirect);
    } catch {
      // Ignore
    }
  }

  if (redirect && redirect.startsWith("/") && !redirect.startsWith("//")) {
    return redirect;
  }

  return "/planner";
}
