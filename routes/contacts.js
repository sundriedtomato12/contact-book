const express = require("express");
const router = express.Router();
module.exports = router;
const Contact = require("../models/contact");

// get contacts by search
router.get("/search", async (req, res) => {
  const searchResults = {};
  const formattedInput = formatString(req.query.input);
  searchResults.input = formattedInput;
  console.log(req.query.input);
  try {
    searchResults.firstnameResults = await Contact.find({
      firstname: formattedInput,
    });
    searchResults.lastnameResults = await Contact.find({
      lastname: formattedInput,
    });
    res.render("searchcontact", { searchResults });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

// Getting contacts
router.get("/", async (req, res) => {
  const page = parseInt(req.query.page);
  const limit = parseInt(req.query.limit);
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const results = {};
  results.limit = limit;
  results.currentPage = page;

  try {
    // get all contacts first
    const contacts = await Contact.find();
    // sort them according to firstname
    contacts.sort((a, b) =>
      a.firstname > b.firstname ? 1 : b.firstname > a.firstname ? -1 : 0
    );
    results.totalPages = Math.ceil(contacts.length / limit);
    // return only up to limit
    results.results = contacts.slice(startIndex, endIndex);
    res.render("viewcontacts", { results });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Getting to page to create one contact
router.get("/add", (req, res) => {
  res.render("createcontact");
});
// Creating one contact
router.post("/add", async (req, res) => {
  console.log(req.body);
  const contact = new Contact({
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    phonenumber: req.body.phonenumber,
  });

  try {
    const newContact = await contact.save();
    res
      .status(201)
      .send(
        "Successfully added contact!<br><a href='/'>Back to Main Page</a><br>"
      );
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Getting one contact
router.get("/:id", getContact, (req, res) => {
  res.send(res.contact.name);
});

// Updating one contact
router.patch("/:id/edit", getContact, async (req, res) => {
  if (req.body.name != null) {
    res.contact.name = req.body.name;
  }
  if (req.body.phonenumber != null) {
    res.contact.phonenumber = req.body.phonenumber;
  }
  if (req.body.email != null) {
    res.contact.email = req.body.email;
  }

  try {
    const updatedContact = await res.contact.save();
    res.json(updatedContact);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});
// Deleting one contact
router.delete("/:id/delete", getContact, async (req, res) => {
  try {
    await res.contact.remove();
    res.send(`Successfully deleted contact id ${req.params.id}`);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

async function getContact(req, res, next) {
  let contact;
  try {
    contact = await Contact.findById(req.params.id);
    if (contact == null) {
      return res.status(404).json({ message: "Cannot find contact" });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
  res.contact = contact;
  next();
}

function formatString(string) {
  let formattedString = "";
  let i = 1;
  formattedString += string.charAt(0).toUpperCase();
  while (string.length > i) {
    formattedString += string.charAt(i).toLowerCase();
    i++;
  }
  return formattedString;
}
