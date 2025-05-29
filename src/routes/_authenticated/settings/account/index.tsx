import ChangeEmail from "./-components/change-email";
import ChangePassword from "./-components/change-password";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/settings/account/")({
  component: AccountComponent,
});

function AccountComponent() {
  return (
    <div>
      <ChangeEmail />
      <ChangePassword />
    </div>
  );
}
