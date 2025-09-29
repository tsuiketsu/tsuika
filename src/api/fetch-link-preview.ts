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
  url: string
): Promise<LinkPreview | null> => {
  try {
    const response = await axios<LinkPreviewResponsse>({
      url: `${import.meta.env.VITE_LINK_METADATA_API_URL}/api/v1`,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": import.meta.env.VITE_LINK_METADATA_API_KEY,
      },
      data: { url },
    }).then(({ data }) => data);

    return response.data as LinkPreview;
  } catch (error) {
    console.error("Failed to fetch link preview:", error);
    return null;
  }
};
