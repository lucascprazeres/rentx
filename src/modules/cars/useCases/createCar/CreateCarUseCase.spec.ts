import { CarsRepositoryMock } from "@modules/cars/repositories/mocks/CarsRepositoryMock";
import { AppError } from "@shared/errors/AppError";

import { CreateCarUseCase } from "./CreateCarUseCase";

let carsRepository: CarsRepositoryMock;
let createCar: CreateCarUseCase;

describe("CreateCarUseCase", () => {
  beforeEach(() => {
    carsRepository = new CarsRepositoryMock();
    createCar = new CreateCarUseCase(carsRepository);
  });

  it("should be able to create a new car", async () => {
    const params = {
      name: "Car name",
      description: "this is a car",
      daily_rate: 100,
      license_plate: "QWE-1234",
      fine_amount: 60,
      brand: "carbrand",
      category_id: "category",
    };

    const car = await createCar.execute(params);

    expect(car.id).toBeTruthy();
    expect(car.created_at).toBeTruthy();
    expect(car).toEqual(expect.objectContaining(params));
  });

  it("should not be able to create two cars with the same license plate", async () => {
    const carParams = {
      name: "Car name 2",
      description: "this is a car",
      daily_rate: 100,
      license_plate: "QWE-1234",
      fine_amount: 60,
      brand: "carbrand",
      category_id: "category",
    };

    await createCar.execute(carParams);

    await expect(createCar.execute(carParams)).rejects.toBeInstanceOf(AppError);
  });

  it("should be able to create cars as available by default", async () => {
    const car = await createCar.execute({
      name: "Available car",
      description: "this is a car",
      daily_rate: 100,
      license_plate: "ABCD-1234",
      fine_amount: 60,
      brand: "carbrand",
      category_id: "category",
    });

    expect(car.available).toBe(true);
  });
});
