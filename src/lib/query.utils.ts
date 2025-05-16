export function insertInfQueryData<T>(
  old:
    | {
        pages: { data: T[] }[];
      }
    | undefined,
  data: T,
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
  idSelector: (item: T) => number | string,
) {
  if (!old) return old;

  return {
    ...old,
    pages: old.pages.map((list) => ({
      ...list,
      data: list.data.map((item) =>
        idSelector(item) === idSelector(data) ? data : item,
      ),
    })),
  };
}
