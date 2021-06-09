"use strict";

/** Routes for tags. */

const jsonschema = require("jsonschema");
const express = require("express");

const { BadRequestError } = require("../expressError");
const { ensureAdmin } = require("../middleware/auth");
const Tag = require("../models/tag");

// const tagsNewSchema = require("../schemas/tagNew.json");
// const tagSearchSchema = require("../schemas/tagSearch.json");

const router = new express.Router();


/** POST / { tag } =>  { tag }
 *
 * tag should be { tag, fromUserId, toUserId, message }
 *
 * Returns { msgId, listingId, fromUserId, toUserId, message, sentAt }
 *
 */

router.post("/", async function (req, res, next) {
  const validator = jsonschema.validate(req.body, messagesNewSchema);
  if (!validator.valid) {
    const errs = validator.errors.map(e => e.stack);
    throw new BadRequestError(errs);
  }

  const message = await Message.create(req.body);
  return res.status(201).json({ message });
});

/** GET /  =>
 *   { messages: [ { msgId, listingId, fromUserId, toUserId, message, sentAt }, ...] }
 *
 * Can filter on provided search filters:
 * - listingId
 * - fromUserId
 * - toUserId
 *
 * Authorization required: none
 */

router.get("/", async function (req, res, next) {
  const q = req.query;
  // arrive as strings from querystring, but we want as ints
  if (q.listingId !== undefined) q.listingId = +q.listingId;
  if (q.fromUserId !== undefined) q.fromUserId = +q.fromUserId;
  if (q.toUserId !== undefined) q.toUserId = +q.toUserId;

  const validator = jsonschema.validate(q, messageSearchSchema);
  if (!validator.valid) {
    const errs = validator.errors.map(e => e.stack);
    throw new BadRequestError(errs);
  }

  const messages = await Message.findAll(q);
  return res.json({ messages });
});

/** GET /[id]  =>  { message }
 *
 *  { msgId, listingId, fromUserId, toUserId, message, sentAt }
 *
 * Authorization required: none
 */

router.get("/:id", async function (req, res, next) {
  const message = await Message.get(req.params.id);
  return res.json({ message });
});


module.exports = router;
