import { ICreateRentalDTO } from "@modules/rentals/dtos/ICreateRentalDTO";

import { Rental } from "../Entities/Rental";

export interface IRentalsRepository {
  create(data: ICreateRentalDTO): Promise<Rental>;
  findOpenRentalByCarId(id: string): Promise<Rental | undefined>;
  findOpenRentalByUserId(id: string): Promise<Rental | undefined>;
}
