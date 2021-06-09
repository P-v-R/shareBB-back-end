"use strict";
const db = require("../db");
const { BadRequestError, NotFoundError } = require("../expressError");
const { sqlForPartialUpdate } = require("../helpers/sql");
/** Related functions for companies. */
class Listing {
  /** Create a listing (from data), update db, return new listing data.
   *
   * data should be {  }
   *
   * Returns { address, 
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
                        min_hours}
   *
   * Throws BadRequestError if listing already in database.
   * */
  static async create({
    address,
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
    min_hours
  }) {
    const duplicateCheck = await db.query(
      `SELECT title
           FROM listings
           WHERE address = $1`,
      [address]);
    if (duplicateCheck.rows[0])
      throw new BadRequestError(`Duplicate listing: ${handle}`);
    const result = await db.query(
      `INSERT INTO listings
         ( address, 
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
           min_hours )
           VALUES
             ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
           RETURNING 
            id, 
            address,
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
            min_hours`,
      [
        address,
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
        min_hours
      ],
    );
    const listing = result.rows[0];
    return listing;
  }
  /** 
   * find all listings in DB
   * 
   * 
   *   */
  static async findAll() {
    const result = await db.query(
      `SELECT id,
              address,
              unit, 
              city,
              state,
              zip,
              country,
              owner_Id AS ownerId,
              title,
              description,
              photo_url AS photoUrl,
              price_per_hour AS pricePerHour,
              min_hours AS minHours
           FROM listings
           ORDER BY zip`,
    );
    if (!result.rows) {
      throw new NotFoundError
    }
    return result.rows;
  }
  /** 
   * find single listing in DB bu the listing ID
   * 
   *  */
  static async get(id) {
    const result = await db.query(
      `SELECT id,
              address,
              unit, 
              city,
              state,
              zip,
              country,
              owner_Id AS ownerId,
              title,
              description,
              photo_url AS photoUrl,
              price_per_hour AS pricePerHour,
              min_hours AS minHours
           FROM listings
           WHERE id = $1
           ORDER BY zip`,
      [id]);
    return result.rows[0];
  }
  /** Update listing data with `data`.
   *
   * This is a "partial update" --- it's fine if data doesn't contain all the
   * fields; this only changes provided ones.
   *
   * Data can include: {  
           title, 
           description, 
           photo_url, 
           price_per_hour, 
           min_hours
        }
   *
   * Returns {
   *       id,
   *       address, 
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
           min_hours}
   *
   * Throws NotFoundError if not found.
   */
  static async update(id, data) {
    const { setCols, values } = sqlForPartialUpdate(
        data,
        {
          title: "title",
          description: "description",
          photo_url: "photo_url",
          photoUrl: "photo_url",
          pricePerHour: "price_per_hour",
          minHours:"min_hours",
        });
    const handleVarIdx = "$" + (values.length + 1);
    console.log("handleVarIdx ====>", handleVarIdx)
    const querySql = `UPDATE listings
                      SET ${setCols}
                        WHERE id = ${handleVarIdx}
                        RETURNING 
                              id, 
                              address,
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
                              min_hours`;
    const result = await db.query(querySql, [...values, id]);
    const listing = result.rows[0];
    if (!listing) throw new NotFoundError(`No listing: ${id}`);
    return listing;
  }
  /** Delete given listing from database; returns undefined.
   *
   * Throws NotFoundError if company not found.
   **/
  static async remove(id) {
    const result = await db.query(
      `DELETE
           FROM listings
           WHERE id = $1
           RETURNING id`,
      [id]);
    const company = result.rows[0];
    if (!company) throw new NotFoundError(`No listing: ${title}`);
  }
}
module.exports = Listing;