import Image from "next/image";
import Link from "next/link";
import { business } from "@/config/business";
import { cn } from "@/lib/format";

/** Brand mark from config: the logo image when provided, otherwise a typographic wordmark. */
export function Logo({ className, href = "/" }: { className?: string; href?: string }) {
  const { brand } = business;
  return (
    <Link href={href} className={cn("inline-flex items-center", className)} aria-label={`${brand.name} — home`}>
      {brand.logo ? (
        <Image src={brand.logo} alt="" width={140} height={36} className="h-7 w-auto sm:h-8" priority />
      ) : (
        <span className="text-[15px] font-semibold tracking-[0.22em] whitespace-nowrap uppercase sm:text-base">
          <span className="sm:hidden">{brand.shortName}</span>
          <span className="hidden sm:inline">{brand.name}</span>
        </span>
      )}
    </Link>
  );
}
