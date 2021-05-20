import { inject, injectable } from "tsyringe";

import { ICarsRepository } from "@modules/cars/repositories/ICarsRepository";
import { Rental } from "@modules/rentals/infra/typeorm/entities/Rental";
import { IRentalsRepository } from "@modules/rentals/repositories/IRentalsRepository";
import { IDateProvider } from "@shared/container/providers/DateProvider/IDateProvider";
import { AppError } from "@shared/errors/AppError";

interface IRequest {
  rental_id: string;
}

@injectable()
class DevolutionRentalUseCase {
  constructor(
    @inject("RentalsRepository")
    private rentalsRepository: IRentalsRepository,
    @inject("CarsRepository")
    private carsRepository: ICarsRepository,
    @inject("DateProvider")
    private dateProvider: IDateProvider
  ) {}

  async execute({ rental_id }: IRequest): Promise<Rental> {
    const rental = await this.rentalsRepository.findById(rental_id);

    if (!rental) {
      throw new AppError("This Rental does not exist");
    }

    const dateNow = this.dateProvider.dateNow();

    let daysSpentRenting = this.dateProvider.getDiffInHours(
      rental.start_date,
      dateNow
    );

    if (daysSpentRenting < 1) {
      daysSpentRenting = 1;
    }

    const daysLateToReturnCar = this.dateProvider.getDiffInDays(
      rental.expected_return_date,
      dateNow
    );

    const car = await this.carsRepository.findById(rental.car_id);

    let totalFineAmount = 0;

    if (daysLateToReturnCar > 0) {
      totalFineAmount = daysLateToReturnCar * car.fine_amount;
    }

    const totalRentalAmount =
      daysSpentRenting * car.daily_rate + totalFineAmount;

    rental.total = totalRentalAmount;
    rental.end_date = dateNow;

    await this.rentalsRepository.create(rental);
    await this.carsRepository.updateAvailability(car.id, true);

    return rental;
  }
}

export { DevolutionRentalUseCase };
