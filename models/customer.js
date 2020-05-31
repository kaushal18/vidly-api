const mongoose = require("mongoose");
const Joi = require("joi");

const Customer = mongoose.model(
  "Customer",
  mongoose.Schema({
    name: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 20,
    },
    isGold: {
      type: Boolean,
      default: false,
    },
    phone: {
      type: String,
      required: true,
      minlength: 10,
      maxlength: 10,
    },
  })
);

function validateCustomer(customer) {
  const schema = {
    name: Joi.string().min(3).max(20).required(),
    isGold: Joi.boolean(),
    phone: Joi.string().min(10).max(10).required(),
  };
  return Joi.validate(customer, schema);
}

exports.Customer = Customer;
exports.validate = validateCustomer;