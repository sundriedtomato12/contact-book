const Contact = require("./models/contact.js");

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

module.exports = { getContact, formatString };
