import { cn } from "@/lib/utils";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import type React from "react";

const layoutVariants = {
  grid: "grid w-full auto-rows-min gap-4 @xl/dash:grid-cols-2 @5xl/dash:grid-cols-3 @7xl/dash:grid-cols-4",
  masonry:
    "space-y-4 @xl/dash:columns-2 @5xl/dash:columns-3 @7xl/dash:columns-4",
  compact:
    "grid w-full auto-rows-min gap-2 @2xl/dash:grid-cols-2 @5xl/dash:grid-cols-3 @6xl/dash:grid-cols-3",
} as const;

const cardsLayoutVariant = cva("", {
  variants: {
    layout: layoutVariants,
  },
  defaultVariants: {
    layout: "grid",
  },
});

function CardsLayout({
  className,
  layout,
  asChild = false,
  ...props
}: React.ComponentProps<"div"> &
  VariantProps<typeof cardsLayoutVariant> & {
    asChild?: boolean;
    isLoading?: boolean;
  }) {
  const Comp = asChild ? Slot : "div";
  return (
    <Comp
      className={cn(cardsLayoutVariant({ layout, className }))}
      {...props}
    />
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export { CardsLayout, layoutVariants, cardsLayoutVariant };
