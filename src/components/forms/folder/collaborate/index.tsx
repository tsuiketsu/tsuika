import AddCollaborativeUserForm from "./form";
import UserCards from "./user-cards";
import { Button } from "@/components/ui/button";
import {
  SheetClose,
  Sheet,
  SheetContent,
  SheetTitle,
  SheetHeader,
  SheetFooter,
} from "@/components/ui/sheet";
import type { Setter } from "@/lib/utils";
import { useGetCollaboratorsQuery } from "@/queries/collab-folder.queries";

interface PropsType {
  open: boolean;
  setOpen: Setter<boolean>;
  folderId: string;
}

export default function CollaborateFolder(props: PropsType) {
  const { open, setOpen, folderId } = props;

  const { data: users } = useGetCollaboratorsQuery(folderId);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Collaborate Folder</SheetTitle>
        </SheetHeader>
        <div className="space-y-4 px-4">
          <AddCollaborativeUserForm folderId={props.folderId} />
          <UserCards users={users ?? []} folderId={props.folderId} />
        </div>
        <SheetFooter className="pt-6">
          <SheetClose asChild>
            <Button variant="outline">Cancel</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
