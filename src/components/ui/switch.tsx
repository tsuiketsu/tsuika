import { cn } from "@/lib/utils";
import * as SwitchPrimitive from "@radix-ui/react-switch";
import { LoaderCircle } from "lucide-react";
import * as React from "react";

function Switch({
  isLoading,
  className,
  ...props
}: React.ComponentProps<typeof SwitchPrimitive.Root> & {
  isLoading?: boolean;
}) {
  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      className={cn(
        "peer data-[state=checked]:bg-primary data-[state=unchecked]:bg-input focus-visible:border-ring focus-visible:ring-ring/50 dark:data-[state=unchecked]:bg-input/80 inline-flex h-[1.4rem] w-[2.54rem] shrink-0 items-center rounded-full border border-transparent shadow-xs transition-all outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        data-slot="switch-thumb"
        className={cn(
          "bg-background dark:data-[state=unchecked]:bg-foreground dark:data-[state=checked]:bg-primary-foreground pointer-events-none flex size-5 items-center justify-center rounded-full ring-0 transition-transform data-[state=checked]:translate-x-[calc(100%-2px)] data-[state=unchecked]:translate-x-0"
        )}
      >
        <LoaderCircle
          className={cn("size-4 animate-spin text-white mix-blend-exclusion", {
            hidden: !isLoading,
          })}
        />
      </SwitchPrimitive.Thumb>
    </SwitchPrimitive.Root>
  );
}

export { Switch };
