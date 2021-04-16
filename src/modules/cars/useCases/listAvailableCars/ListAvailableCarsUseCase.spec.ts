import { CarsRepositoryMock } from "@modules/cars/repositories/mocks/CarsRepositoryMock";

import { ListAvailableCarsUseCase } from "./ListAvailableCarsUseCase";

let carsRepository: CarsRepositoryMock;
let listAvailableCars: ListAvailableCarsUseCase;

describe("ListAvailableCarsUseCase", () => {
  beforeEach(() => {
    carsRepository = new CarsRepositoryMock();
    listAvailableCars = new ListAvailableCarsUseCase(carsRepository);
  });

  it("should be able to list available cars", async () => {
    const createdCar = await carsRepository.create({
      name: "Car name",
      description: "this is a car",
      daily_rate: 100,
      license_plate: "QWE-1234",
      fine_amount: 60,
      brand: "carbrand",
      category_id: "category",
    });

    const cars = await listAvailableCars.execute({});

    expect(cars).toEqual([createdCar]);
  });

  it("should be able to list available cars by brand", async () => {
    const createdCar = await carsRepository.create({
      name: "Car name",
      description: "this is a car",
      daily_rate: 100,
      license_plate: "QWE-1234",
      fine_amount: 60,
      brand: "carbrand",
      category_id: "category",
    });

    const cars = await listAvailableCars.execute({ brand: "carbrand" });

    expect(cars).toEqual([createdCar]);
  });

  it("should be able to list available cars by name", async () => {
    const createdCar = await carsRepository.create({
      name: "Car name",
      description: "this is a car",
      daily_rate: 100,
      license_plate: "QWE-1234",
      fine_amount: 60,
      brand: "carbrand",
      category_id: "category",
    });

    const cars = await listAvailableCars.execute({ name: "Car name" });

    expect(cars).toEqual([createdCar]);
  });

  it("should be able to list available cars by category id", async () => {
    const createdCar = await carsRepository.create({
      name: "Car name",
      description: "this is a car",
      daily_rate: 100,
      license_plate: "QWE-1234",
      fine_amount: 60,
      brand: "carbrand",
      category_id: "category",
    });

    const cars = await listAvailableCars.execute({ category_id: "category" });

    expect(cars).toEqual([createdCar]);
  });
});
