import { Request, Response } from "express";

import { ImportCategoriesFileUseCase } from "./ImportCategoriesFileUseCase";

export class ImportCategoriesFileController {
  constructor(
    private importCategoriesfileUseCase: ImportCategoriesFileUseCase
  ) {}

  async handle(request: Request, response: Response): Promise<Response> {
    const { file } = request;

    await this.importCategoriesfileUseCase.execute(file);

    return response.send();
  }
}
