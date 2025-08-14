import type { User } from "@/lib/auth-client";
import type { KdfOptions } from "@/utils/noble";

export type Folder = {
  id: string;
  name: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
  isPublic: boolean | null;
  publicId: string | null;
  expiresAt: Date | null;
  viewCount: number | null;
  keyDerivation: KeyDerivation | null;
};

export type SharedFolder = {
  id: string;
  title: string;
  note: string;
  expiresAt: Date;
  isLocked: boolean | null;
  isPublic: boolean;
  viewCount: number;
  lastViewdAt: Date;
  createdAt: Date;
  updatedAt: Date;
};

export interface KeyDerivation extends KdfOptions {
  salt: string;
  mac: string;
}

export const userRoles = {
  OWNER: "owner",
  ADMIN: "admin",
  VIEWER: "viewer",
  EDITOR: "editor",
};

export type UserRole = (typeof userRoles)[keyof typeof userRoles];

export interface Collaborator
  extends Pick<User, "name" | "username" | "image"> {
  permissionLevel: UserRole;
}
