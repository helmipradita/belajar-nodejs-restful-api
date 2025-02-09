import { prismaClient } from "../application/database.js";
import { ResponseError } from "../error/response-error.js";
import {
  createAddressValidation,
  getAddressesValidation,
  updateAddressValidation,
} from "../validation/address-validation";
import { getContactValidation } from "../validation/contact-validation.js";
import { validate } from "../validation/validation.js";

const checkContactMustExist = async (user, contactId) => {
  contactId = validate(getContactValidation, contactId);

  const totalContactInDatabase = await prismaClient.contact.count({
    where: {
      id: contactId,
      username: user.username,
    },
  });

  if (totalContactInDatabase !== 1) {
    throw new ResponseError(404, "contact not found");
  }

  return contactId;
};

const create = async (user, contactId, request) => {
  contactId = await checkContactMustExist(user, contactId);

  const address = validate(createAddressValidation, request);
  address.contact_id = contactId;

  return prismaClient.address.create({
    data: address,
    select: {
      id: true,
      street: true,
      city: true,
      province: true,
      country: true,
      postal_code: true,
    },
  });
};

const get = async (user, contactId, addressId) => {
  contactId = await checkContactMustExist(user, contactId);
  addressId = validate(getAddressesValidation, addressId);

  const address = await prismaClient.address.findFirst({
    where: {
      id: addressId,
      contact_id: contactId,
    },
    select: {
      id: true,
      street: true,
      city: true,
      province: true,
      country: true,
      postal_code: true,
    },
  });

  if (!address) {
    throw new ResponseError(404, "address not found");
  }

  return address;
};

const update = async (user, contactId, request) => {
  contactId = await checkContactMustExist(user, contactId);
  const address = validate(updateAddressValidation, request);

  const totalAddressInDatabase = await prismaClient.address.count({
    where: {
      id: address.id,
      contact_id: contactId,
    },
  });

  if (!totalAddressInDatabase) {
    throw new ResponseError(404, "address not found");
  }

  return prismaClient.address.update({
    where: {
      id: address.id,
    },
    data: {
      street: address.street,
      city: address.city,
      province: address.province,
      country: address.country,
      postal_code: address.postal_code,
    },
    select: {
      id: true,
      street: true,
      city: true,
      province: true,
      country: true,
      postal_code: true,
    },
  });
};

const remove = async (user, contactId, addressId) => {
  contactId = await checkContactMustExist(user, contactId);
  addressId = validate(getAddressesValidation, addressId);

  const totalAddressInDatabase = await prismaClient.address.count({
    where: {
      id: addressId,
      contact_id: contactId,
    },
  });

  if (!totalAddressInDatabase) {
    throw new ResponseError(404, "address not found");
  }

  return prismaClient.address.delete({
    where: {
      id: addressId,
    },
  });
};

export default {
  create,
  get,
  update,
  remove,
};
