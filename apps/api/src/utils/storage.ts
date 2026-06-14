import { z } from "@hono/zod-openapi";
import { s3 } from "@/lib/s3";
import { generatePublicId } from "./nanoid";

// -----------------------------------------
// CREATE OBJECT
// -----------------------------------------
export const objectInsertSchema = z.discriminatedUnion("origin", [
  z.object({ origin: z.literal("local"), fileUri: z.instanceof(File) }),
  z.object({ origin: z.literal("remote"), fileUri: z.url() }),
]);

type CreateObjectArgs = {
  folder: string;
  objectId?: string;
} & z.infer<typeof objectInsertSchema>;

export const createObjectStoreURL = (filePath: string): string => {
  return s3.presign(filePath, {
    endpoint: process.env.S3_PUBLIC_ENDPOINT || process.env.S3_ENDPOINT,
    expiresIn: 60 * 15,
  });
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

export async function saveObject(
  args: CreateObjectArgs,
): Promise<CreateObjectResponse> {
  const objectId = args.objectId ?? generatePublicId();

  const buildStoragePath = (contentType: string) => {
    const ext = contentType.split("/").at(-1);
    const fileName = `${objectId}.${ext}`;
    return { fileName, filePath: `${args.folder}/${fileName}` };
  };

  if (args.origin === "remote") {
    try {
      const response = await fetch(args.fileUri);

      if (!response.ok || !response.body) return defaultValue;

      const contentType = response.headers.get("content-type");
      if (!contentType) return defaultValue;

      if (!contentType) {
        return defaultValue;
      }

      const { fileName, filePath } = buildStoragePath(contentType);

      await s3.write(filePath, response, { type: contentType });

      return {
        fileId: fileName,
        url: createObjectStoreURL(filePath),
        mimeType: contentType,
        name: args.fileUri,
        size: Number(response.headers.get("content-length") ?? 0),
      };
    } catch (error) {
      console.error(
        `Failed to upload file: "${args.fileUri}" to folder ${args.folder}`,
        error,
      );

      return defaultValue;
    }
  } else if (args.origin === "local") {
    try {
      const { filePath, fileName } = buildStoragePath(args.fileUri.type);

      await s3.write(filePath, args.fileUri, {
        type: args.fileUri.type,
      });

      return {
        fileId: fileName,
        url: createObjectStoreURL(filePath),
        size: Number(args.fileUri.size ?? 0),
        name: args.fileUri.name,
        mimeType: args.fileUri.type,
      };
    } catch (error) {
      console.error(
        `Failed to upload file: "${args.fileUri.name}" to folder ${args.folder}`,
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
export async function deleteObject(folder: string, fileId: string) {
  try {
    const exists = await s3.exists(`${folder}/${fileId}`);

    if (exists) {
      await s3.delete(`${folder}/${fileId}`);
    }
  } catch (error) {
    console.error(`Failed to delete file ${fileId}`, error);
  }
}

// -----------------------------------------
// DELETE IMAGES HANDLER
// -----------------------------------------
export async function deleteObjectInBulk(folder: string, fileIds: string[]) {
  await Promise.all(fileIds.map((fileId) => deleteObject(folder, fileId)));
}
