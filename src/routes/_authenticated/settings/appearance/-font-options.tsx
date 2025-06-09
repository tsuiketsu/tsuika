import { fonts, type Font } from "@/components/font/context/font-context";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import clsx from "clsx";
import { useState } from "react";

interface PropsType {
  value?: Font;
  onValueChange?: (value: Font) => void;
}

const FontOptions = ({ value, onValueChange }: PropsType) => {
  const [_value, _setValue] = useState<Font>(value ?? fonts.default);

  const onSelect = (fontName: Font) => {
    _setValue(fontName);
    onValueChange?.(fontName);
  };

  return (
    <Select value={_value} onValueChange={onSelect}>
      <SelectTrigger className={clsx("min-w-[180px]", `font-${_value}`)}>
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
};

export default FontOptions;
