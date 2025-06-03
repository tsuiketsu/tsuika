import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ClipboardCheck, Clipboard } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function CopyText({ text }: { text: string }) {
  const [showTick, setShowTick] = useState(false);
  const [code, setCode] = useState("");

  useEffect(() => {
    const searchable = new URLSearchParams(text.split("?")[1]);
    const secret = searchable.get("secret");
    if (secret) {
      setCode(secret);
    }
  }, [text]);

  const copyTextHandler = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setShowTick(true);
      toast.success("Successfully copied secret to clipboard!");
      setTimeout(() => setShowTick(false), 4000);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="inline-flex w-full items-center gap-2">
      <Input value={code} className="w-full" />
      <Button variant="outline" size="icon" onClick={copyTextHandler}>
        {showTick ? <ClipboardCheck /> : <Clipboard />}
      </Button>
    </div>
  );
}
