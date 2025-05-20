import React from "react";

interface BookmarkContextType {
  folderSlug: string;
}

const BookmarkContext = React.createContext<BookmarkContextType | null>(null);

export default BookmarkContext;
