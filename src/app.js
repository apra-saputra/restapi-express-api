const express = require("express");
const cors = require("cors");
const route = require("./routes");
const errorHandler = require("./middleware/errorHandler");

const app = express();

app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(route);

// apply error handler as middleware
app.use(errorHandler);

module.exports = app;
