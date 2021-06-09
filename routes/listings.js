"use strict";
/** Routes for listings. */
const jsonschema = require("jsonschema");
const express = require("express");
const { BadRequestError } = require("../expressError");
const { ensureAdmin } = require("../middleware/auth");
const Listing = require("../models/Listing");


const listingsNewSchema = require("../schemas/listingsNew.json");
const listingUpdateSchema = require("../schemas/listingUpdate.json");

const router = express.Router({ mergeParams: true });

/** POST / { listing } => { id, ...listing }
 *
 * listing should be { address, 
                        unit,
                        city,
                        state,
                        zip,
                        country,
                        owner_id,
                        title,
                        description,
                        photo_url,
                        price_per_hour,
                        min_hours }
 *
 * Return will be { id, 
                    address, 
                    unit,
                    city,
                    state,
                    zip,
                    country,
                    owner_id,
                    title
                    description,
                    photo_url,
                    price_per_hour,
                    min_hours }
 *
 * Authorization required: admin
 */

router.post("/", async function (req, res, next) {  
  const validator = jsonschema.validate(req.body, listingsNewSchema);
  if (!validator.valid) {
    const errs = validator.errors.map(e => e.stack);
    throw new BadRequestError(errs);
  }
  const listing = await Listing.create(req.body);
  return res.status(201).json({ listing });
});



/** GET all listings / =>
 *   { listings: [      id,
 *                      address, 
                        unit,
                        city,
                        state,
                        zip,
                        country,
                        owner_id,
                        title,
                        description,
                        photo_url,
                        price_per_hour,
                        min_hours}, ...] }
 *
 * Authorization required: none
 */

router.get("/", async function (req, res, next) {
  try {
    console.log("getting all Listings")
    const listings = await Listing.findAll();
    return res.json({ listings });
  } catch (err) {
    return next(err);
  }
});



/** GET single listing  /[listingId] => { Listing }
 *
 * Returns { id,
 *           address, 
             unit,
             city,
             state,
             zip,
             country,
             owner_id,
             title,
             description,
             photo_url,
             price_per_hour,
             min_hours}}
 *  
 *
 * Authorization required: none
 */

router.get("/:id", async function (req, res, next) {
  try {
    console.log("getting single Listing")
    const listing = await Listing.get(req.params.id);
    return res.json({ listing });
  } catch (err) {
    return next(err);
  }
});



/** PATCH /[listingId]  { fld1, fld2, ... } => {listing }
 *
 * Data can include: { title, description, photoUrl, price_per_hour, min_hours }
 *
 * Returns { id,
 *           address, 
             unit,
             city,
             state,
             zip,
             country,
             owner_id,
             title,
             description,
             photo_url,
             price_per_hour,
             min_hours} }
 *
 * TODO : authorization required: admin or owner
 */

router.patch("/:id", async function (req, res, next) {
  
  const validator = jsonschema.validate(req.body, listingUpdateSchema);
  if (!validator.valid) {
    const errs = validator.errors.map(e => e.stack);
    throw new BadRequestError(errs);
  }
  const listing = await Listing.update(req.params.id, req.body);
  return res.json({ listing });
});



/** DELETE /[listingId]  =>  { deleted: id }
 *
 * TODO : Authorization required: admin, or owner
 */

router.delete("/:id", async function (req, res, next) {
  await Listing.remove(req.params.id);
  return res.json({ deleted: +req.params.id });
});
module.exports = router;