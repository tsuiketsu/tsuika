import { imageSize } from "image-size";

export type Metadata = {
  width: number;
  height: number;
  type?: string;
};

export const getImageMetadata = async (
  img: string,
): Promise<Metadata | null> => {
  try {
    const response = await fetch(img);
    if (!response.ok) {
      console.error("Failed to fetch image from remote");
      return null;
    }

    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    return imageSize(buffer);
    // biome-ignore lint/suspicious/noExplicitAny: N/A
  } catch (error: any) {
    console.error("Failed to parse image metadata", error.message);
    return null;
  }
};
