const { Rental, validate } = require("../models/rental");
const { Movie } = require("../models/movie");
const { Customer } = require("../models/customer");
const express = require("express");
const router = express.Router();

router.get("/", async (req, res) => {
  const rentals = await Rental.find().sort("-dateOut");
  res.send(rentals);
});

router.get("/:id", async (req, res) => {
  const rental = await Rental.findById(req.params.id);

  if (!rental) res.status(404).send("rental with given id does not exist");
  res.send(rental);
});

router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  // validate objectId before fetching customer
  if (!mongoose.Types.ObjectId.isValid(req.body.customerId))
    return res.status(400).send("Invaid customer");

  const customer = await Customer.findById(req.body.customerId);
  if (!customer) return res.status(400).send("Invaid customer");

  const movie = await Movie.findById(req.body.movieId);
  if (!movie) return res.status(400).send("Invaid movie");

  // check if movie is in stock before renting
  if (movie.numberInStock === 0)
    return res.status(400).send("movie not in stock");

  let rental = new Rental({
    customer: {
      _id: customer._id,
      name: customer.name,
      phone: customer.phone,
      isGold: customer.isGold,
    },
    movie: {
      _id: movie._id,
      title: movie.title,
      dailyRentalRate: movie.dailyRentalRate,
    },
  });
  // todo 2phase commit
  rental = await rental.save();

  movie.numberInStock--;
  await movie.save();

  res.send(rental);
});

module.exports = router;
