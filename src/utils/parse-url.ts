import normalizeUrl from "normalize-url";

export const getCleanUrl = (url: string) => {
  try {
    return normalizeUrl(url, {
      stripWWW: true,
      forceHttps: true,
      removeTrailingSlash: true,
      removeDirectoryIndex: true,
      removeExplicitPort: true,
      removeQueryParameters: [/^utm_/, "ref", "fbclid", "gclid"],
    });
  } catch {
    return null;
  }
};
