import { Button } from "./ui/button";
import type { ErrorComponentProps } from "@tanstack/react-router";

export default function ErrorComponent(props: ErrorComponentProps) {
  return (
    <div className="bg-background fixed inset-0 z-50 flex items-center justify-center gap-4">
      <div className="mx-auto flex max-w-md flex-col items-center gap-6 px-4 text-center sm:px-0">
        <div className="flex flex-col items-center gap-2">
          <span className="text-5xl">😅</span>
          <span className="text-5xl font-extrabold">Oops!</span>
        </div>
        <div className="space-y-2">
          <h2 className="text-sm font-bold">
            Looks like something didn&apos;t go as planned
          </h2>
          <p className="text-muted-foreground px-4 font-medium">
            Error message: {props.error?.message}
          </p>
        </div>
        <Button className="mx-auto min-w-28 self-start" onClick={props.reset}>
          Reload
        </Button>
      </div>
    </div>
  );
}
