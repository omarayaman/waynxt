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
        width={720}
        height={240}
        priority
        className="h-48 w-auto object-cover dark:hidden"
      />
      <Image
        src={PUBLIC_ASSETS.icons.fullLogo}
        alt="WAYNX"
        width={180}
        height={60}
        className="hidden object-cover sm:h-12 dark:block"
      />
    </Link>
  );
}
