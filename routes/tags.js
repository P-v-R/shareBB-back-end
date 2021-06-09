"use strict";

/** Routes for tags. */

const jsonschema = require("jsonschema");
const express = require("express");

const { BadRequestError } = require("../expressError");
const { ensureAdmin } = require("../middleware/auth");
const Tag = require("../models/tag");

const tagNewSchema = require("../schemas/tagNew.json");
const tagSearchSchema = require("../schemas/tagSearch.json");
const tagUpdateSchema = require("../schemas/tagUpdate.json");

const router = new express.Router();


/** POST / { tag } =>  { tag }
 *
 * tag should be { handle, description }
 *
 * Returns { handle, description }
 *
 */

router.post("/", async function (req, res, next) {
  const validator = jsonschema.validate(req.body, tagNewSchema);
  if (!validator.valid) {
    const errs = validator.errors.map(e => e.stack);
    throw new BadRequestError(errs);
  }

  const tags = await Tag.create(req.body);
  return res.status(201).json({ tags });
});

/** GET /  =>
 *   { tags: [ { handle, description }, ...] }
 *
 * Can filter on provided search filters:
 * - handle
 * - description
 *
 * Authorization required: none
 */

router.get("/", async function (req, res, next) {
  const q = req.query;

  const validator = jsonschema.validate(q, tagSearchSchema);
  if (!validator.valid) {
    const errs = validator.errors.map(e => e.stack);
    throw new BadRequestError(errs);
  }

  const tags = await Tag.findAll(q);
  return res.json({ tags });
});

/** GET /[handle]  =>  { tag }
 *
 *  { handle, description }
 *
 * Authorization required: none
 */

router.get("/:handle", async function (req, res, next) {
  const tag = await Tag.get(req.params.handle);
  return res.json({ tag });
});

/** PATCH /[handle] { handle } => { handle }
 *
 * Data can include:
 *   { description }
 *
 * Returns { handle, description }
 *
 * Authorization required: admin or same-user-as-:username
 **/


router.patch("/:handle", async function (req, res, next) {
  try {
    const validator = jsonschema.validate(req.body, tagUpdateSchema);
    if (!validator.valid) {
     const errs = validator.errors.map(e => e.stack);
     throw new BadRequestError(errs);
    }

    const tag = await Tag.update(req.params.handle, req.body.description);
    return res.json({ tag });} 
    catch (err) {
    return next(err);
  }
});


/** DELETE /[handle]  =>  { deleted: ihandled }
 *
 * Authorization required: admin
 **/

router.delete("/:handle", async function (req, res, next) {
  try {
    await Tag.remove(req.params.handle);
    return res.json({ deleted: req.params.handle });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
