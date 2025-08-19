import { useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Markdown } from "tiptap-markdown";

export default function useDefaultEditor(id: string, defaultText: string) {
  return useEditor({
    extensions: [
      StarterKit,
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
        class:
          "prose max-w-full text-foreground prose-headings:text-foreground prose-strong:text-foreground prose-blockquote:text-foreground/60 prose-p:text-foreground/80 prose-code:text-foreground prose-code:bg-secondary prose-code:before:content-[''] prose-code:after:content-[''] prose-code:text-secondary-foreground prose-code:font-normal prose-code:px-2",
      },
    },
  });
}
