import Link from "next/link";
import Image from "next/image";
import { PUBLIC_ASSETS } from "@/lib/public-assets";

export function AuthLogo() {
  return (
    <Link
      href="/"
      className="shrink-0 outline-none focus:outline-none flex items-center gap-2 mt-1"
      aria-label="WAYNX home"
    >
      <Image
        src={PUBLIC_ASSETS.icons.logoLight}
        alt="WAYNX"
        width={740}
        height={235}
        priority
        className="h-8 sm:h-10 w-auto object-contain dark:hidden"
      />
      <Image
        src={PUBLIC_ASSETS.icons.fullLogo}
        alt="WAYNX"
        width={740}
        height={235}
        className="hidden h-8 sm:h-10 w-auto object-contain dark:block"
      />
    </Link>
  );
}
