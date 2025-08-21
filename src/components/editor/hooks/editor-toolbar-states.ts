import { Editor, useEditorState } from "@tiptap/react";

const useEditorToolbarStates = (editor: Editor) => {
  return useEditorState({
    editor,
    selector: (context) => {
      const e = context.editor;

      return {
        // HEADING
        isHeading1: e.isActive("heading", { level: 1 }) ?? false,
        isHeading2: e.isActive("heading", { level: 2 }) ?? false,
        isHeading3: e.isActive("heading", { level: 3 }) ?? false,
        isHeading4: e.isActive("heading", { level: 4 }) ?? false,
        isHeading5: e.isActive("heading", { level: 5 }) ?? false,
        isHeading6: e.isActive("heading", { level: 6 }) ?? false,
        headingLevel: e.getAttributes("heading").level,

        // FORMATTING
        isBold: e.isActive("bold") ?? false,
        canBold: e.can().chain().toggleBold().run() ?? false,
        isItalic: e.isActive("italic") ?? false,
        canItalic: e.can().chain().toggleItalic().run() ?? false,
        isStrike: e.isActive("strike") ?? false,
        canStrike: e.can().chain().toggleStrike().run() ?? false,

        // CODE & CODE-BLOCK
        isCode: e.isActive("code") ?? false,
        canCode: e.can().chain().toggleCode().run() ?? false,
        isCodeBlock: e.isActive("codeBlock") ?? false,

        // LIST & ALIGNMENTS
        canClearMarks: e.can().chain().unsetAllMarks().run() ?? false,
        isParagraph: e.isActive("paragraph") ?? false,
        isBulletList: e.isActive("bulletList") ?? false,
        isOrderedList: e.isActive("orderedList") ?? false,
        isBlockquote: e.isActive("blockquote") ?? false,

        // ACTIONS
        canUndo: e.can().chain().undo().run() ?? false,
        canRedo: e.can().chain().redo().run() ?? false,
      };
    },
  });
};

export default useEditorToolbarStates;
