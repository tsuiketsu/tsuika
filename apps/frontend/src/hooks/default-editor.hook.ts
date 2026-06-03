import { Placeholder } from "@tiptap/extensions";
import type { Transaction } from "@tiptap/pm/state";
import { Editor, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import clsx from "clsx";
import { Markdown } from "tiptap-markdown";

export const markdownStyle = clsx(
  // General
  "prose max-w-full text-foreground text-sm min-h-30 focus:outline-none",

  // Colors
  "prose-headings:text-foreground",
  "prose-strong:text-foreground",
  "prose-blockquote:text-foreground/60",
  "prose-p:text-foreground/80",

  // Code
  "prose-code:text-white/90",
  "prose-code:font-normal",
  "prose-code:px-2",
  "prose-code:before:content-['']",
  "prose-code:after:content-['']",

  // URL
  "prose-a:text-info"
);

export default function useDefaultEditor(
  id: string,
  defaultText: string,
  onUpdate?: (args: {
    editor: Editor;
    transaction: Transaction;
    appendedTransactions: Transaction[];
  }) => void
) {
  const editor = useEditor({
    onUpdate,
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder:
          "This is a placeholder description for Example Website. Replace this with a brief summary of the site's content or purpose.",
      }),
      Markdown.configure({
        html: true,
        tightLists: true,
        bulletListMarker: "-",
        linkify: true,
        breaks: true,
        transformCopiedText: true,
        transformPastedText: true,
      }),
    ],
    content: defaultText,
    editorProps: {
      attributes: {
        id,
        class: markdownStyle,
      },
    },
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const getValue = () => (editor.storage as any).markdown.getMarkdown();

  const onValueChange = (onChange: (value: string) => void) => () => {
    onChange(getValue());
  };

  return { editor, getValue, onValueChange };
}
