const mongoose = require("mongoose");
const Contact = require("./models/contact");
const faker = require("faker");

mongoose.connect("mongodb://localhost/contacts", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on("error", (error) => console.error(error));
db.once("open", () => console.log("Connected to Database"));

const seedDB = async () => {
  await Contact.deleteMany({});

  let seedProducts = [];

  for (let i = 0; i < 50; i += 1) {
    let newContact = {
      firstname: faker.name.firstName(),
      lastname: faker.name.lastName(),
      phonenumber: faker.phone.phoneNumber(),
    };
    seedProducts.push(newContact);
  }

  await Contact.insertMany(seedProducts);
};

seedDB().then(() => {
  console.log("Data seeded successfully!");
});
