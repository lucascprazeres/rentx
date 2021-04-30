import * as dayjs from "dayjs";

import { DayjsDateProvider } from "@shared/container/providers/DateProvider/implementations/DayjsDateProvider";
import { AppError } from "@shared/errors/AppError";

import { RentalsRepositoryMock } from "../repositories/mocks/RentalsRepositoryMock";
import { CreateRentalUseCase } from "./CreateRentalUseCase";

let rentalsRepository: RentalsRepositoryMock;
let dateProvider: DayjsDateProvider;
let createRental: CreateRentalUseCase;

describe("CreateRentalUseCase", () => {
  const date24hoursFromNow = dayjs().add(1, "day").toDate();

  beforeEach(() => {
    rentalsRepository = new RentalsRepositoryMock();
    dateProvider = new DayjsDateProvider();
    createRental = new CreateRentalUseCase(rentalsRepository, dateProvider);
  });

  it("should be able to create a rental", async () => {
    const rental = await createRental.execute({
      car_id: "car1",
      user_id: "user1",
      expected_return_date: date24hoursFromNow,
    });

    expect(rental).toHaveProperty("id");
    expect(rental).toHaveProperty("start_date");
  });

  it("should not be able to rent a car more than once for the same period", async () => {
    const { car_id } = await createRental.execute({
      car_id: "car1",
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
    const { user_id } = await createRental.execute({
      car_id: "car1",
      user_id: "user1",
      expected_return_date: date24hoursFromNow,
    });

    await expect(
      createRental.execute({
        user_id,
        car_id: "car2",
        expected_return_date: date24hoursFromNow,
      })
    ).rejects.toBeInstanceOf(AppError);
  });

  it("should not be able to create a rental below the minimum duration", async () => {
    await expect(
      createRental.execute({
        user_id: "user1",
        car_id: "car1",
        expected_return_date: dayjs().toDate(),
      })
    ).rejects.toBeInstanceOf(AppError);
  });
});
