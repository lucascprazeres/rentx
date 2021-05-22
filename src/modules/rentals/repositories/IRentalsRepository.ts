import { ICreateRentalDTO } from "@modules/rentals/dtos/ICreateRentalDTO";

import { Rental } from "../infra/typeorm/entities/Rental";

export interface IRentalsRepository {
  create(data: ICreateRentalDTO): Promise<Rental>;
  findOpenRentalByCarId(id: string): Promise<Rental | undefined>;
  findOpenRentalByUserId(id: string): Promise<Rental | undefined>;
  findAllByUserId(id: string): Promise<Rental[]>;
  findById(id: string): Promise<Rental>;
}
