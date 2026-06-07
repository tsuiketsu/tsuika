import { createFileRoute } from "@tanstack/react-router";
import ChangeEmail from "./-components/change-email";
import ChangePassword from "./-components/change-password";
import ToggleTwoFactor from "./-components/toggle-switch";

export const Route = createFileRoute("/_authenticated/settings/account/")({
  component: AccountComponent,
});

function AccountComponent() {
  return (
    <div className="space-y-4">
      <ToggleTwoFactor />
      <hr />
      <ChangeEmail />
      <hr />
      <ChangePassword />
    </div>
  );
}
