import express from "express";
import { healthRouter } from "./routes/health.routes";
import { swaggerSpec } from "./config/swagger";
import swaggerUi from "swagger-ui-express";
import eventsRoutes from "./routes/events.routes";
import itemsRoutes from "./routes/items.routes";

export function createApp() {
  const app = express();

  app.use(express.json());

  app.use("/health", healthRouter);
  app.use("/events", eventsRoutes);
  app.use("/items", itemsRoutes);

  //Swagger UI
  app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

  return app;
}
