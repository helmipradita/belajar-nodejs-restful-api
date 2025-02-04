import supertest from "supertest";
import {
  createTestUser,
  removeTestUser,
  removeAllTestContact,
} from "./test-util.js";
import { web } from "../src/application/web.js";
import { logger } from "../src/application/logging.js";

describe("POST /api/contacts", function () {
  beforeEach(async () => {
    await createTestUser();
  });

  afterEach(async () => {
    await removeAllTestContact();
    await removeTestUser();
  });

  it("should can create new contact", async () => {
    const result = await supertest(web)
      .post("/api/contacts")
      .set("Authorization", "test-token")
      .send({
        first_name: "test",
        last_name: "test",
        email: "test@test.com",
        phone: "081234567890",
      });

    expect(result.status).toBe(201);
    expect(result.body.data.id).toBeDefined();
    expect(result.body.data.first_name).toBe("test");
    expect(result.body.data.last_name).toBe("test");
    expect(result.body.data.email).toBe("test@test.com");
    expect(result.body.data.phone).toBe("081234567890");
  });

  it("should reject if requst is invalid", async () => {
    const result = await supertest(web)
      .post("/api/contacts")
      .set("Authorization", "test-token")
      .send({
        first_name: "test",
        last_name: "test",
        email: "test",
        phone: "081234567890",
      });

    logger.info(result.body);

    expect(result.status).toBe(400);
    expect(result.body.errors).toBeDefined();
  });
});
