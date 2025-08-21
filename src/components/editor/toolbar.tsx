import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuItem,
  DropdownMenuContent,
} from "../ui/dropdown-menu";
import useEditorToolbarStates from "./hooks/editor-toolbar-states";
import { cn } from "@/lib/utils";
import { type Editor } from "@tiptap/react";
import {
  BoldIcon,
  CodeIcon,
  CodeXmlIcon,
  Heading1,
  Heading2,
  Heading3,
  Heading4,
  HeadingIcon,
  ItalicIcon,
  ListIcon,
  ListOrderedIcon,
  RedoIcon,
  RotateCwIcon,
  RulerDimensionLineIcon,
  StrikethroughIcon,
  TextQuoteIcon,
  UndoIcon,
} from "lucide-react";

const SelectedHeadingIcon = ({ level }: { level: number }) => {
  switch (level) {
    case 1:
      return <Heading1 />;
    case 2:
      return <Heading2 />;
    case 3:
      return <Heading3 />;
    case 4:
      return <Heading4 />;
    default:
      return <HeadingIcon />;
  }
};

const Separator = () => <span className="bg-border mx-1 my-auto h-7 w-0.5" />;

interface PropsType {
  editor: Editor;
  className?: string;
}

export default function EditorToolbar({ editor, className }: PropsType) {
  const editorState = useEditorToolbarStates(editor);

  return (
    <div className={cn("inline-flex gap-2", className)}>
      <Button
        size="icon"
        variant="secondary"
        onClick={() => editor.chain().focus().undo().run()}
        disabled={!editorState.canUndo}
      >
        <UndoIcon />
      </Button>
      <Button
        size="icon"
        variant="secondary"
        onClick={() => editor.chain().focus().redo().run()}
        disabled={!editorState.canRedo}
      >
        <RedoIcon />
      </Button>
      <Separator />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant={editorState.headingLevel ? "default" : "secondary"}
            size="icon"
          >
            <SelectedHeadingIcon level={editorState.headingLevel} />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 1 }).run()
            }
          >
            <Heading1 /> Heading 1
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 2 }).run()
            }
          >
            <Heading2 /> Heading 2
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 3 }).run()
            }
          >
            <Heading3 /> Heading 3
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 4 }).run()
            }
          >
            <Heading4 /> Heading 4
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <Button
        size="icon"
        variant={editorState.isBulletList ? "default" : "secondary"}
        onClick={() => editor.chain().focus().toggleBulletList().run()}
      >
        <ListIcon />
      </Button>
      <Button
        size="icon"
        variant={editorState.isOrderedList ? "default" : "secondary"}
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
      >
        <ListOrderedIcon />
      </Button>
      <Separator />
      <Button
        size="icon"
        variant={editorState.isBold ? "default" : "secondary"}
        onClick={() => editor.chain().focus().toggleBold().run()}
        disabled={!editorState.canBold}
      >
        <BoldIcon />
      </Button>
      <Button
        size="icon"
        variant={editorState.isItalic ? "default" : "secondary"}
        onClick={() => editor.chain().focus().toggleItalic().run()}
        disabled={!editorState.canItalic}
      >
        <ItalicIcon />
      </Button>
      <Button
        size="icon"
        variant={editorState.isStrike ? "default" : "secondary"}
        onClick={() => editor.chain().focus().toggleStrike().run()}
        disabled={!editorState.canStrike}
      >
        <StrikethroughIcon />
      </Button>
      <Button
        size="icon"
        variant={editorState.isCode ? "default" : "secondary"}
        onClick={() => editor.chain().focus().toggleCode().run()}
        disabled={!editorState.canCode}
      >
        <CodeIcon />
      </Button>
      <Separator />
      <Button
        size="icon"
        variant={editorState.isCodeBlock ? "default" : "secondary"}
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
      >
        <CodeXmlIcon />
      </Button>
      <Button
        size="icon"
        variant={editorState.isBlockquote ? "default" : "secondary"}
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
      >
        <TextQuoteIcon />
      </Button>
      <Separator />
      <Button
        size="icon"
        variant="secondary"
        onClick={() => editor.chain().focus().unsetAllMarks().run()}
      >
        <RotateCwIcon />
      </Button>
      <Button
        size="icon"
        variant="secondary"
        onClick={() => editor.chain().focus().setHorizontalRule().run()}
      >
        <RulerDimensionLineIcon />
      </Button>
    </div>
  );
}
