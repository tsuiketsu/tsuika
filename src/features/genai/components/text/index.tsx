import { AI_FAILED_TEXT } from "./constants";
import instructions from "./instructions.list";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import useGenAI from "@/hooks/use-genai";
import { useMutation } from "@tanstack/react-query";
import type { VariantProps } from "class-variance-authority";
import { LoaderCircle, SparkleIcon } from "lucide-react";

interface PropsType {
  prompt: string;
  variant?: VariantProps<typeof buttonVariants>["variant"];
  className?: string;
  onValueChange?: (value: string) => void;
  onClick?: () => void;
}

export default function AIStreamWriter(props: PropsType) {
  const client = useGenAI();

  const mutation = useMutation({
    mutationKey: ["ai-summarizer"],
    mutationFn: async (prompt: string) => {
      let contents: Array<object | string> = [prompt];

      if (prompt.includes("youtube")) {
        contents = [
          {
            fileData: {
              fileUri: prompt,
              mime: "video/mp4",
            },
          },
          "Write a short and engaging blog post based on this video",
        ];
      }

      try {
        const response = await client.models.generateContentStream({
          model: "gemini-2.5-flash-lite",
          contents,
          config: {
            systemInstruction: instructions.summarizer.directives,
            thinkingConfig: { thinkingBudget: 0 },
            tools: [{ googleSearch: {} }],
            temperature: 0.1,
          },
        });

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
          size="icon"
          isLoading={mutation.isPending}
          customLoader={<LoaderCircle className="animate-spin" />}
          className={props.className}
          onClick={() => {
            props.onClick?.();
            mutation.mutate(props.prompt);
          }}
        >
          <SparkleIcon />
        </Button>
      </TooltipTrigger>
      <TooltipContent>Summarize with AI</TooltipContent>
    </Tooltip>
  );
}
