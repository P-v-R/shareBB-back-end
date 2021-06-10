"use strict";

const db = require("../db.js");
const Listing = require("../models/listing");
const User = require("../models/user");

// const { createToken } = require("../helpers/tokens");

const testListingIds = [];
async function commonBeforeAll() {
  console.log("TEST LISTING ID ==>", testListingIds)
  // noinspection SqlWithoutWhere
  await db.query("DELETE FROM users");
  // noinspection SqlWithoutWhere
  await db.query("DELETE FROM listings");

  await User.post({
    
      firstName: "test",
      lastName: "jest",
      email: "test@user.com",
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
    ownerId: 1,
    title: "house",
    description: "big house",
    pricePerHour: 50,
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
    ownerId: 1,
    title: "pool",
    description: "big apartment with pool and backyard",
    pricePerHour: 150,
    minHours: 3
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
