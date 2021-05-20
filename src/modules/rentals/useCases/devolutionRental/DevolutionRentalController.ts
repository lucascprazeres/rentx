import { Request, Response } from "express";
import { container } from "tsyringe";

import { DevolutionRentalUseCase } from "./DevolutionRentalUseCase";

class DevolutionRentalController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { id: rental_id } = request.params;

    const devolutionRental = container.resolve(DevolutionRentalUseCase);

    const rental = await devolutionRental.execute({
      rental_id,
    });

    return response.json(rental);
  }
}

export { DevolutionRentalController };
