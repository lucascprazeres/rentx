import {
  ICreateSpecificationDTO,
  ISpecificationsRepository,
} from "../../repositories/ISpecificationsRepository";

export class CreateSpecificationUseCase {
  constructor(private specificationsRepository: ISpecificationsRepository) {}

  async execute({ name, description }: ICreateSpecificationDTO): Promise<void> {
    const foundSpecification = await this.specificationsRepository.findByName(
      name
    );

    if (foundSpecification) {
      throw new Error("Specification already exists.");
    }

    await this.specificationsRepository.create({
      name,
      description,
    });
  }
}
