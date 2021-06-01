import { hash } from "bcryptjs";
import * as dayjs from "dayjs";
import * as request from "supertest";
import { Connection } from "typeorm";
import { v4 as uuidV4 } from "uuid";

import { app } from "@shared/infra/http/app";
import createConnection from "@shared/infra/typeorm/connection";

let connection: Connection;

describe("CreateRentalController", () => {
  const firstUserId = uuidV4();
  const secondUserId = uuidV4();
  const firstCarId = uuidV4();
  const secondCarId = uuidV4();

  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();

    const password = await hash("12345", 8);

    await connection.query(
      `INSERT INTO users (id, name, email, password, admin, created_at, driver_license)
      VALUES ('${firstUserId}', 'user1', 'user1@email.com', '${password}', false, now(), 'QEA123')`
    );

    await connection.query(
      `INSERT INTO users (id, name, email, password, admin, created_at, driver_license)
      VALUES ('${secondUserId}', 'user2', 'user2@email.com', '${password}', false, now(), 'ASD456')`
    );

    await connection.query(
      `INSERT INTO cars (id, name, description, daily_rate, available, license_plate, brand, fine_amount, created_at)
      VALUES ('${firstCarId}', 'Fox preto', 'Fox na cor preta', 40, true, 'AWSD1223', 'Wolkswagen', 100, now())`
    );

    await connection.query(
      `INSERT INTO cars (id, name, description, daily_rate, available, license_plate, brand, fine_amount, created_at)
      VALUES ('${secondCarId}', 'Ferrari vermelha', 'ferrari', 40, true, 'HDSJ1223', 'Ferrari', 100, now())`
    );
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it("should be able to rental a car", async () => {
    const responseToken = await request(app).post("/sessions").send({
      email: "user1@email.com",
      password: "12345",
    });

    const { refresh_token } = responseToken.body;

    const response = await request(app)
      .post("/rentals")
      .send({
        car_id: firstCarId,
        expected_return_date: dayjs().add(1, "day").toDate(),
      })
      .set({
        Authorization: `Bearer ${refresh_token}`,
      });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("id");
    expect(response.body).toHaveProperty("expected_return_date");
    expect(response.body).toMatchObject({
      user_id: firstUserId,
      car_id: firstCarId,
    });
  });

  it("should not be able to rental unavailable cars", async () => {
    const responseToken = await request(app).post("/sessions").send({
      email: "user2@email.com",
      password: "12345",
    });

    const { refresh_token } = responseToken.body;

    const response = await request(app)
      .post("/rentals")
      .send({
        car_id: firstCarId, // unavailabe car id
        expected_return_date: dayjs().add(1, "day").toDate(),
      })
      .set({
        Authorization: `Bearer ${refresh_token}`,
      });

    expect(response.status).toBe(400);
  });

  it("should not be able to open two rentals for a user on the same period", async () => {
    const responseToken = await request(app).post("/sessions").send({
      email: "user1@email.com",
      password: "12345",
    });

    const { refresh_token } = responseToken.body;

    const response = await request(app)
      .post("/rentals")
      .send({
        car_id: secondCarId,
        expected_return_date: dayjs().add(1, "day").toDate(),
      })
      .set({
        Authorization: `Bearer ${refresh_token}`,
      });

    expect(response.status).toBe(400);
  });

  it("should not be able to open a rental less than 24h long", async () => {
    const responseToken = await request(app).post("/sessions").send({
      email: "user2@email.com",
      password: "12345",
    });

    const { refresh_token } = responseToken.body;

    const response = await request(app)
      .post("/rentals")
      .send({
        car_id: secondCarId,
        expected_return_date: dayjs().toDate(),
      })
      .set({
        Authorization: `Bearer ${refresh_token}`,
      });

    expect(response.status).toBe(400);
  });
});
