import type { KdfOptions } from "@/utils/noble";

export interface WorkerRequest {
  password: string;
  mac: string;
  salt: string;
  kdfOpts: KdfOptions;
}

export type WorkerSuccessMessage = {
  status: "success";
  key: string;
};

export type WorkerErrorMessage = {
  status: "error";
  message: string;
};

export type WorkerResponse = WorkerSuccessMessage | WorkerErrorMessage;
