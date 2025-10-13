import instructions from "./instructions.list";
import type { Tag } from "@/types/tag";

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
