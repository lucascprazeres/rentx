import { container } from "tsyringe";

import { ListCategoriesUseCase } from "./ListCategoriesUseCase";

export class ListCategoriesController {
  async handle(request, response): Promise<Response> {
    const listCategories = container.resolve(ListCategoriesUseCase);
    const categories = await listCategories.execute();

    return response.json(categories);
  }
}
