import { Request, Response } from "express";
import { container } from "tsyringe";

import { ImportCategoriesFileUseCase } from "./ImportCategoriesFileUseCase";

export class ImportCategoriesFileController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { file } = request;

    const importCategoriesFile = container.resolve(ImportCategoriesFileUseCase);
    await importCategoriesFile.execute(file);

    return response.status(201).send();
  }
}
