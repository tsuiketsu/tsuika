import { AxiosError } from "axios";
import { toast } from "sonner";

export function insertInfQueryData<T>(
  old:
    | {
        pages: { data: T[] }[];
      }
    | undefined,
  data: T
) {
  if (!old || old.pages.length === 0) {
    return { pageParams: [0], pages: [{ data: [data] }] };
  }

  const [firstPage, ...rest] = old.pages;

  return {
    ...old,
    pages: [{ ...firstPage, data: [data, ...firstPage.data] }, ...rest],
  };
}

export function insertInfQueryDataInBulk<T>(
  old:
    | {
        pages: { data: T[] }[];
      }
    | undefined,
  newData: T[]
) {
  if (!old || old.pages.length === 0) {
    return { pageParams: [0], pages: [{ data: [...newData] }] };
  }

  const [firstPage, ...rest] = old.pages;

  return {
    ...old,
    pages: [
      { ...firstPage, data: [...(firstPage.data || []), ...newData] },
      ...rest,
    ],
  };
}

/**
 * Compares a single `newData` item against a list of `oldData` items using a provided `idSelector`.
 *
 * @template T - The shape of the data items.
 * @param oldData - An array of existing items (previous state).
 * @param newData - A single new item to compare.
 * @param idSelector - A function that extracts a unique numeric ID from an item.
 *
 * @example
 * const oldUsers = [{ id: 1, name: 'Alice' }, { id: 2, name: 'Bob' }];
 * const newUser = { id: 1, name: 'Alicia' };
 *
 * const isUpdated = isItemUpdated(oldUsers, newUser, user => user.id);
 */
export function updateInfQueryData<T>(
  old:
    | {
        pages: { data: T[] }[];
      }
    | undefined,
  data: T,
  idSelector: (item: T) => number | string
) {
  if (!old) return old;

  return {
    ...old,
    pages: old.pages.map((list) => ({
      ...list,
      data: list.data.map((item) =>
        idSelector(item) === idSelector(data)
          ? Object.assign({}, item, data)
          : item
      ),
    })),
  };
}

export function deleteInfQueryData<T>(
  old:
    | {
        pages: { data: T[] }[];
      }
    | undefined,
  id: number | string,
  idSelector: (item: T) => number | string
) {
  if (!old) return old;

  return {
    ...old,
    pages: old.pages.map((list) => ({
      ...list,
      data: list.data.filter((item) => idSelector(item) !== id),
    })),
  };
}

export function deleteInfQueryDataInBulk<T, K extends string | number>(
  old:
    | {
        pages: { data: T[] }[];
      }
    | undefined,
  ids: K[],
  idSelector: (item: T) => K
) {
  if (!old) return old;

  return {
    ...old,
    pages: old.pages.map((list) => ({
      ...list,
      data: list.data.filter((item) => !ids.includes(idSelector(item))),
    })),
  };
}

export function sortInfQueryDataByDate<T>(
  old:
    | {
        pages: { data: T[] }[];
      }
    | undefined,
  dateField: (value: T) => string | Date
) {
  if (!old) return old;
  const [firstPage, ...rest] = old.pages;

  const sortedDate = firstPage.data.sort(
    (a, b) =>
      new Date(dateField(b)).getTime() - new Date(dateField(a)).getTime()
  );

  return {
    ...old,
    pages: [{ ...firstPage, data: sortedDate }, ...rest],
  };
}

export function findDataFromInfQuery<T>(
  data: {
    pages: { data: T[] | undefined }[];
  },
  id: string | number,
  idSelector: (v: T) => string | number
): T | undefined {
  return data?.pages?.flatMap((p) =>
    p.data?.find((f) => idSelector(f) === id)
  )?.[0];
}

export const mutationError = (msg?: string) => (error: Error) => {
  console.error(error);
  if (error instanceof AxiosError && error.status === 403) {
    toast.error(error.response?.data.message);
  } else if (msg) {
    toast.error(msg);
  }
};
