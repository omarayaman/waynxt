import Link from "next/link";
import Image from "next/image";
import { PUBLIC_ASSETS } from "@/lib/public-assets";

export function AuthLogo() {
  return (
    <Link
      href="/"
      className="shrink-0 outline-none focus:outline-none flex items-center"
      aria-label="WAYNX home"
    >
      <Image
        src={PUBLIC_ASSETS.icons.rr}
        alt="WAYNX"
        width={80}
        height={80}
        className="h-12 w-auto object-cover dark:hidden"
      />
      <Image
        src={PUBLIC_ASSETS.icons.fullLogo}
        alt="WAYNX"
        width={180}
        height={60}
        className="hidden h-12 w-auto object-cover dark:block"
      />
    </Link>
  );
}
