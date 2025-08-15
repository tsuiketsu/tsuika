import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import type React from "react";

const badgeVariant = cva(
  "h-6 px-2 rounded-sm text-xs inline-flex items-center",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground",
        secondary: "bg-secondary text-secondary-foreground",
        outline: "border",
        info: "bg-info/20 border-info border-1 text-info",
        destructive: "bg-destructive text-white",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

interface PropsType
  extends React.ComponentProps<"span">,
    VariantProps<typeof badgeVariant> {}

const Badge = ({ className, variant, ...props }: PropsType) => {
  return (
    <span className={cn(badgeVariant({ variant }), className)} {...props} />
  );
};

export { Badge, badgeVariant };
