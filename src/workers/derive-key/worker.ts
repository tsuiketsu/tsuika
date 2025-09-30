/// <reference lib="webworker" />
import type { WorkerRequest, WorkerResponse } from "./types";
import { Noble } from "@/utils/noble";

self.onmessage = (e: MessageEvent<WorkerRequest>) => {
  const crypto = new Noble({ kdfOptions: e.data?.encryptionMethod });
  const secret = crypto.deriveKey({ password: e.data.password });

  const meta = Object.assign(
    {},
    { mac: crypto.toBase64(secret.mac), salt: crypto.toBase64(secret.salt) },
    secret.opts
  );

  const response: WorkerResponse = secret
    ? { status: "success", keyMetadata: meta }
    : { status: "error", message: "Invalid password!" };

  self.postMessage(response);
};

export {};
