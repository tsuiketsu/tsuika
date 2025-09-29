/// <reference types="vite/client" />

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface ViteTypeOptions {
  // By adding this line, you can make the type of ImportMetaEnv strict
  // to disallow unknown keys.
  // strictImportMetaEnv: unknown
}

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string;
  readonly VITE_FRONTEND_BASE_URL: string;
  readonly VITE_LINK_METADATA_API_URL: string;
  readonly VITE_LINK_METADATA_API_KEY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
