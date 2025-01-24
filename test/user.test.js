import supertest from "supertest";
import { web } from "../src/application/web.js";
import { logger } from "../src/application/logging.js";
import { createTestUser, getTestUser, removeTestUser } from "./test-util.js";
import bcrypt from "bcrypt";

describe("POST /api/users", function () {
  afterEach(async () => {
    await removeTestUser();
  });

  it("should can register new user", async () => {
    const result = await supertest(web).post("/api/users").send({
      username: "test",
      password: "rahasia123",
      name: "test test",
    });

    expect(result.status).toBe(201);
    expect(result.body.data).toEqual({
      username: "test",
      name: "test test",
    });
    expect(result.body.data.password).toBeUndefined();
  });

  it("should reject if request is invalid", async () => {
    const result = await supertest(web).post("/api/users").send({
      username: "",
      password: "",
      name: "",
    });

    logger.info(result.body);

    expect(result.status).toBe(400);
    expect(result.body.errors).toBeDefined();
  });

  it("should reject if username already registered", async () => {
    let result = await supertest(web).post("/api/users").send({
      username: "test",
      password: "rahasia123",
      name: "test test",
    });

    expect(result.status).toBe(201);
    expect(result.body.data).toEqual({
      username: "test",
      name: "test test",
    });
    expect(result.body.data.password).toBeUndefined();

    result = await supertest(web).post("/api/users").send({
      username: "test",
      password: "rahasia123",
      name: "test test",
    });

    logger.info(result.body);

    expect(result.status).toBe(400);
    expect(result.body.errors).toBeDefined();
  });
});

describe("POST /api/users/login", function () {
  beforeEach(async () => {
    await createTestUser();
  });

  afterEach(async () => {
    await removeTestUser();
  });

  it("should can login with correct credential", async () => {
    const result = await supertest(web).post("/api/users/login").send({
      username: "test",
      password: "rahasia123",
    });

    logger.info(result.body);

    expect(result.status).toBe(200);
    expect(result.body.data.token).toBeDefined();
    expect(result.body.data.token).not.toBe("test-token");
  });

  it("should reject if request is invalid", async () => {
    const result = await supertest(web).post("/api/users/login").send({
      username: "",
      password: "",
    });

    logger.info(result.body);

    expect(result.status).toBe(400);
    expect(result.body.errors).toBeDefined();
  });

  it("should reject if password is wrong", async () => {
    const result = await supertest(web).post("/api/users/login").send({
      username: "test",
      password: "salah",
    });

    expect(result.status).toBe(401);
    expect(result.body.errors).toBeDefined();
  });

  it("should reject if username is wrong", async () => {
    const result = await supertest(web).post("/api/users/login").send({
      username: "salah",
      password: "salah",
    });

    expect(result.status).toBe(401);
    expect(result.body.errors).toBeDefined();
  });
});

describe("GET /api/users/current", function () {
  beforeEach(async () => {
    await createTestUser();
  });

  afterEach(async () => {
    await removeTestUser();
  });

  it("should can get current user", async () => {
    const result = await supertest(web)
      .get("/api/users/current")
      .set("Authorization", "test-token");

    expect(result.status).toBe(200);
    expect(result.body.data).toEqual({
      username: "test",
      name: "test test",
    });
  });

  it("should reject if token is invalid", async () => {
    const result = await supertest(web)
      .get("/api/users/current")
      .set("Authorization", "salah");

    expect(result.status).toBe(401);
    expect(result.body.errors).toBeDefined();
  });
});

describe("PATCH /api/users/current", function () {
  beforeEach(async () => {
    await createTestUser();
  });

  afterEach(async () => {
    await removeTestUser();
  });

  it("should can update current user", async () => {
    const result = await supertest(web)
      .patch("/api/users/current")
      .set("Authorization", "test-token")
      .send({
        name: "test test test",
        password: "rahasia123lagi",
      });

    expect(result.status).toBe(200);
    expect(result.body.data).toEqual({
      username: "test",
      name: "test test test",
    });

    const user = await getTestUser();
    expect(await bcrypt.compare("rahasia123lagi", user.password)).toBe(true);
  });

  it("should can update user username only", async () => {
    const result = await supertest(web)
      .patch("/api/users/current")
      .set("Authorization", "test-token")
      .send({
        username: "test",
      });

    expect(result.status).toBe(200);
    expect(result.body.data).toEqual({
      username: "test",
      name: "test test",
    });
  });

  it("should can update user name", async () => {
    const result = await supertest(web)
      .patch("/api/users/current")
      .set("Authorization", "test-token")
      .send({
        name: "test test test",
      });

    expect(result.status).toBe(200);
    expect(result.body.data).toEqual({
      username: "test",
      name: "test test test",
    });
  });

  it("should can update user password", async () => {
    const result = await supertest(web)
      .patch("/api/users/current")
      .set("Authorization", "test-token")
      .send({
        password: "rahasia123lagi",
      });

    expect(result.status).toBe(200);
    expect(result.body.data).toEqual({
      username: "test",
      name: "test test",
    });

    const user = await getTestUser();
    expect(await bcrypt.compare("rahasia123lagi", user.password)).toBe(true);
  });

  it("should reject if token is invalid", async () => {
    const result = await supertest(web)
      .patch("/api/users/current")
      .set("Authorization", "salah")
      .send({
        username: "test",
        password: "rahasia123",
        name: "test test test",
      });

    expect(result.status).toBe(401);
    expect(result.body.errors).toBeDefined();
  });

  it("should reject if request is invalid", async () => {
    const result = await supertest(web)
      .patch("/api/users/current")
      .set("Authorization", "test-token")
      .send({
        username: "",
        password: "",
        name: "",
      });

    expect(result.status).toBe(400);
    expect(result.body.errors).toBeDefined();
  });

  it("should reject if name is empty", async () => {
    const result = await supertest(web)
      .patch("/api/users/current")
      .set("Authorization", "test-token")
      .send({
        name: "",
      });

    expect(result.status).toBe(400);
    expect(result.body.errors).toBeDefined();
  });
});
