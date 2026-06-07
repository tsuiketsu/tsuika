import { useIntersectionObserver } from "@uidotdev/usehooks";
import { useEffect } from "react";

export const useInfiniteScrollObserver = (
  fetchFunc: () => void,
  isFetching: boolean,
) => {
  const [ref, entry] = useIntersectionObserver({
    threshold: 0,
    root: null,
    rootMargin: "0px",
  });

  useEffect(() => {
    if (entry?.isIntersecting && !isFetching) fetchFunc();
  }, [entry, isFetching, fetchFunc]);

  return ref;
};
