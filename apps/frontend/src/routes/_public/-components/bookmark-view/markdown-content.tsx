import { markdownStyle } from "@/hooks/default-editor.hook";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Markdown } from "tiptap-markdown";

export default function MarkdownContent({ content }: { content: string }) {
  const editor = useEditor({
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
    editable: false,
    content: content,
    editorProps: {
      attributes: {
        id: "bookmark-description-preview",
        class: markdownStyle,
      },
    },
  });

  return <EditorContent editor={editor} />;
}
