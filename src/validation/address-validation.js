const Joi = require("joi");

const createAddressValidation = Joi.object({
  street: Joi.string().max(255).optional(),
  city: Joi.string().max(100).optional(),
  province: Joi.string().max(100).optional(),
  country: Joi.string().max(100).required(),
  postal_code: Joi.string().max(10).required(),
});

const getAddressesValidation = Joi.number().min(1).positive().required();

module.exports = {
  createAddressValidation,
  getAddressesValidation,
};
