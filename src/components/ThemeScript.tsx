import { bootCriticalCss, themeInitScript } from "@/lib/theme";

export function ThemeScript() {
  return (
    <>
      <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      <style dangerouslySetInnerHTML={{ __html: bootCriticalCss }} />
    </>
  );
}
