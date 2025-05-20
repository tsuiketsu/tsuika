import BookmarkContext from "./bookmark-context";
import React from "react";

const BookmarkContextProvider = ({
  children,
  folderSlug,
}: {
  children: React.ReactNode;
  folderSlug: string;
}) => {
  return (
    <BookmarkContext.Provider value={{ folderSlug }}>
      {children}
    </BookmarkContext.Provider>
  );
};

export default BookmarkContextProvider;
