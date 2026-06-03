import { z } from "zod";
import type { CustomResponse } from ".";

export const LinkPreviewSchema = z.object({
  url: z.url(),
  title: z.string(),
  siteName: z.string().optional(),
  description: z.string().optional(),
  mediaType: z.string(),
  contentType: z.string().optional(),
  images: z.array(z.url()),
  videos: z.array(
    z.object({
      url: z.url().optional(),
      secureUrl: z.url().nullable().optional(),
      type: z.string().nullable().optional(),
      width: z.string().optional(),
      height: z.string().optional(),
    }),
  ),
  favicons: z.array(z.url()),
  charset: z.string().nullable(),
});

export type LinkPreview = z.infer<typeof LinkPreviewSchema>;

export interface LinkPreviewResponse extends CustomResponse {
  data: Partial<LinkPreview> | null;
}
