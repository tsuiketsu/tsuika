declare namespace NodeJS {
  interface ProcessEnv {
    DATABASE_URL: string;
    DOMAIN: string;
    FRONTEND_ORIGIN: string;
    CORS_ORIGIN_HOPPSCOTCH: string;
    CORS_ORIGIN_BROWSER_EXTENSION: string;
    ENABLE_EMAIL_VERIFICATION: string;
    RESEND_API_KEY: string;
    JWT_SECRET: string;
    MEILI_HOST: string;
    MEILI_MASTER_KEY: string;
  }
}
