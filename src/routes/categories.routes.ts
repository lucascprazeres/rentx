import { Router } from "express";

import { CategoriesRepository } from "../repositories/CategoriesRepository";

const categoriesRoutes = Router();
const categoriesRepository = new CategoriesRepository();

categoriesRoutes.get("/", async (request, response) => {
  const categories = await categoriesRepository.all();

  return response.json(categories);
});

categoriesRoutes.post("/", async (request, response) => {
  const { name, description } = request.body;

  const foundCategory = await categoriesRepository.findByName(name);

  if (foundCategory) {
    return response.status(400).json({ error: "Category already exists." });
  }

  await categoriesRepository.create({ name, description });

  return response.status(201).send();
});

export { categoriesRoutes };
