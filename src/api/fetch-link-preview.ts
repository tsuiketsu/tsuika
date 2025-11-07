import { options } from "@/constants";
import axios, { HttpStatusCode } from "axios";

export type LinkPreview = {
  url: string;
  title: string;
  siteName: string | undefined;
  description: string | undefined;
  mediaType: string;
  contentType: string | undefined;
  images: string[];
  videos: {
    url: string | undefined;
    secureUrl: string | null | undefined;
    type: string | null | undefined;
    width: string | undefined;
    height: string | undefined;
  }[];
  favicons: string[];
  charset: string | null;
};

export interface LinkPreviewResponsse {
  status: HttpStatusCode;
  message: string;
  data: Partial<LinkPreview> | null;
}

export const fetchLinkPreview = async (
  siteURL: string
): Promise<LinkPreview | null> => {
  try {
    const response = await axios<LinkPreviewResponsse>({
      method: "get",
      url: `${options.apiBaseUrl}/api/v1/utils/link-preview?url=${siteURL}`,
      withCredentials: true,
    }).then(({ data }) => data);

    return response?.data ? (response.data as LinkPreview) : null;
  } catch (error) {
    console.error("Failed to fetch link preview:", error);
    return null;
  }
};
