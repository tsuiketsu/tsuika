import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useDebounce } from "@uidotdev/usehooks";
import clsx from "clsx";
import { ChevronDownIcon } from "lucide-react";
import * as React from "react";

interface DateType {
  date: string;
  time: string;
}

interface PropsType {
  value?: DateType;
  onValueChange?: (value: DateType) => void;
}

export function DateTimePicker({ value, onValueChange }: PropsType) {
  const [open, setOpen] = React.useState(false);
  const [date, setDate] = React.useState<Date | undefined>(
    value?.date ? new Date(value.date) : undefined
  );
  const [time, setTime] = React.useState<string>(value?.time ?? "");
  const debouncedTime = useDebounce(time, 1000);

  React.useEffect(() => {
    if (date && debouncedTime !== "") {
      onValueChange?.({ date: date.toISOString(), time: debouncedTime });
    }
  }, [date, onValueChange, debouncedTime]);

  return (
    <div className="grid grid-cols-2 gap-2">
      <div className="flex flex-col gap-3">
        <Popover modal open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              id="date"
              className="w-full justify-between font-normal"
            >
              {date ? date.toLocaleDateString() : "Select date"}
              <ChevronDownIcon />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto overflow-hidden p-0" align="start">
            <Calendar
              mode="single"
              selected={date}
              captionLayout="dropdown"
              onSelect={(date) => {
                setDate(date);
                setOpen(false);
              }}
            />
          </PopoverContent>
        </Popover>
      </div>
      <div className="flex flex-col gap-3">
        <Input
          type="time"
          id="time"
          step="1"
          defaultValue={time}
          onInput={(e) => setTime(e.currentTarget.value)}
          className={clsx(
            "bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none",
            debouncedTime === time
              ? "focus-visible:ring-green-500"
              : "focus-visible:ring-amber-500"
          )}
        />
      </div>
    </div>
  );
}
