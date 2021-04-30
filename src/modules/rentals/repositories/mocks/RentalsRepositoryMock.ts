import { ICreateRentalDTO } from "@modules/rentals/dtos/ICreateRentalDTO";

import { Rental } from "../../infra/typeorm/entities/Rental";
import { IRentalsRepository } from "../IRentalsRepository";

export class RentalsRepositoryMock implements IRentalsRepository {
  private rentals: Rental[];

  constructor() {
    this.rentals = [];
  }

  async create({
    car_id,
    user_id,
    expected_return_date,
  }: ICreateRentalDTO): Promise<Rental> {
    const rental = new Rental();

    Object.assign(rental, {
      car_id,
      user_id,
      expected_return_date,
      start_date: new Date(),
    });

    this.rentals.push(rental);

    return rental;
  }

  async findOpenRentalByCarId(id: string): Promise<Rental | undefined> {
    return this.rentals.find(
      (rental) => rental.car_id === id && !rental.end_date
    );
  }

  async findOpenRentalByUserId(id: string): Promise<Rental | undefined> {
    return this.rentals.find(
      (rental) => rental.user_id === id && !rental.end_date
    );
  }
}
