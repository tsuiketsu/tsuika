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
import { getCollaborators } from "@/queries/collab-folder.queries";
import { useQuery } from "@tanstack/react-query";

interface PropsType {
  open: boolean;
  setOpen: Setter<boolean>;
  folderId: string;
}

export default function CollaborateFolder(props: PropsType) {
  const { open, setOpen, folderId } = props;

  const queryKey = ["get-collaborators", { folderId }];

  const { data: users } = useQuery({
    queryKey,
    queryFn: () => getCollaborators(folderId),
    refetchOnMount: true,
    refetchOnReconnect: true,
    staleTime: 0,
  });

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Collaborate Folder</SheetTitle>
        </SheetHeader>
        <div className="space-y-4 px-4">
          <AddCollaborativeUserForm
            folderId={props.folderId}
            queryKey={queryKey}
          />
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
