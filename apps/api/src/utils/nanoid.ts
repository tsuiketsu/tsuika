import { customAlphabet } from "nanoid";

export const alphabet = "0123456789abcdefghijklmnopqrstuvwxyz";
const length = 12;

const nanoid = customAlphabet(alphabet, length);

export const generatePublicId = (): string => nanoid();
