declare global {
  namespace NodeJS {
    interface ProcessEnv {
      ACCESS_TOKEN_SECRET: string;
      ACCESS_TOKEN_EXPIRY_TIME: string;
      REFRESH_TOKEN_SECRET: string;
      REFRESH_TOKEN_EXPIRY_TIME: string;
      PORT: number;
    }
  }
}

// If this file has no import/export statements (i.e. is a script)
// convert it into a module by adding an empty export statement.
export {};
