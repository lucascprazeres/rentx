import { Router } from "express";

import { CategoriesRepository } from "../modules/cars/repositories/CategoriesRepository";
import { CreateCategoryService } from "../modules/cars/services/CreateCategoryService";

const categoriesRoutes = Router();
const categoriesRepository = new CategoriesRepository();

categoriesRoutes.get("/", async (request, response) => {
  const categories = await categoriesRepository.all();

  return response.json(categories);
});

categoriesRoutes.post("/", async (request, response) => {
  try {
    const { name, description } = request.body;

    const createCategory = new CreateCategoryService(categoriesRepository);

    await createCategory.execute({ name, description });

    return response.status(201).send();
  } catch (error) {
    return response.status(400).json({ error: error.message });
  }
});

export { categoriesRoutes };
