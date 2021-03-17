import { Router } from "express";

import { SpecificationsRepository } from "../modules/cars/repositories/implementations/SpecificationsRepository";
import { CreateSpecificationService } from "../modules/cars/services/CreateSpecificationService";

const specificationsRoutes = Router();

const specificationsRepository = new SpecificationsRepository();

specificationsRoutes.post("/", async (request, response) => {
  try {
    const { name, description } = request.body;

    const createSpecification = new CreateSpecificationService(
      specificationsRepository
    );

    await createSpecification.execute({ name, description });

    return response.status(201).send();
  } catch (error) {
    return response.status(400).json({ error: error.message });
  }
});

export { specificationsRoutes };
