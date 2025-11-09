import instructions from "./instructions.list";
import type { buttonVariants } from "@/components/ui/button";
import type { Tag } from "@/types/tag";
import type { VariantProps } from "class-variance-authority";

export type SystemInstruction = keyof typeof instructions;

export type InstructionPayload =
  | {
      systemInstruction: "content_descriptor";
      prompt: string[];
    }
  | {
      systemInstruction: "summarizer";
      prompt: string;
    }
  | {
      systemInstruction: "metadata_tagger";
      prompt: {
        query: string;
        tags: {
          tag_id: Tag["id"];
          tag_name: Tag["name"];
        }[];
      };
    };

export type AITextWriterProps = InstructionPayload &
  Partial<VariantProps<typeof buttonVariants>> & {
    btnText?: string;
    tooltipTxt?: string;
    className?: string;
    enableStreamingMode?: boolean;
    onValueChange?: (value: string) => void;
    onClick?: () => void;
  };
