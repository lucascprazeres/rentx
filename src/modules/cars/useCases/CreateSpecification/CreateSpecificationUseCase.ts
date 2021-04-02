import { inject, injectable } from "tsyringe";

import { AppError } from "../../../../errors/AppError";
import {
  ICreateSpecificationDTO,
  ISpecificationsRepository,
} from "../../repositories/ISpecificationsRepository";

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
