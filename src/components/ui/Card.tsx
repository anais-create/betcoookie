import { cn } from "@/lib/cn";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  as?: React.ElementType;
}

export function Card({ className, as: Tag = "div", ...props }: CardProps) {
  return (
    <Tag
      className={cn(
        "rounded-3xl border border-cookie-base/25 bg-cream/90 backdrop-blur-sm shadow-soft",
        className,
      )}
      {...props}
    />
  );
}
