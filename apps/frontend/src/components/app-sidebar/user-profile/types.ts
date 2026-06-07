import type { ProfileFormSchema } from "@/routes/_authenticated/settings/profile";

export type User = ProfileFormSchema & { image: string };
