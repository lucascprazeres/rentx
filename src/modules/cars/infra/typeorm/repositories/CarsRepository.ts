import { getRepository, Repository } from "typeorm";

import { ICreateCarDTO } from "@modules/cars/dtos/ICreateCarDTO,";
import { ICarsRepository } from "@modules/cars/repositories/ICarsRepository";

import { Car } from "../entities/Car";

export class CarsRepository implements ICarsRepository {
  private repository: Repository<Car>;

  constructor() {
    this.repository = getRepository(Car);
  }

  async findById(id: string): Promise<Car> {
    return this.repository.findOne(id);
  }

  async create({
    id,
    name,
    description,
    license_plate,
    daily_rate,
    fine_amount,
    brand,
    category_id,
    specifications,
  }: ICreateCarDTO): Promise<Car> {
    const car = this.repository.create({
      id,
      name,
      description,
      license_plate,
      daily_rate,
      fine_amount,
      brand,
      category_id,
      specifications,
    });

    await this.repository.save(car);

    return car;
  }
  async findByLicensePlate(license_plate: string): Promise<Car> {
    return this.repository.findOne({ license_plate });
  }

  async findAvailableOnes(
    brand?: string,
    category_id?: string,
    name?: string
  ): Promise<Car[]> {
    const carsQuery = await this.repository
      .createQueryBuilder("car")
      .where("car.available = :available", { available: true });

    if (brand) {
      carsQuery.andWhere("car.brand = :brand", { brand });
    }

    if (name) {
      carsQuery.andWhere("car.name = :name", { name });
    }

    if (category_id) {
      carsQuery.andWhere("car.category_id = :category_id", { category_id });
    }

    const cars = await carsQuery.getMany();
    return cars;
  }

  async updateAvailability(id: string, available: boolean): Promise<void> {
    await this.repository
      .createQueryBuilder()
      .update()
      .set({ available })
      .where("id = :id")
      .setParameters({ id })
      .execute();
  }
}
