import { cn } from "@/lib/cn";

type Tone = "neutral" | "live" | "win" | "loss" | "pending";

const TONES: Record<Tone, string> = {
  neutral: "bg-cookie-dough text-choc-chip",
  live: "bg-berry-loss/15 text-berry-loss",
  win: "bg-mint-win/15 text-mint-win",
  loss: "bg-berry-loss/15 text-berry-loss",
  pending: "bg-caramel/20 text-choc-chip",
};

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  tone?: Tone;
}

export function Badge({ tone = "neutral", className, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold",
        TONES[tone],
        className,
      )}
      {...props}
    />
  );
}
