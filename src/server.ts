import "reflect-metadata";
import express from "express";
import "express-async-errors";
import swaggerUi from "swagger-ui-express";

import { globalErrorHandler } from "./middlewares/globalErrorHandler";
import { router } from "./routes";
import swaggerDocs from "./swagger.json";

import "./database/connection";

import "./shared/container";

import "dotenv/config";

const app = express();

app.use(express.json());
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));
app.use(router);
app.use(globalErrorHandler);

export default app;
