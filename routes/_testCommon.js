"use strict";

const db = require("../db.js");
const Listing = require("../models/listing");
const Users = require("../models/users");

// const { createToken } = require("../helpers/tokens");

const testListingIds = [];
async function commonBeforeAll() {
  console.log("TEST LISTING ID ==>", testListingIds)
  // noinspection SqlWithoutWhere
  await db.query("DELETE FROM users");
  // noinspection SqlWithoutWhere
  await db.query("DELETE FROM listings");

  await Users.post({
    {
      firstName: "jimmy",
      lastName: "Roberts",
      email: "test@user2s22.com",
      passWord: "password",
      bio: "old man who wants to rent a property"
    }
  )

await Listing.create(
  {
    address: "123 test st",
    unit: "1",
    city: "Los Angeles",
    state: "Ca",
    zip: "90027",
    country: "USA",
    owner_id: 1,
    title: "house",
    description: "big house",
    price_per_hour: 50,
    min_hours: 5
  });
await Listing.create(
  {
    address: "345 jest ave",
    unit: "5a",
    city: "Los Angeles",
    state: "Ca",
    zip: "90027",
    country: "USA",
    owner_id: 1,
    title: "pool",
    description: "big apartment with pool and backyard",
    price_per_hour: 150,
    min_hours: 3
  });
await Listing.create(
  {
    address: "4055 redwood ave",
    unit: "132",
    city: "Los Angeles",
    state: "Ca",
    zip: "90038",
    country: "USA",
    owner_id: 1,
    title: "perrys house",
    description: "perrys old house, very neat! ",
    price_per_hour: 500,
    min_hours: 12
  });

let listings = Listing.findAll();
console.log("setup listings ===>", listings)


}
//   await User.applyToJob("u1", testJobIds[0]);

async function commonBeforeEach() {
  await db.query("BEGIN");
}

async function commonAfterEach() {
  await db.query("ROLLBACK");
}

async function commonAfterAll() {
  await db.end();
}


// const u1Token = createToken({ username: "u1", isAdmin: false });
// const u2Token = createToken({ username: "u2", isAdmin: false });
// const adminToken = createToken({ username: "admin", isAdmin: true });


module.exports = {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll
};
