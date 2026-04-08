import express from "express";
import { healthRouter } from "./routes/health.routes";
import { swaggerSpec } from "./config/swagger";
import swaggerUi from "swagger-ui-express";
import eventsRoutes from "./routes/events.routes";
import itemsRoutes from "./routes/items.routes";
import authRoutes from "./routes/auth.routes";
import cors from "cors";
import cookieParser from "cookie-parser";

export function createApp() {
  const app = express();

  app.use(
    cors({
      origin: "http://localhost:3000",
      credentials: true,
    }),
  );
  app.use(cookieParser());
  app.use(express.json());

  app.use("/health", healthRouter);
  app.use("/events", eventsRoutes);
  app.use("/items", itemsRoutes);
  app.use("/auth", authRoutes);

  //Swagger UI
  app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

  return app;
}
