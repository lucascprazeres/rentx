import { inject, injectable } from "tsyringe";

import { Car } from "@modules/cars/infra/typeorm/entities/Car";
import { ICarsRepository } from "@modules/cars/repositories/ICarsRepository";
import { ISpecificationsRepository } from "@modules/cars/repositories/ISpecificationsRepository";
import { AppError } from "@shared/errors/AppError";

interface IRequest {
  car_id: string;
  specifications_ids: string[];
}

@injectable()
export class CreateCarSpecificationUseCase {
  constructor(
    @inject("CarsRepository")
    private carsRepository: ICarsRepository,
    @inject("SpecificationsRepository")
    private specificationsRepository: ISpecificationsRepository
  ) {}

  async execute({ car_id, specifications_ids }: IRequest): Promise<Car> {
    const updatedCar = await this.carsRepository.findById(car_id);

    if (!updatedCar) {
      throw new AppError("Invalid car.");
    }

    const specifications = await this.specificationsRepository.findByIds(
      specifications_ids
    );

    updatedCar.specifications = specifications;

    await this.carsRepository.create(updatedCar);

    return updatedCar;
  }
}
