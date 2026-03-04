import swaggerJSDoc from "swagger-jsdoc";

export const swaggerSpec = swaggerJSDoc({
  definition: {
    openapi: "3.0.0",
    info: {
      title: "EventBridge Lab API",
      version: "1.0.0",
      description:
        "Learning project: Express -> EventBridge -> SQS -> Lambda -> DB",
    },
    servers: [{ url: "http://localhost:3001", description: "Local" }],
  },
  apis: ["./src/**/*.ts"],
});
