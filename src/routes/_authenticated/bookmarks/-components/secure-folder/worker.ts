/// <reference lib="webworker" />
import type { WorkerRequest, WorkerResponse } from "./types";
import { LibSodium } from "@/utils/libsodium";

self.onmessage = async (e: MessageEvent<WorkerRequest>) => {
  const crypto = await new LibSodium().initialize();
  const { password, salt, mac } = e.data;
  const secret = crypto.verifyAuth(password, salt, mac);

  const response: WorkerResponse = secret.isMatching
    ? {
        status: "success",
        key: secret.key,
      }
    : {
        status: "error",
        message: "Invalid password!",
      };

  self.postMessage(response);
};

export {};
