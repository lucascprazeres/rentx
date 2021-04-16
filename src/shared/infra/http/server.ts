import "reflect-metadata";
import * as express from "express";
import "express-async-errors";
import * as swaggerUi from "swagger-ui-express";

import { globalErrorHandler } from "@shared/infra/http/middlewares/globalErrorHandler";

import * as swaggerDocs from "../../../swagger.json";
import createConnection from "../typeorm/connection";
import { router } from "./routes";

import "@shared/container";

import "dotenv/config";

createConnection();

const app = express();

app.use(express.json());
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));
app.use(router);
app.use(globalErrorHandler);

app.listen(3333, () => {
  console.log(`> listening on http://localhost:${3333} 🚀`);
});
