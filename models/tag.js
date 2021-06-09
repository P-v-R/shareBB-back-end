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

  static async findAll() {
    const result = await db.query(
      `SELECT handle,
              description
           FROM tags
           ORDER BY handle`,
    );

    return result.rows;
  }

  /** Given a tag handle, return data about user.
   *
   * Returns { id, first_name, last_name, email, bio, is_admin, listings, bookings, messages }
   *   where listings is { id, address, unit, city, state, zip, country, owner_id, title, description, photo_url, price_per_hour, min_hours }
   *  where bookings is { id, listing_id, renter_id, start_date, num_hours, total_price, booked_at }
   *    where messages is { listing_id, from_user_id, to_user_id, message, time}
   * TODO: add messages later, or add is somewhere else???
   * Throws NotFoundError if user not found.
   **/

  static async get(id) {
    const tagsRes = await db.query(
      `SELECT id,
                  first_name AS "firstName",
                  last_name AS "lastName",
                  email,
                  bio,
                  is_admin AS "isAdmin"
           FROM users
           WHERE id = $1`,
      [id],
    );

    const user = userRes.rows[0];

    if (!user) throw new NotFoundError(`No user: ${id}`);

    const userListingsRes = await db.query(
      `SELECT l.id, 
              l.address, 
              l.unit, 
              l.city, 
              l.state,
              l.zip,
              l.country,
              l.owner_id AS "ownerId",
              l.title,
              l.description,
              l.photo_url AS "photoUrl",
              l.price_per_hour AS "pricePerHour",
              l.min_hours AS "minHours"
           FROM listings AS l
           WHERE l.owner_id = $1`, [id]);

    const userBookingsRes = await db.query(
      `SELECT b.id,
                b.listing_id AS "listingId",
                b.renter_id AS "renterId",
                b.start_date AS "startDate",
                b.num_hours AS "numHours",
                b.total_price AS "totalPrice"
            FROM bookings AS b
            WHERE b.renter_id = $1`, [id]);

    user.listings = userListingsRes.rows;
    user.bookings = userBookingsRes.rows;

    return user;
  }

  /** Update user data with `data`.
   *
   * This is a "partial update" --- it's fine if data doesn't contain
   * all the fields; this only changes provided ones.
   *
   * Data can include:
   *   { firstName, lastName, password, bio }
   *
   * Returns { id, firstName, lastName, email, bio, isAdmin }
   *
   * Throws NotFoundError if not found.
   *
   * WARNING: this function can set a new password or make a user an admin.
   * Callers of this function must be certain they have validated inputs to this
   * or a serious security risks are opened.
   */

  static async update(id, data) {
    if (data.password) {
      data.password = await bcrypt.hash(data.password, BCRYPT_WORK_FACTOR);
    }

    const { setCols, values } = sqlForPartialUpdate(
      data,
      {
        firstName: "first_name",
        lastName: "last_name"
      });
    const usernameVarIdx = "$" + (values.length + 1);

    const querySql = `UPDATE users 
                      SET ${setCols} 
                      WHERE id = ${usernameVarIdx} 
                      RETURNING id,
                                first_name AS "firstName",
                                last_name AS "lastName",
                                email,
                                bio,
                                is_admin AS "isAdmin"`;
    const result = await db.query(querySql, [...values, id]);
    const user = result.rows[0];

    if (!user) throw new NotFoundError(`No user: ${username}`);

    delete user.password;
    return user;
  }

  /** Delete given user from database; returns undefined. */

  static async remove(id) {
    let result = await db.query(
      `DELETE
           FROM users
           WHERE id = $1
           RETURNING id,
           first_name AS "firstName",
           last_name AS "lastName",
           email`,
      [id],
    );
    const user = result.rows[0];

    if (!user) throw new NotFoundError(`No user: ${id}`);
  }

  /** book a listing: update db, returns undefined.
   *
   * - userId: user id applying for job
   * - listingId: listingId id
   **/

  static async bookListing(userId, data) {
    const { listingId, startDate, startHour, numHours, totalPrice } = data;
    const preCheck = await db.query(
      `SELECT id
           FROM listings
           WHERE id = $1`, [listingId]);
    const listing = preCheck.rows[0];

    if (!listing) throw new NotFoundError(`No job: ${listingId}`);

    const preCheck2 = await db.query(
      `SELECT id
           FROM users
           WHERE id = $1`, [userId]);
    const user = preCheck2.rows[0];

    if (!user) throw new NotFoundError(`No username: ${userId}`);

    await db.query(
      `INSERT INTO bookings (renter_id, listing_id, start_date, start_hour, num_hours, total_price)
           VALUES ($1, $2, $3, $4, $5)`,
      [userId, listingId, startDate, numHours, totalPrice]);
  }
}


module.exports = User;
