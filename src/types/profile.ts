import z from "zod";

export const PreferencesFormSchema = z.object({
  font: z.string().optional(),
  dashboardThumbnail: z
    .instanceof(File)
    .refine((file) => file.size <= 5 * 1024 * 1024, "Max file size 5MB")
    .optional(),
  pinnedFolders: z.array(z.string()).optional(),
});

export type Preferences = z.infer<typeof PreferencesFormSchema>;

export interface Profile {
  preferencesJson: Preferences;
  createdAt: Date;
  updatedAt: Date;
}
