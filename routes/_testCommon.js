"use strict";

const db = require("../db.js");
const Listing = require("../models/listing");
const User = require("../models/user");

//generate user id thats in test DB

async function getUserId(){
  const user = await User.register({
    
    firstName: "test",
    lastName: "jest",
    email: "test1@user.com",
    password: "password",
    bio: "old man who wants to rent a property"
  }
)
return user.id
}



async function commonBeforeAll() {
  const testUserId = [];
  // console.log("TEST LISTING ID ==>", testListingIds)
  // noinspection SqlWithoutWhere
  // // noinspection SqlWithoutWhere
  await db.query("DELETE FROM listings ");
  await db.query("DELETE FROM users ");


  const user = await User.register({
    
      firstName: "test",
      lastName: "jest",
      email: "test@user.com",
      password: "password",
      bio: "old man who wants to rent a property"
    }
  )

  // console.log("user ====>", user)

await Listing.create(
  {
    address: "123 test st",
    unit: "1",
    city: "Los Angeles",
    state: "Ca",
    zip: "90027",
    country: "USA",
    ownerId: user.id,
    title: "house",
    description: "big house",
    pricePerHour: 50,
    minHours: 5
  });
await Listing.create(
  {
    address: "345 jest ave",
    unit: "5a",
    city: "Los Angeles",
    state: "Ca",
    zip: "90027",
    country: "USA",
    ownerId: user.id,
    title: "pool",
    description: "big apartment with pool and backyard",
    pricePerHour: 150,
    minHours: 3
  });



testUserId.push(user.id)


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
  commonAfterAll,
  getUserId
};
