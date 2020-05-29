const mongoose = require("mongoose");
const express = require("express");
const Joi = require("joi");
const router = express.Router();

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

router.get("/", async (req, res) => {
  const customers = await Customer.find().sort("name");
  res.send(customers);
});

router.get("/:id", async (req, res) => {
  const customer = await Customer.findById(req.params.id);

  if (!customer) res.status(404).send("customer with given id does not exist");
  res.send(customer);
});

router.post("/", async (req, res) => {
  const { error } = validateCustomer(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let customer = new Customer({
    name: req.body.name,
    isGold: req.body.isGold,
    phone: req.body.phone,
  });
  customer = await customer.save();

  res.send(customer);
});

router.put("/:id", async (req, res) => {
  // validate customer then update
  const { error } = validateCustomer(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const customer = await Customer.findByIdAndUpdate(
    req.params.id,
    { name: req.body.name, isGold: req.body.isGold, phone: req.body.phone },
    { new: true }
  );

  if (!customer) res.status(404).send("customer with given id does not exist");

  res.send(customer);
});

router.delete("/:id", async (req, res) => {
  const customer = await Customer.findByIdAndRemove(req.params.id);

  if (!customer) res.status(404).send("customer with given id does not exist");

  res.send(customer);
});

module.exports = router;
