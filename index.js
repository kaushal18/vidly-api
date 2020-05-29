const mongoose = require("mongoose");
const helmet = require("helmet");
const express = require("express");
const genres = require("./routes/genres");
const customers = require("./routes/customers");

mongoose
  .connect("mongodb://localhost/vidly")
  .then(() => console.log("connected to mongo DB"))
  .catch((err) => console.log("could not connect", err));

const app = express();
app.use(express.json());
app.use(helmet());
app.use("/api/genres", genres);
app.use("/api/customers", customers);

const port = process.env.port || 3000;
app.listen(3000, () => console.log(`listening on port ${port}`));
