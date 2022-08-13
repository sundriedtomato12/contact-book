require("dotenv").config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUI = require("swagger-ui-express");

const swaggerOptions = {
  swaggerDefinition: {
    info: {
      title: "Contact Book Management Website API",
      description: "Contact Book Management Website API Information",
      servers: ["http://localhost:3004"],
    },
  },
  apis: ["./routes/contacts.js", "./routes/main.js"],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerDocs));

mongoose.connect("mongodb://localhost/contacts", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on("error", (error) => console.error(error));
db.once("open", () => console.log("Connected to Database"));

// Configure Express to parse request body data into request.body
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use("/", express.static("public"));
// Override POST requests with query param ?_method=<METHOD> to be <METHOD> requests
app.use(methodOverride("_method"));

const mainRouter = require("./routes/main");
app.use("/", mainRouter);
const contactsRouter = require("./routes/contacts");
app.use("/contacts", contactsRouter);

app.set("view engine", "ejs");

app.listen(3004, () => console.log("Connected to Server: Port 3004"));
