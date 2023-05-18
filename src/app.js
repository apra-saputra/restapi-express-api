const express = require("express");
const cors = require("cors");
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const route = require("./routes");
const errorHandler = require("./middleware/errorHandler");

const app = express();

const options = {
  definition: {
    swagger: "2.0",
    title: "EXPRESS-WORKFLOW-API",
    openapi: "3.1.0",
    info: {
      title: "EXPRESS WORKFLOW API DOCS",
      description: "Deskripsi API Anda",
    },
    schemes: ["dev-sandbox"],
  },
  apis: ["./src/routes/index.js", "./src/routes/*.js"],
};

const specs = swaggerJsdoc(options);

app.use("/docs", swaggerUi.serve, swaggerUi.setup(specs));

app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(route);

// apply error handler as middleware
app.use(errorHandler);

module.exports = app;
