"use strict";

const request = require("supertest");

const app = require("../app");
const Listing = require("../models/listing");

const {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
  getUserId
} = require("./_testCommon");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);


// /************************************** POST listings */



describe("POST /listings", function () {
  test("ok for add new user", async function () {
    let id = await getUserId()

    const resp = await request(app)
      .post(`/listings`)
      .send({
        "address": "200 stinker ave",
        "unit": "21",
        "city": "Los Angeles",
        "state": "CA",
        "zip": "90027",
        "country": "USA",
        "ownerId": id,
        "title": "GIANT HOUSE ON THE HILL",
        "description": "Really nice big house",
        "photoUrl": "",
        "pricePerHour": 200,
        "minHours": 6
      })
    expect(resp.statusCode).toEqual(201);
    expect(resp.body).toEqual({
      listing: {
        id: expect.any(Number),
        "address": "200 stinker ave",
        "unit": "21",
        "city": "Los Angeles",
        "state": "CA",
        "zip": "90027",
        "country": "USA",
        "ownerid": id,
        "title": "GIANT HOUSE ON THE HILL",
        "description": "Really nice big house",
        "photourl": "",
        "priceperhour": "200",
        "minhours": 6
      },
    });
  });

  test("reject new listing if missing info", async function () {
    let id = await getUserId()

    const resp = await request(app)
      .post(`/listings`)
      .send({
        "unit": "21",
        "city": "Los Angeles",
        "state": "CA",
        "zip": "90027",
        "country": "USA",
        "ownerId": id,
        "description": "Really nice big house",
        "photoUrl": "",
        "pricePerHour": 200,
        "minHours": 6
      })

    expect(resp.statusCode).toEqual(400)
  })
});



// /************************************** GET /listings */

describe("GET /listings", function () {
  test("ok", async function () {
    const resp = await request(app).get(`/listings`);
    // console.log("listings response ==>", resp.body.listings)
    expect(resp.body).toEqual({
      listings: [
        {
          id: expect.any(Number),
          address: '123 test st',
          unit: '1',
          city: 'Los Angeles',
          state: 'Ca',
          zip: '90027',
          country: 'USA',
          ownerid: expect.any(Number),
          title: 'house',
          description: 'big house',
          photourl: null,
          priceperhour: '50',
          minhours: 5,
          tags: [null]
        },
        {
          id: expect.any(Number),
          address: '345 jest ave',
          unit: '5a',
          city: 'Los Angeles',
          state: 'Ca',
          zip: '90027',
          country: 'USA',
          ownerid: expect.any(Number),
          title: 'pool',
          description: 'big apartment with pool and backyard',
          photourl: null,
          priceperhour: '150',
          minhours: 3,
          tags: [null]
        }
      ]
    }
    )

  });

  // test("works: filtering", async function () {
  //   const resp = await request(app)
  //       .get(`/jobs`)
  //       .query({ hasEquity: true });
  //   expect(resp.body).toEqual({
  //         jobs: [
  //           {
  //             id: expect.any(Number),
  //             title: "J1",
  //             salary: 1,
  //             equity: "0.1",
  //             companyHandle: "c1",
  //             companyName: "C1",
  //           },
  //           {
  //             id: expect.any(Number),
  //             title: "J2",
  //             salary: 2,
  //             equity: "0.2",
  //             companyHandle: "c1",
  //             companyName: "C1",
  //           },
  //         ],
  //       },
  //   );
  // });

  //   test("works: filtering on 2 filters", async function () {
  //     const resp = await request(app)
  //         .get(`/jobs`)
  //         .query({ minSalary: 2, title: "3" });
  //     expect(resp.body).toEqual({
  //           jobs: [
  //             {
  //               id: expect.any(Number),
  //               title: "J3",
  //               salary: 3,
  //               equity: null,
  //               companyHandle: "c1",
  //               companyName: "C1",
  //             },
  //           ],
  //         },
  //     );
  //   });

  //   test("bad request on invalid filter key", async function () {
  //     const resp = await request(app)
  //         .get(`/jobs`)
  //         .query({ minSalary: 2, nope: "nope" });
  //     expect(resp.statusCode).toEqual(400);
  //   });
});

