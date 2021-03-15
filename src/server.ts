import express from "express";

import { categoriesRoutes } from "./routes/categories.routes";

const app = express();

app.use(express.json());
app.use("/categories", categoriesRoutes);

app.get("/", (request, response) => {
  return response.send("Hello, World!");
});

export default app;
