import AddressService from "../service/address-service";

const create = async (req, res, next) => {
  try {
    const user = req.user;
    const request = req.body;
    const contactId = req.params.contactId;

    const result = await AddressService.create(user, contactId, request);

    res.status(201).json({
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export default {
  create,
};
