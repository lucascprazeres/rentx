import * as dayjs from "dayjs";

import { CarsRepositoryMock } from "@modules/cars/repositories/mocks/CarsRepositoryMock";
import { DayjsDateProvider } from "@shared/container/providers/DateProvider/implementations/DayjsDateProvider";
import { AppError } from "@shared/errors/AppError";

import { RentalsRepositoryMock } from "../../repositories/mocks/RentalsRepositoryMock";
import { CreateRentalUseCase } from "./CreateRentalUseCase";

let rentalsRepository: RentalsRepositoryMock;
let dateProvider: DayjsDateProvider;
let carsRepository: CarsRepositoryMock;
let createRental: CreateRentalUseCase;

describe("CreateRentalUseCase", () => {
  const date24hoursFromNow = dayjs().add(1, "day").toDate();

  beforeEach(async () => {
    rentalsRepository = new RentalsRepositoryMock();
    dateProvider = new DayjsDateProvider();
    carsRepository = new CarsRepositoryMock();
    createRental = new CreateRentalUseCase(
      rentalsRepository,
      dateProvider,
      carsRepository
    );
  });

  it("should be able to create a rental", async () => {
    const { id: car_id } = await carsRepository.create({
      name: "car name",
      description: "this is a car",
      license_plate: "ASDF-1234",
      daily_rate: 40,
      fine_amount: 100,
      brand: "carbrand",
      category_id: "category",
    });

    const rental = await createRental.execute({
      car_id,
      user_id: "user1",
      expected_return_date: date24hoursFromNow,
    });

    expect(rental).toHaveProperty("id");
    expect(rental).toHaveProperty("start_date");
  });

  it("should not be able to rent a car more than once for the same period", async () => {
    const { id: car_id } = await carsRepository.create({
      name: "car name",
      description: "this is a car",
      license_plate: "ASDF-1234",
      daily_rate: 40,
      fine_amount: 100,
      brand: "carbrand",
      category_id: "category",
    });

    await createRental.execute({
      car_id,
      user_id: "user1",
      expected_return_date: date24hoursFromNow,
    });

    await expect(
      createRental.execute({
        car_id,
        user_id: "user2",
        expected_return_date: date24hoursFromNow,
      })
    ).rejects.toBeInstanceOf(AppError);
  });

  it("should not be able to create more than one rental for the same user in a period", async () => {
    const { id: car_id } = await carsRepository.create({
      name: "car name",
      description: "this is a car",
      license_plate: "ASDF-1234",
      daily_rate: 40,
      fine_amount: 100,
      brand: "carbrand",
      category_id: "category",
    });

    const { id: second_car_id } = await carsRepository.create({
      name: "car name",
      description: "this is a car",
      license_plate: "ASDF-1234",
      daily_rate: 40,
      fine_amount: 100,
      brand: "carbrand",
      category_id: "category",
    });

    const { user_id } = await createRental.execute({
      car_id,
      user_id: "user1",
      expected_return_date: date24hoursFromNow,
    });

    await expect(
      createRental.execute({
        user_id,
        car_id: second_car_id,
        expected_return_date: date24hoursFromNow,
      })
    ).rejects.toBeInstanceOf(AppError);
  });

  it("should not be able to create a rental below the minimum duration", async () => {
    const { id: car_id } = await carsRepository.create({
      name: "car name",
      description: "this is a car",
      license_plate: "ASDF-1234",
      daily_rate: 40,
      fine_amount: 100,
      brand: "carbrand",
      category_id: "category",
    });

    await expect(
      createRental.execute({
        user_id: "user1",
        car_id,
        expected_return_date: dayjs().toDate(),
      })
    ).rejects.toBeInstanceOf(AppError);
  });
});
