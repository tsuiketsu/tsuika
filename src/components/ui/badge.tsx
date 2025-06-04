import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import type React from "react";

const badgetVariants = cva(
  "h-6 px-2 rounded-sm text-xs inline-flex items-center",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground",
        outline: "border",
        secondary: "bg-secondary bg-secondary-foreground",
        info: "bg-info text-info-foreground",
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
    VariantProps<typeof badgetVariants> {}

const Badge = ({ className, variant, ...props }: PropsType) => {
  return (
    <span className={cn(badgetVariants({ variant }), className)} {...props} />
  );
};

export { Badge, badgetVariants as badgeVariant };
