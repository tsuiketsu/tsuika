import BookmarkContext, { type BookmarkContextType } from "./bookmark-context";
import React from "react";

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
