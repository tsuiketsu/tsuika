import * as dns from "node:dns";
import { getLinkPreview } from "link-preview-js";
import { ERROR_DEFINITIONS } from "@/errors/codes";
import type { LinkPreviewResponse } from "@/types/link-preview.types";

export const fetchLinkPreview = async (
  websiteUrl: string,
): Promise<LinkPreviewResponse> => {
  try {
    const response = await getLinkPreview(websiteUrl, {
      followRedirects: "manual",
      headers: { "user-agent": "Twitterbot" },
      handleRedirects: () => true,
      resolveDNSHost: async (url: string) => {
        return new Promise((resolve, reject) => {
          const hostname = new URL(url).hostname;
          dns.lookup(hostname, (err, address) => {
            if (err) {
              reject(err);
            }
            resolve(address);
          });
        });
      },
    });

    return {
      status: 200,
      message: "Successfully fetched link preview",
      data: response,
    };
    // biome-ignore lint/suspicious/noExplicitAny: false
  } catch (error: any) {
    console.error(error);

    return {
      status: ERROR_DEFINITIONS.INTERNAL_ERROR.status,
      message: error.message || "Failed to fetch link preview",
      data: null,
    };
  }
};
