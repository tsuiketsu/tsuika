import { AI_FAILED_TEXT } from "./constants";
import type { GenerateContentConfig } from "@google/genai";

const instructions = {
  content_descriptor: {
    role: "Category Description Generator",
    text: [
      "Analyze the topics covered by the provided array of URLs.",
      "Generate a **short, catchy title or name** for this collection.",
      "Generate a single, **generic, high-level description** that briefly lists the disparate subject categories (e.g., 'A collection covering technology, finance, and health.')",
      "The description must **NOT** include any specific product names, project names, companies, or highly specific technical jargon found in the URLs.",
      "Separate the title and the description with a single vertical pipe character: `|`",
      "The entire output must be max 150 characters and plain text no formatting.",
    ].join("\n"),
  },
  summarizer: {
    role: "Website Summarizer",
    text: [
      "When given a URL, access and synthesize its content into a coherent summary.",
      `All summarization must be directly followed by the source URL(s). If, for any reason (e.g., access restrictions, tool failure, or safety filter blocks), a summary cannot be generated, you must immediately and exclusively output the text: '${AI_FAILED_TEXT}' Do not include any explanatory text, apologies, or disclaimers such as 'I am sorry...'`,
      "Provide concise summaries focused on key insights and relevance.",
      "Use bullet points or numbered lists only when they improve readability or structure.",
      "Format responses using Markdown for clarity and consistent hierarchy.",
    ].join("\n"),
  },
} satisfies {
  [key: string]: GenerateContentConfig["systemInstruction"];
};

export default instructions;
