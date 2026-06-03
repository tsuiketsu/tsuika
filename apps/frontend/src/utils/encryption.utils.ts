import { objectPick } from ".";
import { Noble } from "./noble";
import { useSecureFolderStore } from "@/stores/secure-folder.store";
import type { Bookmark, BookmarkFormSchemaType } from "@/types/bookmark";
import type { InfiniteData } from "@tanstack/react-query";

export const encryptBookmarks = async (
  bookmark: BookmarkFormSchemaType
): Promise<BookmarkFormSchemaType | null> => {
  if (!bookmark.folderId) {
    console.error("folderId is not defined");
    return null;
  }

  const crypto = new Noble();
  const key = useSecureFolderStore.getState().getKey(bookmark.folderId);
  const nonce = crypto.generateNonce();

  let payload: BookmarkFormSchemaType = bookmark;

  if (key && nonce) {
    const encrypt = (str: string | undefined): string | undefined => {
      return str && str.trim() !== ""
        ? crypto.encrypt(str, key, nonce)
        : undefined;
    };

    const { url, title, description, thumbnail, faviconUrl } = bookmark;

    payload = {
      ...bookmark,
      url: encrypt(url) as string,
      title: encrypt(title || "Untitled"),
      description: encrypt(description),
      thumbnail: encrypt(thumbnail),
      faviconUrl: encrypt(faviconUrl),
      nonce: crypto.toBase64(nonce),
    };
  } else {
    throw new Error("Invalid key or nonce");
  }

  return payload;
};

export const decryptBookmark = async (bookmark: Bookmark, folderId: string) => {
  const key = useSecureFolderStore.getState().getKey(folderId);
  const cipher = new Noble();
  const nonce = bookmark.nonce;
  console.log(bookmark);

  if (!key || !nonce) return bookmark;

  const fieldsToBeDecrypted = [
    "url",
    "title",
    "description",
    "thumbnail",
    "faviconUrl",
  ] as (keyof Bookmark)[];

  const decrypted = Object.fromEntries(
    Object.entries(objectPick(bookmark, fieldsToBeDecrypted))
      .filter(([_, v]) => v != null)
      .map(([k, v]) => [k, cipher.decrypt(v as string, key, nonce)])
  );

  return Object.assign({}, bookmark, decrypted);
};

export const decryptBookmarks = async (
  encryptedData: InfiniteData<{ data: Bookmark[] }> | undefined,
  slug: string
): Promise<Bookmark[]> => {
  const encrypted = encryptedData?.pages.flatMap((page) => page.data);
  const folderId = slug.split("/")[1];
  const key = useSecureFolderStore.getState().getKey(folderId);

  const bookmarks: Bookmark[] = [];
  if (encrypted && encrypted.length > 0 && key) {
    const cypher = new Noble();

    const fieldsToBeDecrypted = [
      "url",
      "title",
      "description",
      "thumbnail",
      "faviconUrl",
    ] as (keyof Bookmark)[];

    for (const item of encrypted) {
      let decrypted: Partial<Bookmark> = Object.fromEntries(
        Object.entries(objectPick(item, fieldsToBeDecrypted))
          .filter(([_, v]) => v != null)
          .map(([k, v]) => [k, cypher.decrypt(v as string, key, item.nonce!)])
      );

      decrypted = Object.assign({}, item, decrypted);
      bookmarks.push(decrypted as Bookmark);
    }
  }

  return bookmarks;
};
