"use strict";

const db = require("../db");
const bcrypt = require("bcrypt");
const { sqlForPartialUpdate } = require("../helpers/sql");
const {
  NotFoundError,
  BadRequestError,
  UnauthorizedError,
} = require("../expressError");


/** Related functions for tags. */

class Tag {

  /** Create new tag => tags {handle, description}
   *
   * Returns { handle, description }
   *
   * Throws BadRequestError on duplicates.
   **/

   static async create({ handle, description }) {
    const duplicateCheck = await db.query(
        `SELECT handle
           FROM tags
           WHERE handle = $1`,
        [handle]);

    if (duplicateCheck.rows[0])
      throw new BadRequestError(`Duplicate tag: ${handle}`);

    const result = await db.query(
        `INSERT INTO tags
         (handle, description)
           VALUES
             ($1, $2)
           RETURNING handle, description`,
        [handle,
        description],
    );
    const createdTag = result.rows[0];

    return createdTag;
  }


  /** Find all tags.
   * 
   * Returns [{ handle, description }, ...]
   **/

  static async findAll(q) {
    console.log(q);
    if (!q.description && !q.handle) {
      const result = await db.query(
        `SELECT handle,
                description
             FROM tags
             ORDER BY handle`);
  
      return result.rows;
    }
    if (q. description && q.handle) {
      const result = await db.query(
            `SELECT handle,
                    description
                FROM tags
                WHERE description ILIKE $1 OR handle ILIKE $2
                ORDER BY handle`,
                [`%${q.description | q.handle}%`, `%${q.handle | q.description}%`]
          );

      return result.rows;
    }
    let query = q.description || q.handle;
    const result = await db.query(
      `SELECT handle,
              description
          FROM tags
          WHERE description ILIKE $1 OR handle ILIKE $2
          ORDER BY handle`,
          [query, query]
    );

return result.rows;

    
  }

  /** Given a tag handle, return data about tag.
   *   
   * Returns tags
   * Throws NotFoundError if user not found.
   **/

  static async get(handle) {
    const tagsRes = await db.query(
      `SELECT handle,
              description
           FROM tags
           WHERE handle = $1`,
      [handle],
    );

    const tag = tagsRes.rows[0];

    if (!tag) throw new NotFoundError(`No tag: ${handle}`);

    return tag;
  }

  /** Update tag data with `description`.
   *
   * Data can include only:
   *   { description }
   *
   * Returns { handle, description }
   *
   * Throws NotFoundError if not found.
   *
   */

  static async update(handle, description) {
    const result = await db.query(`
      UPDATE tags 
        SET description = $1
        WHERE handle = $2
        RETURNING handle,
          description`, [description, handle]);
    const tag = result.rows[0];

    if (!tag) throw new NotFoundError(`No tag: ${tag}`);

    return tag;
  }

  /** Delete tag from database; returns undefined. */

  static async remove(handle) {
    let result = await db.query(
      `DELETE
           FROM tags
           WHERE handle = $1
           RETURNING handle, description`,
      [handle],
    );
    const tag = result.rows[0];

    if (!tag) throw new NotFoundError(`No tag: ${handle}`);
  }

  /** tag a listing: update db, returns undefined.
   *
   * - listingId
   * - tag
   **/

  static async tagListing(listingId, tagHandle) {
    const preCheck = await db.query(
      `SELECT id
           FROM listings
           WHERE id = $1`, [listingId]);
    const listing = preCheck.rows[0];

    if (!listing) throw new NotFoundError(`No listing: ${listingId}`);

    const preCheck2 = await db.query(
      `SELECT handle
           FROM tags
           WHERE handle = $1`, [tagHandle]);
    const tag = preCheck2.rows[0];

    if (!tag) throw new NotFoundError(`No tag: ${tagHandle}`);

    await db.query(
      `INSERT INTO tags_to_listings (listings_id, tag)
           VALUES ($1, $2)`,
      [listingId, tagHandle]);
  }
}


module.exports = Tag;
