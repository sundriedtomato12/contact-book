require("dotenv").config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");

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

const contactsRouter = require("./routes/contacts");
app.use("/contacts", contactsRouter);

// Getting main page
app.get("/", (req, res) => {
  res.render("mainpage");
});

app.set("view engine", "ejs");

app.listen(3004, () => console.log("Connected to Server: Port 3004"));
