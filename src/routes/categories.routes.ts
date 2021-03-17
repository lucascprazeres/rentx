import { Router } from "express";

import { CategoriesRepository } from "../modules/cars/repositories/CategoriesRepository";
import { createCategoryController } from "../modules/cars/useCases/createCategory";

const categoriesRoutes = Router();

const categoriesRepository = new CategoriesRepository();

categoriesRoutes.get("/", async (request, response) => {
  const categories = await categoriesRepository.all();

  return response.json(categories);
});

categoriesRoutes.post("/", (request, response) => {
  return createCategoryController.handle(request, response);
});

export { categoriesRoutes };
