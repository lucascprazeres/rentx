import { getRepository, Repository } from "typeorm";

import { ICreateRentalDTO } from "@modules/rentals/dtos/ICreateRentalDTO";
import { IRentalsRepository } from "@modules/rentals/repositories/IRentalsRepository";

import { Rental } from "../entities/Rental";

export class RentalsRepository implements IRentalsRepository {
  private repository: Repository<Rental>;

  constructor() {
    this.repository = getRepository(Rental);
  }

  async create({
    user_id,
    car_id,
    expected_return_date,
  }: ICreateRentalDTO): Promise<Rental> {
    const rental = this.repository.create({
      user_id,
      car_id,
      expected_return_date,
    });

    await this.repository.save(rental);

    return rental;
  }
  findOpenRentalByCarId(id: string): Promise<Rental> {
    return this.repository.findOne({
      where: [
        {
          car_id: id,
          end_date: null,
        },
      ],
    });
  }
  findOpenRentalByUserId(id: string): Promise<Rental> {
    return this.repository.findOne({
      where: [
        {
          user_id: id,
          end_date: null,
        },
      ],
    });
  }
}
