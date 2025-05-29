import type { buttonVariants } from "../ui/button";
import FilePicker from "./file-picker";
import type { VariantProps } from "class-variance-authority";

interface ReturnType {
  file: File;
  fileList: FileList;
  previewUrl: string;
}

interface PropsType extends VariantProps<typeof buttonVariants> {
  onValueChange: (value: ReturnType) => void;
}

const ImagePicker = ({ onValueChange, ...buttonProps }: PropsType) => {
  const onChange = ({ file, fileList }: Omit<ReturnType, "previewUrl">) => {
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      onValueChange?.({ file, previewUrl, fileList });
    }
  };

  return (
    <FilePicker accept="image/*" onValueChange={onChange} {...buttonProps} />
  );
};

export default ImagePicker;
