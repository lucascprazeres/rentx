import { Router } from "express";
import * as multer from "multer";

import { CreateCategoryController } from "@modules/cars/useCases/createCategory/CreateCategoryController";
import { ImportCategoriesFileController } from "@modules/cars/useCases/importCategoriesFile/ImportCategoriesfileController";
import { ListCategoriesController } from "@modules/cars/useCases/listCategories/ListCategoriesController";

import { ensureAdmin } from "../middlewares/ensureAdmin";
import { ensureAuthenticated } from "../middlewares/ensureAuthenticated";

const categoriesRoutes = Router();

const upload = multer({ dest: "./tmp" });

const listCategoriesController = new ListCategoriesController();
const createCategoriesController = new CreateCategoryController();
const importCategoriesFileController = new ImportCategoriesFileController();

categoriesRoutes.get("/", listCategoriesController.handle);

categoriesRoutes.post(
  "/",
  ensureAuthenticated,
  ensureAdmin,
  createCategoriesController.handle
);

categoriesRoutes.post(
  "/import",
  ensureAuthenticated,
  ensureAdmin,
  upload.single("file"),
  importCategoriesFileController.handle
);

export { categoriesRoutes };
