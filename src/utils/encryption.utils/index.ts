import { objectPick } from "..";
import { LibSodium } from "../libsodium";
import type { Setter } from "@/lib/utils";
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

  const crypto = await new LibSodium().initialize();
  const key = useSecureFolderStore.getState().getKey(bookmark.folderId);
  const nonce = crypto.generateNonce();
  let payload: BookmarkFormSchemaType = bookmark;

  if (key && nonce) {
    const encrypt = (str: string | undefined) => {
      return str && str.trim() !== ""
        ? crypto.encrypt(str, key, nonce)?.ciphertext
        : undefined;
    };

    const { url, title, description, thumbnail, faviconUrl } = bookmark;

    payload = {
      ...bookmark,
      url: encrypt(url) as string,
      title: encrypt(title || "Untitled") ?? undefined,
      description: encrypt(description) ?? undefined,
      thumbnail: encrypt(thumbnail) ?? undefined,
      faviconUrl: encrypt(faviconUrl) ?? undefined,
      nonce: crypto.toBase64(nonce),
    };
  } else {
    throw new Error("Invalid key or nonce");
  }

  return payload;
};

export const decryptBookmarks = async (
  encryptedData: InfiniteData<{ data: Bookmark[] }> | undefined,
  slug: string,
  setBookmarks?: Setter<Bookmark[]>
) => {
  const encrypted = encryptedData?.pages.flatMap((page) => page.data);
  const folderId = slug.split("/")[1];
  const key = useSecureFolderStore.getState().getKey(folderId);

  if (encrypted && encrypted.length > 0 && key) {
    const cypher = await new LibSodium().initialize();

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
          .map(([k, v]) => [
            k,
            cypher.decrypt(v as string, { nonce: item.nonce!, key }),
          ])
      );

      decrypted = Object.assign({}, item, decrypted);
      setBookmarks?.((prev) => [...prev, decrypted as Bookmark]);
    }
  }
};
