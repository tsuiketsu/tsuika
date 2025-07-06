/// <reference lib="webworker" />
import type { WorkerRequest, WorkerResponse } from "./types";
import { Noble } from "@/utils/noble";

self.onmessage = (e: MessageEvent<WorkerRequest>) => {
  const crypto = new Noble();
  const { password, salt, mac, kdfOpts } = e.data;
  const secret = crypto.verifyAuth({ password, salt, mac, opts: kdfOpts });

  const response: WorkerResponse = secret
    ? {
        status: "success",
        key: secret,
      }
    : {
        status: "error",
        message: "Invalid password!",
      };

  self.postMessage(response);
};

export {};
