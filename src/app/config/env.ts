import dotenv from "dotenv";

dotenv.config();

interface EnvConfig {
  PORT: string;
  DB_URL: string;
  CLIENT_URL: string;
  SERVER_URL: string;
  NODE_ENV: string;
  JWT_SECRET: string;
  JWT_EXPIRES_IN: string;
  JWT_REFRESH_SECRET: string;
  JWT_REFRESH_EXPIRES_IN: string;
  BCRYPT_SALT_ROUNDS: string;
  CLOUDINARY: {
    CLOUDINARY_CLOUD_NAME: string;
    CLOUDINARY_API_KEY: string;
    CLOUDINARY_API_SECRET: string;
  };
  SSL: {
    SSL_STORE_ID: string;
    SSL_STORE_PASS: string;
    SSL_PAYMENT_API: string;
    SSL_VALIDATION_API: string;
    SSL_SUCCESS_BACKEND_URL: string;
    SSL_FAIL_BACKEND_URL: string;
    SSL_CANCEL_BACKEND_URL: string;
    SSL_SUCCESS_FRONTEND_URL: string;
    SSL_FAIL_FRONTEND_URL: string;
    SSL_CANCEL_FRONTEND_URL: string;
  };
}

const loadEnvVariables = (): EnvConfig => {
  const reqEnvVariables: string[] = [
    "PORT",
    "DB_URL",
    "CLIENT_URL",
    "SERVER_URL",
    "NODE_ENV",
    "JWT_SECRET",
    "JWT_EXPIRES_IN",
    "JWT_REFRESH_SECRET",
    "JWT_REFRESH_EXPIRES_IN",
    "BCRYPT_SALT_ROUNDS",
    "CLOUDINARY_CLOUD_NAME",
    "CLOUDINARY_API_KEY",
    "CLOUDINARY_API_SECRET",
    "SSL_STORE_ID",
    "SSL_STORE_PASS",
    "SSL_PAYMENT_API",
    "SSL_VALIDATION_API",
    "SSL_SUCCESS_BACKEND_URL",
    "SSL_FAIL_BACKEND_URL",
    "SSL_CANCEL_BACKEND_URL",
    "SSL_SUCCESS_FRONTEND_URL",
    "SSL_FAIL_FRONTEND_URL",
    "SSL_CANCEL_FRONTEND_URL",
  ];

  reqEnvVariables.forEach((envVar) => {
    if (!process.env[envVar]) {
      throw new Error(`Missing required environment variable: ${envVar}`);
    }
  });

  return {
    PORT: process.env.PORT as string,
    DB_URL: process.env.DB_URL as string,
    CLIENT_URL: process.env.CLIENT_URL as string,
    SERVER_URL: process.env.SERVER_URL as string,
    NODE_ENV: process.env.NODE_ENV as string,
    JWT_SECRET: process.env.JWT_SECRET as string,
    JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN as string,
    JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET as string,
    JWT_REFRESH_EXPIRES_IN: process.env.JWT_REFRESH_EXPIRES_IN as string,
    BCRYPT_SALT_ROUNDS: process.env.BCRYPT_SALT_ROUNDS as string,
    CLOUDINARY: {
      CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME as string,
      CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY as string,
      CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET as string,
    },
    SSL: {
      SSL_STORE_ID: process.env.SSL_STORE_ID as string,
      SSL_STORE_PASS: process.env.SSL_STORE_PASS as string,
      SSL_PAYMENT_API: process.env.SSL_PAYMENT_API as string,
      SSL_VALIDATION_API: process.env.SSL_VALIDATION_API as string,
      SSL_SUCCESS_BACKEND_URL: process.env.SSL_SUCCESS_BACKEND_URL as string,
      SSL_FAIL_BACKEND_URL: process.env.SSL_FAIL_BACKEND_URL as string,
      SSL_CANCEL_BACKEND_URL: process.env.SSL_CANCEL_BACKEND_URL as string,
      SSL_SUCCESS_FRONTEND_URL: process.env.SSL_SUCCESS_FRONTEND_URL as string,
      SSL_FAIL_FRONTEND_URL: process.env.SSL_FAIL_FRONTEND_URL as string,
      SSL_CANCEL_FRONTEND_URL: process.env.SSL_CANCEL_FRONTEND_URL as string,
    },
  };
};

export const envVars: EnvConfig = loadEnvVariables();
