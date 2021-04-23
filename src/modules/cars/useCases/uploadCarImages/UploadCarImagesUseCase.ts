import { inject, injectable } from "tsyringe";

import { IUploadCarImageDTO } from "@modules/cars/dtos/IUploadCarImageDTO";
import { ICarsImagesRepository } from "@modules/cars/repositories/ICarsImagesRepository";

@injectable()
export class UploadCarImagesUseCase {
  constructor(
    @inject("CarImagesRepository")
    private carsImagesRepository: ICarsImagesRepository
  ) {}

  async execute({ car_id, image_names }: IUploadCarImageDTO): Promise<void> {
    image_names.map(async (image) => {
      await this.carsImagesRepository.create(car_id, image);
    });
  }
}
