import AddCollaborativeUserForm from "./form";
import { useCollaboratorForderStore } from "./store";
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
import { useGetCollaboratorsQuery } from "@/queries/collab-folder.queries";

interface PropsType {
  folderId: string;
}

export default function CollaborateFolder({ folderId }: PropsType) {
  const { data: users } = useGetCollaboratorsQuery(folderId);
  const { open, setOpen } = useCollaboratorForderStore();

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Collaborate Folder</SheetTitle>
        </SheetHeader>
        <div className="space-y-4 px-4">
          <AddCollaborativeUserForm folderId={folderId} />
          <UserCards users={users ?? []} folderId={folderId} />
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
