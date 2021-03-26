import express from "express";
import swaggerUi from "swagger-ui-express";

import { router } from "./routes";
import swaggerDocs from "./swagger.json";

import "./database/connection";

const app = express();

app.use(express.json());
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));
app.use(router);

export default app;
