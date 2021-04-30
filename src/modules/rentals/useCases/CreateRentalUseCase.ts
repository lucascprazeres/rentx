import { inject, injectable } from "tsyringe";

import { IDateProvider } from "@shared/container/providers/DateProvider/IDateProvider";
import { AppError } from "@shared/errors/AppError";

import { Rental } from "../infra/typeorm/entities/Rental";
import { IRentalsRepository } from "../repositories/IRentalsRepository";

interface IRequest {
  car_id: string;
  user_id: string;
  expected_return_date: Date;
}

@injectable()
export class CreateRentalUseCase {
  constructor(
    @inject("RentalsRepository")
    private rentalsRepository: IRentalsRepository,
    @inject("DateProvider")
    private dateProvider: IDateProvider
  ) {}

  async execute({
    car_id,
    user_id,
    expected_return_date,
  }: IRequest): Promise<Rental> {
    const minimumRentalDurationInHours = 24;

    const carUnavailable = await this.rentalsRepository.findOpenRentalByCarId(
      car_id
    );

    if (carUnavailable) {
      throw new AppError("This car is not available.");
    }

    const userHasOpenRental = await this.rentalsRepository.findOpenRentalByUserId(
      user_id
    );

    if (userHasOpenRental) {
      throw new AppError("User has open rental.");
    }

    const dateNow = this.dateProvider.dateNow();

    const rentalDurationInHours = this.dateProvider.getDiffInHours(
      dateNow,
      expected_return_date
    );

    if (rentalDurationInHours < minimumRentalDurationInHours) {
      throw new AppError(
        `every rental should be at least ${minimumRentalDurationInHours} hours long`
      );
    }

    const rental = await this.rentalsRepository.create({
      car_id,
      user_id,
      expected_return_date,
    });

    return rental;
  }
}
