import { PlugZap } from "lucide-react";

import { cn } from "@/lib/utils";

interface Props {
  tone: number;
  label?: string;
  className?: string;
}

export function ListingPhoto({ tone, label, className }: Props) {
  return (
    <div
      aria-hidden
      className={cn("relative grid place-items-center overflow-hidden", className)}
      style={{ background: `linear-gradient(150deg, hsl(${tone} 45% 90%), hsl(${tone} 38% 74%))` }}
    >
      <svg className="absolute inset-0 size-full opacity-40" viewBox="0 0 400 300" preserveAspectRatio="none" fill="none" stroke={`hsl(${tone} 40% 60%)`} strokeWidth="1">
        <path d="M-20 240 C 80 200, 120 260, 220 220 S 380 180, 420 230" />
        <path d="M-20 270 C 90 230, 140 290, 240 250 S 390 210, 420 260" />
        <path d="M-20 60 C 60 90, 140 30, 230 70 S 360 100, 420 50" />
      </svg>
      <span className="relative grid size-12 place-items-center rounded-full bg-white/75 text-foreground/70 backdrop-blur-sm">
        <PlugZap className="size-5" strokeWidth={1.75} />
      </span>
      {label && (
        <span className="absolute bottom-3 right-3 rounded-md bg-white/85 px-2 py-0.5 text-xs font-semibold text-foreground tabular">{label}</span>
      )}
    </div>
  );
}
