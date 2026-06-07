import type React from "react";
import BookmarkContext, { type BookmarkContextType } from "./bookmark-context";

const BookmarkContextProvider = ({
  children,
  query,
  slug,
}: BookmarkContextType & { children: React.ReactNode }) => {
  return (
    <BookmarkContext.Provider value={{ query, slug }}>
      {children}
    </BookmarkContext.Provider>
  );
};

export default BookmarkContextProvider;
