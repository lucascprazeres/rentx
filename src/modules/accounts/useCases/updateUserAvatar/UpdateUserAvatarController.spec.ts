import { hash } from "bcryptjs";
import * as request from "supertest";
import { Connection } from "typeorm";
import { v4 as uuidV4 } from "uuid";

import { app } from "@shared/infra/http/app";
import createConnection from "@shared/infra/typeorm/connection";

let connection: Connection;

describe("CreateUserController", () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.query("DROP TABLE IF EXISTS users;");
    await connection.runMigrations();

    const id = uuidV4();
    const password = await hash("12345", 8);

    await connection.query(
      `INSERT INTO users (id, name, email, password, admin, created_at, driver_license)
      VALUES ('${id}', 'teste', 'teste@email.com', '${password}', false, now(), 'QEA123')`
    );
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();

    // TODO - delete mock avatar after tests are loaded
  });

  it("should be able to update a users avatar", async () => {
    const authResponse = await request(app).post("/sessions").send({
      email: "teste@email.com",
      password: "12345",
    });

    const { refresh_token } = authResponse.body;

    const mockFile = Buffer.from("this is the file");

    const response = await request(app)
      .patch("/users/avatar")
      .set({
        Authorization: `Bearer ${refresh_token}`,
      })
      .attach("avatar", mockFile, "rentxtestmock.jpg");

    expect(response.status).toBe(204);
  });

  it("should not be able to update a non-existent users avatar", async () => {
    const authResponse = await request(app).post("/sessions").send({
      email: "teste@email.com",
      password: "12345",
    });

    const { refresh_token } = authResponse.body;

    await connection.query("DELETE FROM users WHERE email = 'teste@email.com'");

    const mockFile = Buffer.from("this is the file");

    const response = await request(app)
      .patch("/users/avatar")
      .set({
        Authorization: `Bearer ${refresh_token}`,
      })
      .attach("avatar", mockFile, "rentxtestmock.jpg");

    expect(response.status).toBe(401);
  });
});
