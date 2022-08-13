const express = require("express");
const router = express.Router();

/**
 * @swagger
 * /:
 *  get:
 *    description: Use to get main page
 *    responses:
 *      '200':
 *        description: A successful response
 */
router.get("/", (req, res) => {
  res.status(200).render("mainpage");
});

module.exports = router;
