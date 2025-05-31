import { fonts, type Font } from "@/components/font/context/font-context";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import clsx from "clsx";

interface PropsType {
  value?: Font;
  onValueChange?: (value: Font) => void;
}

const FontOptions = ({ value, onValueChange }: PropsType) => (
  <Select value={value} onValueChange={onValueChange}>
    <SelectTrigger className={clsx("min-w-[180px]", `font-${value}`)}>
      <SelectValue placeholder={value} />
    </SelectTrigger>
    <SelectContent>
      {Object.values(fonts).map((font, idx) => (
        <SelectItem key={`font-${idx}`} value={font} className={font}>
          {font.split("-").slice(1).join(" ")}
        </SelectItem>
      ))}
    </SelectContent>
  </Select>
);

export default FontOptions;
