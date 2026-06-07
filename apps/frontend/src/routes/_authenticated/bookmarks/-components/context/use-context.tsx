import React from "react";
import BookmarkContext from "./bookmark-context";

const useBookmarkContext = () => {
  const context = React.useContext(BookmarkContext);

  if (!context) {
    throw new Error(
      "useBookmarkContext must be used within BookmarkContextProvider",
    );
  }

  return context;
};

export default useBookmarkContext;
