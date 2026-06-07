import { mkdir, rm } from "node:fs/promises";
import { dirname } from "node:path";
import { z } from "@hono/zod-openapi";
import { UPLOADS_DIR } from "@/constants";
import { generatePublicId } from "./nanoid";

// -----------------------------------------
// CREATE OBJECT
// -----------------------------------------
export const objectInsertSchema = z.discriminatedUnion("origin", [
  z.object({ origin: z.literal("local"), fileUri: z.instanceof(File) }),
  z.object({ origin: z.literal("remote"), fileUri: z.url() }),
]);

type CreateObjectArgs = {
  bucket: string;
  objectId?: string;
} & z.infer<typeof objectInsertSchema>;

export const createObjectStoreURL = (bucket: string, objectId: string) => {
  return `http://localhost:8000/${UPLOADS_DIR}/${bucket}/${objectId}`;
};

export type CreateObjectResponse = {
  fileId: string | null;
  url: string | null;
  size: number | null;
  name: string | null;
  mimeType: string | null;
};

const defaultValue = {
  fileId: null,
  url: null,
  size: null,
  name: null,
  mimeType: null,
};

async function saveFileLocally(filePath: string, buffer: Buffer<ArrayBuffer>) {
  await mkdir(dirname(filePath), { recursive: true });
  await Bun.write(filePath, buffer);
}

export async function saveObject(
  args: CreateObjectArgs,
): Promise<CreateObjectResponse> {
  const objectId = args.objectId ?? generatePublicId();

  if (args.origin === "remote") {
    try {
      const response = await fetch(args.fileUri);

      if (!response.ok || !response.body) {
        return defaultValue;
      }

      const contentType = response.headers.get("content-type");

      if (!contentType) {
        return defaultValue;
      }

      // Create buffer
      const arrayBuffer = await response.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      const fileExt = contentType.split("/").slice(-1)[0];
      const fileName = `${objectId}.${fileExt}`;
      const filePath = `${UPLOADS_DIR}/${args.bucket}/${fileName}`;

      await saveFileLocally(filePath, buffer);

      return {
        fileId: fileName,
        url: createObjectStoreURL(args.bucket, fileName),
        mimeType: contentType,
        name: args.fileUri,
        size: buffer.length,
      };
    } catch (error) {
      console.error(
        `Failed to upload file: "${args.fileUri}" to bucket ${args.bucket}`,
        error,
      );

      return defaultValue;
    }
  } else if (args.origin === "local") {
    try {
      const bytes = await args.fileUri.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const fileExt = args.fileUri.type.split("/").slice(-1)[0];
      const fileName = `${objectId}.${fileExt}`;
      const filePath = `${UPLOADS_DIR}/${args.bucket}/${fileName}`;

      await saveFileLocally(filePath, buffer);

      return {
        fileId: fileName,
        url: createObjectStoreURL(args.bucket, fileName),
        size: buffer.length,
        name: args.fileUri.name,
        mimeType: args.fileUri.type,
      };
    } catch (error) {
      console.error(
        `Failed to upload file: "${args.fileUri.name}" to bucket ${args.bucket}`,
        error,
      );

      return defaultValue;
    }
  }

  return defaultValue;
}

// -----------------------------------------
// DELETE IMAGE HANDLER
// -----------------------------------------
export async function deleteObject(bucket: string, fileId: string) {
  try {
    await rm(`${UPLOADS_DIR}/${bucket}/${fileId}`);
  } catch (error) {
    console.error(`Failed to delete file ${fileId}`, error);
  }
}

// -----------------------------------------
// DELETE IMAGES HANDLER
// -----------------------------------------
export async function deleteObjectInBulk(bucket: string, fileIds: string[]) {
  try {
    for (const fileId of fileIds) {
      await rm(`${UPLOADS_DIR}/${bucket}/${fileId}`);
    }
  } catch (error) {
    console.error(`Failed to delete file ${fileIds}`, error);
  }
}