// /************************************** GET /jobs/:id */

// describe("GET /jobs/:id", function () {
//   test("works for anon", async function () {
//     const resp = await request(app).get(`/jobs/${testJobIds[0]}`);
//     expect(resp.body).toEqual({
//       job: {
//         id: testJobIds[0],
//         title: "J1",
//         salary: 1,
//         equity: "0.1",
//         company: {
//           handle: "c1",
//           name: "C1",
//           description: "Desc1",
//           numEmployees: 1,
//           logoUrl: "http://c1.img",
//         },
//       },
//     });
//   });

//   test("not found for no such job", async function () {
//     const resp = await request(app).get(`/jobs/0`);
//     expect(resp.statusCode).toEqual(404);
//   });
// });

// /************************************** PATCH /jobs/:id */

// describe("PATCH /jobs/:id", function () {
//   test("works for admin", async function () {
//     const resp = await request(app)
//         .patch(`/jobs/${testJobIds[0]}`)
//         .send({
//           title: "J-New",
//         })
//         .set("authorization", `Bearer ${adminToken}`);
//     expect(resp.body).toEqual({
//       job: {
//         id: expect.any(Number),
//         title: "J-New",
//         salary: 1,
//         equity: "0.1",
//         companyHandle: "c1",
//       },
//     });
//   });

//   test("unauth for others", async function () {
//     const resp = await request(app)
//         .patch(`/jobs/${testJobIds[0]}`)
//         .send({
//           title: "J-New",
//         })
//         .set("authorization", `Bearer ${u1Token}`);
//     expect(resp.statusCode).toEqual(401);
//   });

//   test("not found on no such job", async function () {
//     const resp = await request(app)
//         .patch(`/jobs/0`)
//         .send({
//           handle: "new",
//         })
//         .set("authorization", `Bearer ${adminToken}`);
//     expect(resp.statusCode).toEqual(400);
//   });

//   test("bad request on handle change attempt", async function () {
//     const resp = await request(app)
//         .patch(`/jobs/${testJobIds[0]}`)
//         .send({
//           handle: "new",
//         })
//         .set("authorization", `Bearer ${adminToken}`);
//     expect(resp.statusCode).toEqual(400);
//   });

//   test("bad request with invalid data", async function () {
//     const resp = await request(app)
//         .patch(`/jobs/${testJobIds[0]}`)
//         .send({
//           salary: "not-a-number",
//         })
//         .set("authorization", `Bearer ${adminToken}`);
//     expect(resp.statusCode).toEqual(400);
//   });
// });

// /************************************** DELETE /jobs/:id */

// describe("DELETE /jobs/:id", function () {
//   test("works for admin", async function () {
//     const resp = await request(app)
//         .delete(`/jobs/${testJobIds[0]}`)
//         .set("authorization", `Bearer ${adminToken}`);
//     expect(resp.body).toEqual({ deleted: testJobIds[0] });
//   });

//   test("unauth for others", async function () {
//     const resp = await request(app)
//         .delete(`/jobs/${testJobIds[0]}`)
//         .set("authorization", `Bearer ${u1Token}`);
//     expect(resp.statusCode).toEqual(401);
//   });

//   test("unauth for anon", async function () {
//     const resp = await request(app)
//         .delete(`/jobs/${testJobIds[0]}`);
//     expect(resp.statusCode).toEqual(401);
//   });

//   test("not found for no such job", async function () {
//     const resp = await request(app)
//         .delete(`/jobs/0`)
//         .set("authorization", `Bearer ${adminToken}`);
//     expect(resp.statusCode).toEqual(404);
//   });
// });
