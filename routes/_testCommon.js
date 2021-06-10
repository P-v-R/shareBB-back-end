"use strict";

const db = require("../db.js");
const User = require("../models/user");
const Listing = require("../models/listing");
const { createToken } = require("../helpers/tokens");

const testListingIds = [];

async function commonBeforeAll() {
  // noinspection SqlWithoutWhere
  await db.query("DELETE FROM users");
  // noinspection SqlWithoutWhere
  await db.query("DELETE FROM listings");

  await Listing.create(
  //   {
  //     address: "123 test st",
  //     unit: "1",
  //     city: "Los Angeles",
  //     state: "Ca",
  //     zip: "90027",
  //     country: "USA",
  //     owner_id: 1,
  //     title: "house",
  //     description: "big house",
  //     price_per_hour: 50,
  //     min_hours: 5
  //   });
  // await Listing.create(
  //   {
  //     address: "345 jest ave",
  //     unit: "5a",
  //     city: "Los Angeles",
  //     state: "Ca",
  //     zip: "90027",
  //     country: "USA",
  //     owner_id: 1,
  //     title: "pool",
  //     description: "big apartment with pool and backyard",
  //     price_per_hour: 150,
  //     min_hours: 3
  //   });
  // await Listing.create(
  //   {
  //     address: "4055 redwood ave",
  //     unit: "132",
  //     city: "Los Angeles",
  //     state: "Ca",
  //     zip: "90038",
  //     country: "USA",
  //     owner_id: 1,
  //     title: "perrys house",
  //     description: "perrys old house, very neat! ",
  //     price_per_hour: 500,
  //     min_hours: 12
  //   });


  // // testListingIds[0] = (await User.bookListing(
  // //   { title: "J1", salary: 1, equity: "0.1", companyHandle: "c1" })).id;
  // // testJobIds[1] = (await Job.create(
  // //   { title: "J2", salary: 2, equity: "0.2", companyHandle: "c1" })).id;
  // // testJobIds[2] = (await Job.create(
  // //   { title: "J3", salary: 3, /* equity null */ companyHandle: "c1" })).id;

  // await User.register({
  //   password:"password1",
  //   firstName: "U1F",
  //   lastName: "U1L",
  //   email: "user1@user.com",
  //   bio: "testing bio for jest",
  // });
  // await User.register({
  //   password:"password2",
  //   firstName: "U2F",
  //   lastName: "U2L",
  //   email: "user2@user.com",
  //   bio: "testing user two bio for jest",
  // });
  // await User.register({
  //   password:"password3",
  //   firstName: "U3F",
  //   lastName: "U3L",
  //   email: "user3@user.com",
  //   bio: "testing the thurd and final bio for jest",
  // });


  await User.applyToJob("u1", testJobIds[0]);
}

async function commonBeforeEach() {
  await db.query("BEGIN");
}

async function commonAfterEach() {
  await db.query("ROLLBACK");
}

async function commonAfterAll() {
  await db.end();
}


const u1Token = createToken({ username: "u1", isAdmin: false });
const u2Token = createToken({ username: "u2", isAdmin: false });
const adminToken = createToken({ username: "admin", isAdmin: true });


module.exports = {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
  testJobIds,
  u1Token,
  u2Token,
  adminToken,
};
