import { Request, Response } from "express";
import { container } from "tsyringe";

import { CreateRentalUseCase } from "./CreateRentalUseCase";

export class CreateRentalController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { car_id, expected_return_date } = request.body;

    const user_id = request.user.id;

    const createRental = container.resolve(CreateRentalUseCase);

    const rental = await createRental.execute({
      car_id,
      expected_return_date,
      user_id,
    });

    return response.status(201).json(rental);
  }
}
