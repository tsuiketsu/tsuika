declare namespace NodeJS {
  interface ProcessEnv {
    DATABASE_URL: string;
    DOMAIN: string;
    BASE_URL: string;
    FRONTEND_ORIGIN: string;
    CORS_ORIGIN_HOPPSCOTCH: string;
    CORS_ORIGIN_BROWSER_EXTENSION: string;
    ENABLE_EMAIL_VERIFICATION: string;
    RESEND_API_KEY: string;
    JWT_SECRET: string;
    S3_BUCKET_USE_SSL: string;
    S3_BUCKET_API_PORT: number;
    S3_BUCKET_ENDPOINT: string;
    S3_BUCKET_ACCESS_KEY: string;
    S3_BUCKET_KEY: string;
    S3_BUCKET_URL: string;
    MEILI_HOST: string;
    MEILI_MASTER_KEY: string;
  }
}
