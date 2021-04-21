import { CarsRepositoryMock } from "@modules/cars/repositories/mocks/CarsRepositoryMock";
import { SpecificationsRepositoryMock } from "@modules/cars/repositories/mocks/SpecificationsRepositoryMock";
import { AppError } from "@shared/errors/AppError";

import { CreateCarSpecificationUseCase } from "./CreateCarSpecificationUseCase";

let carsRepository: CarsRepositoryMock;
let specificationsRepository: SpecificationsRepositoryMock;
let createCarSpecification: CreateCarSpecificationUseCase;

describe("CreateCarSpecificationUseCase", () => {
  beforeEach(() => {
    carsRepository = new CarsRepositoryMock();
    specificationsRepository = new SpecificationsRepositoryMock();
    createCarSpecification = new CreateCarSpecificationUseCase(
      carsRepository,
      specificationsRepository
    );
  });

  it("should not be able to add a new specification to a non-existent car", async () => {
    await expect(
      createCarSpecification.execute({
        car_id: "id",
        specifications_ids: ["id"],
      })
    ).rejects.toBeInstanceOf(AppError);
  });

  it("should be able to add a new specification to a car", async () => {
    const car = await carsRepository.create({
      name: "Car name",
      description: "this is a car",
      daily_rate: 100,
      license_plate: "QWE-1234",
      fine_amount: 60,
      brand: "carbrand",
      category_id: "category",
    });

    const specification = await specificationsRepository.create({
      name: "test_specification",
      description: "test_description",
    });

    const updatedCar = await createCarSpecification.execute({
      car_id: car.id,
      specifications_ids: [specification.id],
    });

    expect(updatedCar).toHaveProperty("specifications");
    expect(updatedCar.specifications.length).toBe(1);
  });
});
