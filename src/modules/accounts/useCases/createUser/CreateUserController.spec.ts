import * as request from "supertest";
import { Connection } from "typeorm";

import { app } from "@shared/infra/http/app";
import createConnection from "@shared/infra/typeorm/connection";

let connection: Connection;

describe("CreateUserController", () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.query("DROP TABLE IF EXISTS users;");
    await connection.runMigrations();
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it("should be able to create a new user", async () => {
    const response = await request(app).post("/users").send({
      name: "teste",
      email: "teste@email.com",
      password: "12345",
      driver_license: "1111",
    });

    expect(response.status).toBe(201);
  });

  it("should not be able to create more than one user with a given email", async () => {
    const response = await request(app).post("/users").send({
      name: "teste",
      email: "teste@email.com",
      password: "12345",
      driver_license: "2222",
    });

    expect(response.status).toBe(400);
  });

  it("should not be able to create more than one user with a given driver license", async () => {
    const response = await request(app).post("/users").send({
      name: "teste",
      email: "outro@email.com",
      password: "12345",
      driver_license: "1111",
    });

    expect(response.status).toBe(400);
  });
});
