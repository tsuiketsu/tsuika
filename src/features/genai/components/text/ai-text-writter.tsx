import { AI_FAILED_TEXT } from "./constants";
import instructions from "./instructions.list";
import type { AITextWritterProps } from "./types";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import useGenAI from "@/hooks/use-genai";
import { ApiError, type GenerateContentParameters } from "@google/genai";
import { useMutation } from "@tanstack/react-query";
import { LoaderCircle, SparkleIcon, SparklesIcon } from "lucide-react";
import { useCallback } from "react";
import { toast } from "sonner";

export default function AITextWritterComponent({
  systemInstruction,
  prompt,
  onValueChange,
  enableStreamingMode,
  ...props
}: AITextWritterProps) {
  const client = useGenAI();

  const generateTextHandler = useCallback(async () => {
    let finalPrompt = "";

    switch (systemInstruction) {
      case "metadata_tagger":
        finalPrompt = JSON.stringify(prompt);
        break;
      case "content_descriptor":
        finalPrompt = prompt.join(", ");
        break;
      case "summarizer":
        finalPrompt = prompt;
        break;
    }

    // GenAI content parameters
    const params: GenerateContentParameters = {
      model: "gemini-2.5-flash-lite",
      contents: finalPrompt,
      config: {
        systemInstruction: instructions[systemInstruction],
        thinkingConfig: { thinkingBudget: 0 },
        tools: [{ googleSearch: {} }],
        temperature: 0.1,
      },
    };

    try {
      // Content streaming mode
      if (enableStreamingMode) {
        const response = await client.models.generateContentStream(params);

        let responseText = "";

        for await (const chunk of response) {
          if (chunk.text && !chunk.text.includes(AI_FAILED_TEXT)) {
            responseText += chunk.text;
            onValueChange?.(responseText);
          } else {
            onValueChange?.(AI_FAILED_TEXT);
            break;
          }
        }
      } else {
        // Content sync mode
        const response = await client.models.generateContent(params);
        onValueChange?.(response.text ?? AI_FAILED_TEXT);
      }
    } catch (error) {
      console.error(error);

      if (!error) return null;

      const parsed = JSON.parse((error as Error).message)?.error as ApiError;

      if (parsed.status.toString() === "INVALID_ARGUMENT") {
        toast.error(parsed.message);
      }

      return null;
    }
  }, [
    systemInstruction,
    prompt,
    enableStreamingMode,
    client.models,
    onValueChange,
  ]);

  const mutation = useMutation({
    mutationKey: ["ai-text-generation"],
    mutationFn: generateTextHandler,
  });

  return (
    <Tooltip delayDuration={700}>
      <TooltipTrigger asChild>
        <Button
          variant={props.variant}
          size={props.size ?? "icon"}
          isLoading={mutation.isPending}
          customLoader={<LoaderCircle className="animate-spin" />}
          className={props.className}
          onClick={() => {
            props.onClick?.();
            mutation.mutate();
          }}
        >
          {props.btnText && props.btnText?.trim() !== "" ? (
            <SparklesIcon />
          ) : (
            <SparkleIcon />
          )}{" "}
          {props.btnText}
        </Button>
      </TooltipTrigger>
      <TooltipContent>{props.tooltipTxt || "Generate with AI"}</TooltipContent>
    </Tooltip>
  );
}
