import { Request, Response } from "express";
import { container } from "tsyringe";

import { UploadCarImagesUseCase } from "./UploadCarImagesUseCase";

interface IFile {
  filename: string;
}

export class UploadCarImagesController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;
    const images = request.files as IFile[];

    const image_names = images.map((file) => file.filename);

    const uploadCarImages = container.resolve(UploadCarImagesUseCase);

    await uploadCarImages.execute({
      car_id: id,
      image_names,
    });

    return response.status(201).send();
  }
}
