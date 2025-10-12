import { AI_FAILED_TEXT } from "./constants";
import instructions from "./instructions.list";
import type { SystemInstruction } from "./types";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import useGenAI from "@/hooks/use-genai";
import { type GenerateContentParameters } from "@google/genai";
import { useMutation } from "@tanstack/react-query";
import type { VariantProps } from "class-variance-authority";
import { LoaderCircle, SparkleIcon, SparklesIcon } from "lucide-react";

type PromptType = string;

interface PropsType extends Partial<VariantProps<typeof buttonVariants>> {
  prompt: PromptType;
  btnText?: string;
  tooltipTxt?: string;
  className?: string;
  systemInstruction: SystemInstruction;
  enableStreamingMode?: boolean;
  onValueChange?: (value: string) => void;
  onClick?: () => void;
}

export default function AITextWritter(props: PropsType) {
  const client = useGenAI();

  const mutation = useMutation({
    mutationKey: ["ai-summarizer"],
    mutationFn: async (prompt: PromptType) => {
      // GenAI content parameters
      const params: GenerateContentParameters = {
        model: "gemini-2.5-flash-lite",
        contents: prompt,
        config: {
          systemInstruction: instructions[props.systemInstruction],
          thinkingConfig: { thinkingBudget: 0 },
          tools: [{ googleSearch: {} }],
          temperature: 0.1,
        },
      };

      try {
        // Content streaming mode
        if (props.enableStreamingMode) {
          const response = await client.models.generateContentStream(params);

          let responseText = "";

          for await (const chunk of response) {
            if (chunk.text && !chunk.text.includes(AI_FAILED_TEXT)) {
              responseText += chunk.text;
              props.onValueChange?.(responseText);
            } else {
              props.onValueChange?.(AI_FAILED_TEXT);
              break;
            }
          }
        } else {
          // Content sync mode
          const response = await client.models.generateContent(params);
          props.onValueChange?.(response.text ?? AI_FAILED_TEXT);
        }
      } catch (error) {
        props.onValueChange?.(AI_FAILED_TEXT);
        console.error(error);
        return null;
      }
    },
    onSuccess: (text) => {
      if (text) {
        props.onValueChange?.(text);
      }
    },
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
            mutation.mutate(props.prompt);
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
