import supertest from "supertest";
const {
  createTestUser,
  createTestContact,
  removeAllTestContact,
  removeTestUser,
  removeAllTestAddresses,
  getTestContact,
} = require("./test-util.js");
import { web } from "../src/application/web.js";

describe("POST /api/contacts/:contactId/addresses", function () {
  beforeEach(async () => {
    await createTestUser();
    await createTestContact();
  });

  afterEach(async () => {
    await removeAllTestAddresses();
    await removeAllTestContact();
    await removeTestUser();
  });

  it("should can create address", async () => {
    const testContact = await getTestContact();

    const result = await supertest(web)
      .post(`/api/contacts/${testContact.id}/addresses`)
      .set("Authorization", "test-token")
      .send({
        street: "jalan test",
        city: "kota test",
        province: "provinsi test",
        country: "indonesia",
        postal_code: "123456",
      });

    expect(result.status).toBe(201);
    expect(result.body.data).toEqual({
      id: expect.any(Number),
      street: "jalan test",
      city: "kota test",
      province: "provinsi test",
      country: "indonesia",
      postal_code: "123456",
    });
  });

  it("should reject if contact not found", async () => {
    const testContact = await getTestContact();

    const result = await supertest(web)
      .post(`/api/contacts/${testContact.id + 1}/addresses`)
      .set("Authorization", "test-token")
      .send({
        street: "jalan test",
        city: "kota test",
        province: "provinsi test",
        country: "indonesia",
        postal_code: "123456",
      });

    expect(result.status).toBe(404);
    expect(result.body.errors).toBeDefined();
  });

  it("should reject if request is invalid", async () => {
    const testContact = await getTestContact();

    const result = await supertest(web)
      .post(`/api/contacts/${testContact.id}/addresses`)
      .set("Authorization", "test-token")
      .send({
        street: "jalan test",
        city: "kota test",
        province: "provinsi test",
        country: "indonesia",
      });

    expect(result.status).toBe(400);
    expect(result.body.errors).toBeDefined();
  });
});
