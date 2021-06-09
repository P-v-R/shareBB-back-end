"use strict";

const db = require("../db");
const { BadRequestError, NotFoundError } = require("../expressError");
const { sqlForPartialUpdate } = require("../helpers/sql");

/** Related functions for companies. */

class Message {
  /** Create a message (from data), update db, return new message data.
   *
   * data should be { listingId, fromUserId, toUserId, message }
   *
   * Returns { id, listingId, fromUserId, toUserId, message, sentAt }
   *
   * Throws BadRequestError if company already in database.
   * */

  static async create({ listingId, fromUserId, toUserId, message }) {
    const duplicateCheck = await db.query(
        `SELECT message
           FROM companies
           WHERE message = $1 AND from_user_id = $2 and to_user_id = $3`,
        [message, fromUserId, toUserId]);

    if (duplicateCheck.rows[0])
      throw new BadRequestError(`Duplicate message: ${fromUserId} about ${listingId}: ${message}`);

    const result = await db.query(
        `INSERT INTO messages
         (listing_id, from_user_id, to_user_id, message)
           VALUES
             ($1, $2, $3, $4)
           RETURNING id, listing_id AS "listingId", from_user_id AS "fromUserId", to_user_id AS "toUserId, message, sent_at AS "sentAt"`,
        [listingId,
          fromUserId,
          toUserId,
          message
        ],
    );
    const createdMessage = result.rows[0];

    return createdMessage;
  }

  /** Create WHERE clause for filters, to be used by functions that query
   * with filters.
   *
   * searchFilters (all optional):
   * - listingId
   * - fromUserId
   * - toUserId
   *
   * Returns {
   *  where: "WHERE num_employees >= $1 AND name ILIKE $2",
   *  vals: [100, '%Apple%']
   * }
   */

  static _filterWhereBuilder({ listingId, fromUserId, toUserId }) {
    let whereParts = [];
    let vals = [];

    if (listingId !== undefined) {
      vals.push(listingId);
      whereParts.push(`listing_id = $${vals.length}`);
    }

    if (fromUserId !== undefined) {
      vals.push(fromUserId);
      whereParts.push(`from_user_id = $${vals.length}`);
    }

    if (toUserId) {
      vals.push(toUserId);
      whereParts.push(`to_user_id = $${vals.length}`);
    }

    const where = (whereParts.length > 0) ?
        "WHERE " + whereParts.join(" AND ")
        : "";

    return { where, vals };
  }

  /** Find all messages (optional filter on searchFilters).
   *
   * searchFilters (all optional):
   * - listingId
   * - toUserId
   * - fromUserId
   * Returns [ { id, listingId, fromUserId, toUserId, message, sentAt }, ...]
   * */

  static async findAll(searchFilters = {}) {
    const { listingId, toUserId, fromUserId } = searchFilters;

    if ( toUserId === fromUserId && toUserId != undefined && fromUserId != undefined) {
      throw new BadRequestError("Invalid, messages to and from user cannot be the same user.");
    }

    const { where, vals } = this._filterWhereBuilder({
      listingId, toUserId, fromUserId
    });

    console.log(where);

    const messagesRes = await db.query(`
      SELECT id,
             listing_id AS "listingId",
             to_user_id AS "toUserId",
             from_user_id AS "fromUserId",
             message,
             sent_at AS "sentAt"
        FROM messages ${where}
        ORDER BY listing_id
    `, vals);
    return messagesRes.rows;
  }

  /** Given a message id, return data about message.
   *
   * Returns  { id, listingId, fromUserId, toUserId, message, sentAt }
   *
   * Throws NotFoundError if not found.
   **/

  static async get(id) {
    const messageRes = await db.query(
        `SELECT id,
                listing_id AS "listingId",
                from_user_id AS "fromUserId",
                to_user_id AS "toUserId",
                message,
                sent_at AS "sentAt"
           FROM messages
           WHERE id = $1`,
        [id]);

    const message = messageRes.rows[0];

    if (!message) throw new NotFoundError(`No company: ${id}`);

    return message;
  }
}


module.exports = Message;
