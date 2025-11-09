import type { AITextWriterProps } from "./types";
import { options } from "@/constants";
import { lazy, Suspense } from "react";

const Component = lazy(() => import("./ai-text-writer"));

export default function AITextWriter(props: AITextWriterProps) {
  return <Suspense>{options.genaiApiKey && <Component {...props} />}</Suspense>;
}
