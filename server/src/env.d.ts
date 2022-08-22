declare global {
  namespace NodeJS {
    interface ProcessEnv {
      DATABASE_URL: string;
      REDIS_URL: string;
      REDIS_SESSION_SECRET: string;
      ALLOWED_ORIGIN: string;
      FORGOT_PASSWORD_URL: string;
      MW_PORT: string;
    }
  }
}

export {}
