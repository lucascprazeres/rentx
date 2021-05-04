import { SpecificationsRepositoryMock } from "@modules/cars/repositories/mocks/SpecificationsRepositoryMock";
import { AppError } from "@shared/errors/AppError";

import { CreateSpecificationUseCase } from "./CreateSpecificationUseCase";

let specificationsRepository: SpecificationsRepositoryMock;
let createSpecification: CreateSpecificationUseCase;

describe("CreateSpecificationUseCase", () => {
  beforeEach(() => {
    specificationsRepository = new SpecificationsRepositoryMock();
    createSpecification = new CreateSpecificationUseCase(
      specificationsRepository
    );
  });

  it("should be able to create a new specification", async () => {
    await createSpecification.execute({
      name: "New spec",
      description: "This is a test specification",
    });

    const specification = await specificationsRepository.findByName("New spec");

    expect(specification).toHaveProperty("id");
    expect(specification).toHaveProperty("created_at");
    expect(specification).toMatchObject({
      name: "New spec",
      description: "This is a test specification",
    });
  });

  it("should not be able to create more than one spec with a given name", async () => {
    await createSpecification.execute({
      name: "New spec",
      description: "This is a test specification",
    });

    expect(
      createSpecification.execute({
        name: "New spec",
        description: "This is a test specification",
      })
    ).rejects.toBeInstanceOf(AppError);
  });
});
