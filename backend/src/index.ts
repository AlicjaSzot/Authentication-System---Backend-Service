import { createApp } from "./app";
import { logger } from "./infrastructure/logger";

const port = process.env.PORT ? Number(process.env.PORT) : 3001;
const app = createApp();

app.listen(port, () => {
  logger.info(`Backend running on http://localhost:${port}`);
  logger.info(`Swagger docs available on http://localhost:${port}/docs`);
});
