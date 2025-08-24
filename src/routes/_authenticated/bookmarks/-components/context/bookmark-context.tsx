import React from "react";

export interface BookmarkContextType {
  query: string;
  slug: string;
}

const BookmarkContext = React.createContext<BookmarkContextType | null>(null);

export default BookmarkContext;
