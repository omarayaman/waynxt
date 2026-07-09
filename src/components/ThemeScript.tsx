import { THEME_STORAGE_KEY } from "@/store/useThemeStore";

export function ThemeScript() {
  const script = `
    (function () {
      try {
        var stored = localStorage.getItem("${THEME_STORAGE_KEY}");
        var theme = stored ? JSON.parse(stored).state.theme : "dark";
        var resolved =
          theme === "light"
            ? "light"
            : theme === "dark"
              ? "dark"
              : window.matchMedia("(prefers-color-scheme: dark)").matches
                ? "dark"
                : "light";
        document.documentElement.classList.toggle("dark", resolved === "dark");
        document.documentElement.style.colorScheme = resolved;
      } catch (e) {
        document.documentElement.classList.add("dark");
        document.documentElement.style.colorScheme = "dark";
      }
    })();
  `;

  return <script dangerouslySetInnerHTML={{ __html: script }} />;
}
