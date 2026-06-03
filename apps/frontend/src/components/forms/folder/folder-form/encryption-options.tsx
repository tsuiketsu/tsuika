import { Card } from "@/components/ui/card";
import { encryptionPresets } from "@/utils/noble/methods.list";
import type { EncryptionKDFPresetKey } from "@/utils/noble/types";
import clsx from "clsx";
import { useId } from "react";

interface PropsType {
  value: EncryptionKDFPresetKey;
  onValueChange: (value: EncryptionKDFPresetKey) => void;
}

export default function EncryptionOptions({ value, onValueChange }: PropsType) {
  const encryptionOptions = Object.entries(encryptionPresets);
  const optionKeys = Object.keys(encryptionPresets);
  const id = useId();

  return (
    <Card className="gap-1 rounded-lg p-1 select-none">
      {encryptionOptions.map(([key, method], idx) => (
        <button
          key={`${id}-${idx}`}
          type="button"
          className={clsx(
            "group inline-flex cursor-pointer items-start gap-2 rounded-md px-3 py-2 text-start transition-transform",
            value === key && "bg-secondary ring-border ring-1"
          )}
          onClick={() =>
            onValueChange(optionKeys[idx] as EncryptionKDFPresetKey)
          }
        >
          <div className="flex flex-col justify-start">
            <span className="text-sm">{method.name}</span>
            <p className="text-muted-foreground text-xs">
              {method.description}
            </p>
          </div>
        </button>
      ))}
    </Card>
  );
}
