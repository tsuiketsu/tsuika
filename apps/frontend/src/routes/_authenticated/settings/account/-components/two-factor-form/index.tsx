import BackupCodesTab from "./tabs/backupcodes.tab";
import VerificationTab from "./tabs/verification.tab";
import type { TOTP } from "./types";
import { Dialog } from "@/components/ui/dialog";
import type { Setter } from "@/lib/utils";
import { useState } from "react";

interface PropsType extends TOTP {
  open?: boolean;
  onOpenChange?: Setter<boolean>;
}

export default function TwoFactorForm(props: PropsType) {
  const [showBackupCodes, setShowBackupCodes] = useState(false);
  const { open, onOpenChange, backupCodes, totpURI } = props;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <div className="w-full md:w-[400px]">
        {showBackupCodes ? (
          <BackupCodesTab codes={backupCodes} />
        ) : (
          <VerificationTab
            totpURI={totpURI}
            onValueChange={setShowBackupCodes}
          />
        )}
      </div>
    </Dialog>
  );
}
