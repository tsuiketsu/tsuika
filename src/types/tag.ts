import { type } from "arktype";

export type Tag = {
  id: number;
  name: string;
  color: string;
  useCount: number;
  created_at: Date | string;
  updated_at: Date | string;
};

export const TagInsertSchema = type({
  name: "string < 30 | undefined",
  color: "6 <= string < 15 | undefined",
});
export type TagInsertSchemaType = type.infer<typeof TagInsertSchema>;
