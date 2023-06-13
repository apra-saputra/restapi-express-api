import express from "express";
import cors from "cors";
import fileUpload from "express-fileupload";
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

import route from "./routes/index.js";
import errorHandler from "./middleware/errorHandler.js";

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

const specs = swaggerJSDoc(options);

app.use("/docs", swaggerUi.serve, swaggerUi.setup(specs));

// express use lib
app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static("public/images"));
app.use(fileUpload());

app.use(route);

// apply error handler as middleware
app.use(errorHandler);

export default app;
