"use strict";

const db = require("../db");
const bcrypt = require("bcrypt");
const { sqlForPartialUpdate } = require("../helpers/sql");
const {
  NotFoundError,
  BadRequestError,
  UnauthorizedError,
} = require("../expressError");

const { BCRYPT_WORK_FACTOR } = require("../config.js");

/** Related functions for users. */

class User {
  /** authenticate user with username, password.
   *
   * Returns { id, first_name, last_name, email, is_admin }
   *
   * Throws UnauthorizedError is user not found or wrong password.
   **/

  static async authenticate(username, password) {
    // try to find the user first
    const result = await db.query(
      `SELECT id,
                  password,
                  first_name AS "firstName",
                  last_name AS "lastName",
                  email,
                  is_admin AS "isAdmin"
           FROM users
           WHERE username = $1`,
      [username],
    );

    const user = result.rows[0];

    if (user) {
      // compare hashed password to a new hash from password
      const isValid = await bcrypt.compare(password, user.password);
      if (isValid === true) {
        delete user.password;
        return user;
      }
    }

    throw new UnauthorizedError("Invalid username/password");
  }

  /** Register user with data.
   *
   * Returns { id, firstName, lastName, email, is_admin }
   *
   * Throws BadRequestError on duplicates.
   **/

  static async register(
    { password, firstName, lastName, email }) {
    const duplicateCheck = await db.query(
      `SELECT email
           FROM users
           WHERE email = $1`,
      [email],
    );

    if (duplicateCheck.rows[0]) {
      throw new BadRequestError(`Duplicate email: ${email}`);
    }

    const hashedPassword = await bcrypt.hash(password, BCRYPT_WORK_FACTOR);

    const result = await db.query(
      `INSERT INTO users
           (password,
            first_name,
            last_name,
            email)
           VALUES ($1, $2, $3, $4, $5, $6)
           RETURNING id, first_name AS "firstName", last_name AS "lastName", email, is_admin AS "isAdmin"`,
      [
        hashedPassword,
        firstName,
        lastName,
        email,
      ],
    );

    const user = result.rows[0];

    return user;
  }

  /** Find all users.
   * 
   * Returns [{ first_name, last_name, email, bio, is_admin }, ...]
   **/

  static async findAll() {
    const result = await db.query(
      `SELECT id,
                  first_name AS "firstName",
                  last_name AS "lastName",
                  email,
                  bio,
                  is_admin AS "isAdmin"
           FROM users
           ORDER BY id`,
    );

    return result.rows;
  }

  /** Given a id, return data about user.
   *
   * Returns { id, first_name, last_name, email, bio, is_admin, listings, bookings, messages }
   *   where listings is { id, address, unit, city, state, zip, country, owner_id, title, description, photo_url, price_per_hour, min_hours }
   *  where bookings is { id, listing_id, renter_id, start_date, num_hours, total_price, booked_at }
   *    where messages is { listing_id, from_user_id, to_user_id, message, time}
   * TODO: add messages later, or add is somewhere else???
   * Throws NotFoundError if user not found.
   **/

  static async get(id) {
    const userRes = await db.query(
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
   *   { id, firstName, lastName, password, bio }
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

  static async remove(username) {
    let result = await db.query(
      `DELETE
           FROM users
           WHERE username = $1
           RETURNING username`,
      [username],
    );
    const user = result.rows[0];

    if (!user) throw new NotFoundError(`No user: ${username}`);
  }

  /** Apply for job: update db, returns undefined.
   *
   * - username: username applying for job
   * - jobId: job id
   **/

  static async applyToJob(username, jobId) {
    const preCheck = await db.query(
      `SELECT id
           FROM jobs
           WHERE id = $1`, [jobId]);
    const job = preCheck.rows[0];

    if (!job) throw new NotFoundError(`No job: ${jobId}`);

    const preCheck2 = await db.query(
      `SELECT username
           FROM users
           WHERE username = $1`, [username]);
    const user = preCheck2.rows[0];

    if (!user) throw new NotFoundError(`No username: ${username}`);

    await db.query(
      `INSERT INTO applications (job_id, username)
           VALUES ($1, $2)`,
      [jobId, username]);
  }
}


module.exports = User;
