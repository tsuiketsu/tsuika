import { Button } from "@/components/ui/button";
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { copyCodes } from "@/utils";
import { Clipboard, ClipboardCheck, Printer, SaveAll } from "lucide-react";
import { useState } from "react";

export default function BackupCodesTab({ codes }: { codes: string[] }) {
  const [showCheckMark, setShowCheckMark] = useState(false);
  const textContent = codes.join("\n");

  const downloadCodes = () => {
    const textBlob =
      "data:text/plain;charset=utf-8," + encodeURIComponent(textContent);
    const link = document.createElement("a");
    link.href = textBlob;
    link.download = `tsuika-backup-codes.txt`;
    link.click();
  };

  const onPrint = () => {
    const WinPrint = window.open(
      "",
      "",
      "left=0,top=0,width=800,height=900,toolbar=0,scrollbars=0,status=0"
    );

    if (WinPrint) {
      WinPrint.document.write(`
      <html>
        <head><title>Backup Codes Print</title></head>
        <body style="font-size:18px;">
        <pre>${textContent}</pre>
        </body>
      </html>
    `);
      WinPrint.document.close();
      WinPrint.focus();
      WinPrint.print();
      WinPrint.close();
    }
  };

  return (
    <DialogContent className="w-full md:w-[400px]">
      <DialogHeader>
        <DialogTitle>Backup Codes</DialogTitle>
        <DialogDescription>
          Back up these codes — without them, you may need to contact support to
          recover your account
        </DialogDescription>
      </DialogHeader>
      <div className="space-y-2">
        <div className="bg-accent flex justify-evenly rounded-lg py-10">
          <ul className="columns-2 gap-8 text-sm">
            {codes.map((code) => (
              <li className="font-mono tracking-widest">{code}</li>
            ))}
          </ul>
        </div>
        <div className="space-x-2">
          <Button variant="outline" size="sm" onClick={onPrint}>
            <Printer />
            Print
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => copyCodes(codes.join("\n"), setShowCheckMark)}
          >
            {showCheckMark ? <ClipboardCheck /> : <Clipboard />}
            Copy
          </Button>
          <Button variant="outline" size="sm" onClick={downloadCodes}>
            <SaveAll />
            Download
          </Button>
        </div>
      </div>
    </DialogContent>
  );
}
