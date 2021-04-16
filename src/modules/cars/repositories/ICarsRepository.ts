import { ICreateCarDTO } from "../dtos/ICreateCarDTO,";
import { Car } from "../infra/typeorm/entities/Car";

export interface ICarsRepository {
  create(data: ICreateCarDTO): Promise<Car>;
  findByLicensePlate(license_plate: string): Promise<Car>;
  findAvailableOnes(
    brand?: string,
    category_id?: string,
    name?: string
  ): Promise<Car[]>;
}
