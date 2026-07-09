import Link from "next/link";
import Image from "next/image";

export function AuthLogo() {
  return (
    <Link
      href="/"
      className="shrink-0 outline-none focus:outline-none"
      aria-label="WAYNX home"
    >
      <Image
        src="/icons/full_Logo.svg"
        alt="WAYNX"
        width={180}
        height={60}
        className="hidde object-cover sm:h-12 dark:block"
      />
    </Link>
  );
}
