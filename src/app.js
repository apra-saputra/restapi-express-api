import express from "express";
import cors from "cors";
import fileUpload from "express-fileupload";

import route from "./routes/index.js";
import errorHandler from "./middleware/errorHandler.js";

const app = express();

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
