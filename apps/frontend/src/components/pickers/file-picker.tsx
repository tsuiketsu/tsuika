import type { VariantProps } from "class-variance-authority";
import type React from "react";
import { useRef } from "react";
import { Button, type buttonVariants } from "../ui/button";

interface ReturnType {
  file: File;
  fileList: FileList;
}

interface PropsType extends VariantProps<typeof buttonVariants> {
  accept?: React.ComponentProps<"input">["accept"];
  onValueChange?: (file: ReturnType) => void;
}

const FilePicker = ({ accept, onValueChange, ...buttonProps }: PropsType) => {
  const inputeRef = useRef<HTMLInputElement>(null);
  return (
    <>
      <Button onClick={() => inputeRef.current?.showPicker()} {...buttonProps}>
        Pick File
      </Button>
      <input
        type="file"
        className="hidden"
        accept={accept}
        onInput={(e) => {
          const files = e.currentTarget.files;
          if (files && files[0] != null) {
            onValueChange?.({ file: files[0], fileList: files });
          }
        }}
        ref={inputeRef}
      />
    </>
  );
};
export default FilePicker;
