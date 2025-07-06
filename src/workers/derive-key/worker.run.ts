import type { WorkerRequest, WorkerResponse } from "./types";

export function runDeriveKeyWorker(
  data: WorkerRequest
): Promise<WorkerResponse> {
  const worker = new Worker(new URL("./worker.ts", import.meta.url), {
    type: "module",
  });

  return new Promise((resolve, reject) => {
    const handleMessage = (event: MessageEvent) => {
      resolve(event.data);
    };

    const handleError = (err: ErrorEvent) => {
      reject(err);
      cleanup();
    };

    const cleanup = () => {
      worker.removeEventListener("message", handleMessage);
      worker.removeEventListener("error", handleError);
    };

    worker.addEventListener("message", handleMessage);
    worker.addEventListener("error", handleError);
    worker.postMessage(data);
  });
}
