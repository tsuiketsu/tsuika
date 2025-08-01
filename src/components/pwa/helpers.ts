import { toast } from "sonner";

export async function checkForAppUpdate(
  swUrl: string,
  r: ServiceWorkerRegistration
) {
  const toastId = crypto.randomUUID();
  toast.loading("Checking for updates...", { id: toastId });

  if ("onLine" in navigator && !navigator.onLine) {
    toast.dismiss(toastId);
    return;
  }

  const resp = await fetch(swUrl, {
    cache: "no-store",
    headers: {
      cache: "no-store",
      "cache-control": "no-cache",
    },
  });

  if (resp?.status === 200) await r.update();

  toast.dismiss(toastId);
}
