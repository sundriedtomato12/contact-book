const express = require("express");
const router = express.Router();
const Contact = require("../models/contact");
const { getContact, formatString } = require("../functions.js");

// get contacts by search
/**
 * @swagger
 * /contacts/search:
 *  get:
 *    description: Use to get search for contacts with first name or last name that matches search term
 *    responses:
 *      '200':
 *        description: Returns contacts with first name or last name that matches search term
 */
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
    res.status(200).render("searchcontact", { searchResults });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

// Getting contacts
/**
 * @swagger
 * /contacts:
 *  get:
 *    description: Use to get contacts
 *    responses:
 *      '200':
 *        description: Returns list of contacts from database, sorted in ascending order of first name.
 */
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
    res.status(200).render("viewcontacts", { results });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Getting to page to create one contact
/**
 * @swagger
 * /contacts/add:
 *  get:
 *    description: Use to get to page with form to create new contact
 *    responses:
 *      '200':
 *        description: Returns form to create new contact
 */
router.get("/add", (req, res) => {
  res.status(200).render("createcontact");
});

// Creating one contact
/**
 * @swagger
 * /contacts/add:
 *  post:
 *    description: Use to create new contact
 *    responses:
 *      '201':
 *        description: Successfully added new contact to database
 */
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
/**
 * @swagger
 * /contacts/:id:
 *  get:
 *    description: Use to get details of one contact
 *    responses:
 *      '200':
 *        description: Returns details of one contact together with options to edit or delete contact
 */
router.get("/:id", getContact, (req, res) => {
  const contact = res.contact;
  res.status(200).render("viewcontact", { contact });
});

// Getting edit page for one contact
/**
 * @swagger
 * /contacts/:id/edit:
 *  get:
 *    description: Use to get page with form to edit details of selected contact
 *    responses:
 *      '200':
 *        description: Returns form to edit details of contact with details rendered
 */
router.get("/:id/edit", getContact, (req, res) => {
  const contact = res.contact;
  res.status(200).render("editcontact", { contact });
});

// Updating one contact
/**
 * @swagger
 * /contacts/:id:
 *  put:
 *    description: Use to edit details of selected contact
 *    responses:
 *      '200':
 *        description: Successfully edited details of contact
 */
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
    res
      .status(200)
      .send(
        `Successfully edited contact!<br><a href='/'>Back to Main Page</a><br>`
      );
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Deleting one contact
/**
 * @swagger
 * /contacts/:id:
 *  delete:
 *    description: Use to delete contact from database
 *    responses:
 *      '200':
 *        description: Successfully deleted from database
 */
router.delete("/:id", getContact, async (req, res) => {
  try {
    await res.contact.remove();
    res
      .status(200)
      .send(
        `Successfully deleted contact!<br><a href='/'>Back to Main Page</a><br>`
      );
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
