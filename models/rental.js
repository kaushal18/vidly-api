const mongoose = require("mongoose");
const Joi = require("joi");

const Rental = mongoose.model(
  "Rental",
  new mongoose.Schema({
    customer: {
      type: mongoose.Schema({
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
      }),
      required: true,
    },
    movie: {
      type: new mongoose.Schema({
        title: {
          type: String,
          required: true,
          minlength: 5,
          maxlength: 100,
        },
        dailyRentalRate: {
          type: Number,
          required: true,
          min: 0,
          max: 100,
        },
      }),
      required: true,
    },
    dateOut: {
      type: Date,
      required: true,
      default: Date.now(),
    },
    dateReturned: {
      type: Date,
    },
    rentalFee: {
      type: Number,
      min: 0,
    },
  })
);

// validate mongodb object ID also
// can be validated here using joi-objectid npm package
function validateRental(rental) {
  const schema = {
    customerId: Joi.string().required(),
    movieId: Joi.string().required(),
  };
  return Joi.validate(rental, schema);
}

exports.Rental = Rental;
exports.validate = validateRental;
