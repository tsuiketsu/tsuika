import type { KdfOptions } from "@/utils/noble";

export interface WorkerRequest {
  password: string;
}

export type WorkerSuccessMessage = {
  status: "success";
  keyMetadata: {
    mac: string;
    salt: string;
  } & KdfOptions;
};

export type WorkerErrorMessage = {
  status: "error";
  message: string;
};

export type WorkerResponse = WorkerSuccessMessage | WorkerErrorMessage;
