/// <reference lib="webworker" />

import { Noble } from "@/utils/noble";
import type { WorkerRequest, WorkerResponse } from "./types";

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
