declare global {
  namespace NodeJS {
    interface ProcessEnv {
      ALLOWED_ORIGINS: string;
      MW_PORT: string;
      REDIS_SESSION_SECRET: string;
      REDIS_URL: string;
      DATABASE_URL: string;
      FORGOT_PASSWORD_URL: string;
    }
  }
}

export {}
