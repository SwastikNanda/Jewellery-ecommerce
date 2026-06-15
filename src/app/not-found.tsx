import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-ivory px-6 text-center">
      <p className="text-xs uppercase tracking-[0.3em] text-champagne-dark">
        Error 404
      </p>
      <h1 className="mt-4 font-serif text-5xl text-charcoal">
        This page has slipped away
      </h1>
      <p className="mt-4 max-w-md text-stone">
        The piece you&apos;re looking for may have been moved or is no longer
        available.
      </p>
      <Button asChild variant="primary" size="lg" className="mt-8">
        <Link href="/">Return home</Link>
      </Button>
    </div>
  );
}
