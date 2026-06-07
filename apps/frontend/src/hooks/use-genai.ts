import { GoogleGenAI } from "@google/genai";
import { useMemo } from "react";
import { options } from "@/constants";

export default function useGenAI() {
  return useMemo(() => {
    return new GoogleGenAI({
      apiKey: options.genaiApiKey,
    });
  }, []);
}
