import type { AITextWritterProps } from "./types";
import { options } from "@/constants";
import { lazy, Suspense } from "react";

const Component = lazy(() => import("./ai-text-writter"));

export default function AITextWritter(props: AITextWritterProps) {
  return <Suspense>{options.genaiApiKey && <Component {...props} />}</Suspense>;
}
