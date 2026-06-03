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
      <SelectTrigger
        className={clsx(
          "xs:max-w-[180px] data-[size=default]:xs:h-8 xs:text-sm w-full rounded-xl text-base data-[size=default]:h-12 sm:rounded-md",
          `font-${_value}`
        )}
      >
        <SelectValue placeholder={value} />
      </SelectTrigger>
      <SelectContent className="rounded-xl sm:rounded-md">
        {Object.values(fonts).map((font, idx) => (
          <SelectItem
            key={`font-${idx}`}
            value={font}
            className={clsx(
              font,
              "xs:text-sm xs:rounded-sm xs:h-8 h-12 rounded-lg px-4 text-base"
            )}
          >
            {font.split("-").slice(1).join(" ")}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default FontOptions;
