import { AppError } from "../../../../errors/AppError";
import { CategoriesRepositoryMock } from "../../repositories/mocks/CategoriesRepositoryMock";
import { CreateCategoryUseCase } from "./CreateCategoryUseCase";

let categoriesRepository: CategoriesRepositoryMock;
let createCategory: CreateCategoryUseCase;

describe("CreateCategoryUseCase", () => {
  beforeEach(() => {
    categoriesRepository = new CategoriesRepositoryMock();
    createCategory = new CreateCategoryUseCase(categoriesRepository);
  });

  it("should be able to create a new category", async () => {
    const params = {
      name: "SUV",
      description: "SUV car",
    };

    await createCategory.execute(params);

    const newCategory = await categoriesRepository.findByName(params.name);

    expect(newCategory).toHaveProperty("id");
    expect(newCategory).toEqual(expect.objectContaining(params));
  });

  it("should not be able to create a new category with existent name", async () => {
    const params = {
      name: "SUV",
      description: "SUV car",
    };

    await createCategory.execute(params);

    await expect(createCategory.execute(params)).rejects.toBeInstanceOf(
      AppError
    );
  });
});
