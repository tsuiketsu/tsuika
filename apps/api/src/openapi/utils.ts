import { faker } from "@faker-js/faker";

export const generateFakerNanoid = () => faker.string.nanoid(12);
export const generateFakerNanoIds = (length: number) =>
  Array.from({ length }).map(() => generateFakerNanoid());
