import { lazy, Suspense } from "react";
import { options } from "@/constants";
import type { AITextWriterProps } from "./types";

const Component = lazy(() => import("./ai-text-writer"));

export default function AITextWriter(props: AITextWriterProps) {
  return <Suspense>{options.genaiApiKey && <Component {...props} />}</Suspense>;
}
