import { Server } from "http";
import mongoose from "mongoose";
import app from "./app";
import { envVars } from "./app/config/env";

let server: Server;

const startServer = async () => {
  try {
    await mongoose.connect(envVars.DB_URL);

    server = app.listen(envVars.PORT, () => {
      // eslint-disable-next-line no-console
      console.log(`Server is running on port ${envVars.PORT}`);
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(error);
  }
};

startServer();

// Unhandled Promise Rejection
process.on("unhandledRejection", (err) => {
  // eslint-disable-next-line no-console
  console.log("Unhandled Rejection is detected, we are closing our server", err);

  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }

  process.exit(1);
});

// Uncaught Exception Error
process.on("uncaughtException", () => {
  // eslint-disable-next-line no-console
  console.log("Uncaught Exception is detected, we are closing our server");

  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }

  process.exit(1);
});

// SIGTERM
process.on("SIGTERM", () => {
  // eslint-disable-next-line no-console
  console.log("SIGTERM is received, we are closing our server");

  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }

  process.exit(1);
});

// SIGINT
process.on("SIGINT", () => {
  // eslint-disable-next-line no-console
  console.log("SIGINT is received, we are closing our server");

  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }

  process.exit(1);
});
