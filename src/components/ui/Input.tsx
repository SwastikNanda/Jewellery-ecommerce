import * as React from "react";
import { cn } from "@/lib/utils";

export const Input = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, ...props }, ref) => (
  <input
    ref={ref}
    className={cn(
      "h-11 w-full rounded-xl border border-line bg-white/70 px-4 text-sm text-charcoal placeholder:text-stone/60 transition focus:border-champagne focus:outline-none focus:ring-2 focus:ring-champagne/30",
      className,
    )}
    {...props}
  />
));
Input.displayName = "Input";

export const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, ...props }, ref) => (
  <textarea
    ref={ref}
    className={cn(
      "w-full rounded-xl border border-line bg-white/70 px-4 py-3 text-sm text-charcoal placeholder:text-stone/60 transition focus:border-champagne focus:outline-none focus:ring-2 focus:ring-champagne/30",
      className,
    )}
    {...props}
  />
));
Textarea.displayName = "Textarea";

export const Label = ({
  className,
  ...props
}: React.LabelHTMLAttributes<HTMLLabelElement>) => (
  <label
    className={cn(
      "mb-1.5 block text-xs font-medium uppercase tracking-wider text-stone",
      className,
    )}
    {...props}
  />
);
