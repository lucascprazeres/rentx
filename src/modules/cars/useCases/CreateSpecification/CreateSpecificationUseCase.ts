import { inject, injectable } from "tsyringe";

import {
  ISpecificationsRepository,
  ICreateSpecificationDTO,
} from "@modules/cars/repositories/ISpecificationsRepository";
import { AppError } from "@shared/errors/AppError";

@injectable()
export class CreateSpecificationUseCase {
  constructor(
    @inject("SpecificationsRepository")
    private specificationsRepository: ISpecificationsRepository
  ) {}

  async execute({ name, description }: ICreateSpecificationDTO): Promise<void> {
    const foundSpecification = await this.specificationsRepository.findByName(
      name
    );

    if (foundSpecification) {
      throw new AppError("Specification already exists.");
    }

    await this.specificationsRepository.create({
      name,
      description,
    });
  }
}
