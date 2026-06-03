import { faker } from "@faker-js/faker";
import type z from "zod";
import type { folderInsertSchema } from "@/db/schema/folder.schema";
import type { tagSelectSchema } from "@/db/schema/tag.schema";
import { generateFakerNanoid } from "../utils";

export const tags = [
  { name: "Important", color: "#FF5722", id: "tag_priority_X3Y4Z" },
  { name: "Work Project", color: "#4CAF50", id: "tag_work_PQR567" },
];

const userId = faker.string.nanoid(32);

export const bookmarkExamples = {
  id: 123456789,
  publicId: generateFakerNanoid(),
  folderId: 101,
  title: "How to Build a Custom Hook in React",
  description:
    "A comprehensive guide on creating reusable state logic with React Hooks.",
  url: "https://react.dev/learn/reusable-logic-with-custom-hooks",
  tags,
  faviconUrl: "https://react.dev/favicon.ico",
  thumbnail: "https://react.dev/images/custom-hook-preview.jpg",
  thumbnailWidth: 1280,
  thumbnailHeight: 720,
  nonce: "qW3eR5tY7uI9oP1aS2dF4gH6jK8lZ0x",
  isEncrypted: false,
  isPinned: true,
  isFavourite: true,
  isArchived: false,
  createdAt: new Date("2025-10-15T19:11:00.000Z").toISOString(),
  updatedAt: new Date("2025-10-16T10:30:00.000Z").toISOString(),
};

export const folderExamples: z.infer<typeof folderInsertSchema> & {
  publicId: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
} = {
  publicId: generateFakerNanoid(),
  userId,
  name: "Games",
  description: "Collection what games I've played or what I want to play",
  createdAt: "2025-10-15T19:11:00.000Z",
  updatedAt: "2025-10-16T10:30:00.000Z",
  settings: {
    defaultView: "grid",
    isLinkPreview: true,
    isEncrypted: true,
    keyDerivation: {
      m: 32768,
      p: 1,
      t: 2,
      mac: "61a+2ygTkhlOWbNgstsD/rwfnVmomIZOfxvu/ADLVl0=",
      salt: "sQttREeihzmO/4vBgiZUw2CVcNAgBRkjuzu3Bp8m5Q4=",
      dkLen: 32,
    },
  },
};

export const tagExamples: z.infer<typeof tagSelectSchema>[] = Array.from({
  length: 3,
}).map(() => ({
  id: generateFakerNanoid(),
  color: faker.color.rgb(),
  name: faker.word.adjective(),
  useCount: faker.number.int({ min: 0, max: 1000 }),
  createdAt: faker.date.past(),
  updatedAt: faker.date.recent(),
}));
