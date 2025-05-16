export function composeInfQryData<T>(
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
