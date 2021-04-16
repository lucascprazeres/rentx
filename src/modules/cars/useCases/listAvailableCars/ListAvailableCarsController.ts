import { Request, Response } from "express";
import { container } from "tsyringe";

import { ListAvailableCarsUseCase } from "./ListAvailableCarsUseCase";

export class ListAvailableCarsController {
  async handle(request: Request, response: Response): Promise<Response> {
    console.log("hi!");
    const { brand, name, category_id } = request.query;

    const listAvailableCars = container.resolve(ListAvailableCarsUseCase);

    const cars = await listAvailableCars.execute({
      brand: brand as string,
      name: name as string,
      category_id: category_id as string,
    });

    return response.json(cars);
  }
}
