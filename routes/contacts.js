const express = require("express");
const router = express.Router();
const Contact = require("../models/contact");
const { getContact, formatString } = require("../functions.js");

// get contacts by search
router.get("/search", async (req, res) => {
  const searchResults = {};
  const formattedInput = formatString(req.query.input);
  searchResults.input = formattedInput;
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
    const contacts = await Contact.find().sort({ firstname: "asc" });
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
  const formattedFN = formatString(req.body.firstname);
  const formattedLN = formatString(req.body.lastname);
  const contact = new Contact({
    firstname: formattedFN,
    lastname: formattedLN,
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
  const contact = res.contact;
  res.render("viewcontact", { contact });
});

// Getting edit page for one contact
router.get("/:id/edit", getContact, (req, res) => {
  const contact = res.contact;
  res.render("editcontact", { contact });
});

// Updating one contact
router.put("/:id", getContact, async (req, res) => {
  if (req.body.firstname != null) {
    res.contact.firstname = req.body.firstname;
  }
  if (req.body.lastname != null) {
    res.contact.lastname = req.body.lastname;
  }
  if (req.body.phonenumber != null) {
    res.contact.phonenumber = req.body.phonenumber;
  }

  try {
    const updatedContact = await res.contact.save();
    res.send(
      `Successfully edited contact!<br><a href='/'>Back to Main Page</a><br>`
    );
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Deleting one contact
router.delete("/:id", getContact, async (req, res) => {
  try {
    await res.contact.remove();
    res.send(
      `Successfully deleted contact!<br><a href='/'>Back to Main Page</a><br>`
    );
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
