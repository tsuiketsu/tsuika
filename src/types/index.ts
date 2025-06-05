import type { LucideProps } from "lucide-react";
import type { ForwardRefExoticComponent, RefAttributes } from "react";
import type { FieldValues, FieldPath } from "react-hook-form";

export interface SuccessResponse<T> {
  success: true; // No point, for the sake of completeness
  message: string;
  data: T;
}

export type Pagination = {
  page: number;
  limit: number;
  total: number;
  hasMore: boolean;
};

export type PaginatedSuccessResponse<T> = SuccessResponse<T> & {
  pagination: Pagination;
};

export type PaginatedResponse<T> = Promise<{
  data: T;
  nextCursor: number | null;
}>;

export type StringKeys<T> = {
  [K in keyof T]: Extract<T[K], string> extends never ? never : K;
}[keyof T];

export type LucideIconElement = ForwardRefExoticComponent<
  Omit<LucideProps, "ref">
> &
  RefAttributes<SVGSVGElement>;

export type InfiniteQueryResponse<T> = { pages: { data: T[] }[] };

// react-hook-form type utils
export type RHFFieldPath<TFieldValues extends FieldValues = FieldValues> =
  FieldPath<TFieldValues>;
export type NestedPathsOnly<T extends FieldValues> = Exclude<
  FieldPath<T>,
  keyof T
>;
