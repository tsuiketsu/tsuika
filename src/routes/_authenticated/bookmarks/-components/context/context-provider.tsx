import BookmarkContext, { type BookmarkContextType } from "./bookmark-context";
import React from "react";

const BookmarkContextProvider = ({
  children,
  query,
}: BookmarkContextType & { children: React.ReactNode }) => {
  return (
    <BookmarkContext.Provider value={{ query }}>
      {children}
    </BookmarkContext.Provider>
  );
};

export default BookmarkContextProvider;
