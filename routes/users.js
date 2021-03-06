"use strict";

/** Routes for users. */

const jsonschema = require("jsonschema");

const express = require("express");
const { ensureCorrectUserOrAdmin, ensureAdmin } = require("../middleware/auth");
const { BadRequestError } = require("../expressError");
const User = require("../models/user");
const { createToken } = require("../helpers/tokens");
const userNewSchema = require("../schemas/userNew.json");
const userUpdateSchema = require("../schemas/userUpdate.json");
const userBookSchema = require("../schemas/userBook.json");
const router = express.Router();


/** POST / { user }  => { user, token }
 *
 * Adds a new user. This is not the registration endpoint --- instead, this is
 * only for admin users to add new users. The new user being added can be an
 * admin.
 *
 * This returns the newly created user and an authentication token for them:
 *  {user: { username, firstName, lastName, email, isAdmin }, token }
 *
 * Authorization required: admin
 **/

router.post("/", async function (req, res, next) {
  try {
    const validator = jsonschema.validate(req.body, userNewSchema);
    if (!validator.valid) {
     const errs = validator.errors.map(e => e.stack);
     throw new BadRequestError(errs);
   }

    const user = await User.register(req.body);
    const token = createToken(user);
    return res.status(201).json({ user, token });
  } catch (err) {
    return next(err);
  }
});


/** GET / => { users: [ {firstName, lastName, email, isAdmin }, ... ] }
 *
 * Returns list of all users.
 *
 * Authorization required: admin
 **/

router.get("/", async function (req, res, next) {
  try {
    const users = await User.findAll();
    return res.json({ users });
  } catch (err) {
    return next(err);
  }
});


/** GET /[username] => { user }
 *
 * Returns { id, firstName, lastName, isAdmin, listings, bookings, messages }
 *   where listings is { id, address, unit, city, state, zip, country, owner_id, title, description, photo_url, price_per_hour, min_hours }
 *   where bookings is { id, listing_id, renter_id, start_date, num_hours, total_price, booked_at }
 *   where messages is { listing_id, from_user_id, to_user_id, message, time}
 * 
 * TODO: Authorization required: admin or same user-as-:username
 **/

router.get("/:id", async function (req, res, next) {
  try {
    console.log("getting user")
    const user = await User.get(req.params.id);
    return res.json({ user });
  } catch (err) {
    return next(err);
  }
});


/** PATCH /[username] { user } => { user }
 *
 * Data can include:
 *   { firstName, lastName, password, bio }
 *
 * Returns {id, firstName, lastName, email, bio, isAdmin }
 *
 * Authorization required: admin or same-user-as-:username
 **/

router.patch("/:id", async function (req, res, next) {
  try {
    const validator = jsonschema.validate(req.body, userUpdateSchema);
    if (!validator.valid) {
     const errs = validator.errors.map(e => e.stack);
     throw new BadRequestError(errs);
    }

    const user = await User.update(req.params.id, req.body);
    return res.json({ user });} 
    catch (err) {
    return next(err);
  }
});


/** DELETE /[id]  =>  { deleted: id }
 *
 * Authorization required: admin or same-user-as-:username
 **/

router.delete("/:id", async function (req, res, next) {
  try {
    await User.remove(req.params.id);
    return res.json({ deleted: req.params.id });
  } catch (err) {
    return next(err);
  }
});

// --------------------- BOOKING ------------------------
/** POST /[id]/book/
 *
 * Returns {"booked": listingId}
 *
 * Authorization required: admin or same-user-as-:username
 * */


router.post("/:id/book/", async function (req, res, next) {
  try {
    const validator = jsonschema.validate(req.body, userBookSchema);
    if (!validator.valid) {
     const errs = validator.errors.map(e => e.stack);
     throw new BadRequestError(errs);
    }
    await User.bookListing(req.params.id, req.body);
    return res.json({ applied: req.body.listingId });
  } catch (err) {
    return next(err);
  }
});



module.exports = router;
