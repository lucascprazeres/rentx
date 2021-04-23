import { Request, Response } from "express";
import { container } from "tsyringe";

import { CreateCarSpecificationUseCase } from "./CreateCarSpecificationUseCase";

export class CreateCarSpecificationController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;
    const { specifications_ids } = request.body;

    const createCarSpecification = container.resolve(
      CreateCarSpecificationUseCase
    );

    const updatedCar = await createCarSpecification.execute({
      car_id: id as string,
      specifications_ids: specifications_ids as string[],
    });

    return response.json(updatedCar);
  }
}
