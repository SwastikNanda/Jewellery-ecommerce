import Link from "next/link";
import { cn } from "@/lib/utils";

export function Logo({
  className,
  light = false,
}: {
  className?: string;
  light?: boolean;
}) {
  return (
    <Link
      href="/"
      className={cn("group inline-flex flex-col leading-none", className)}
    >
      <span
        className={cn(
          "font-serif text-2xl tracking-[0.2em]",
          light ? "text-ivory" : "text-charcoal",
        )}
      >
        AURELLE
      </span>
      <span
        className={cn(
          "mt-0.5 text-[0.6rem] tracking-[0.35em] uppercase",
          light ? "text-ivory/70" : "text-stone",
        )}
      >
        Fine Jewellery
      </span>
    </Link>
  );
}
