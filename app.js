"use strict";

/** Express app for ShareBB. */

const express = require("express");
const cors = require("cors");

const { NotFoundError } = require("./expressError");

const { authenticateJWT } = require("./middleware/auth");
// const authRoutes = require("./routes/auth");
const tagsRoutes = require("./routes/tags");
const messagesRoutes = require("./routes/messages");
const usersRoutes = require("./routes/users");
const listingsRoutes = require("./routes/listings");

const morgan = require("morgan");
const { request } = require("express");
const multer  = require('multer');
const upload = multer();

const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("tiny"));
app.use(authenticateJWT);

// app.use("/auth", authRoutes);
app.use("/listings", listingsRoutes);
app.use("/users", usersRoutes);
app.use("/messages", messagesRoutes);
app.use("/tags", tagsRoutes);

/** POST / image file
 */

 app.post("/image", upload.array('file', 1), async function (req, res, next) {
   console.log("REQUEST IMAGE BODY ======> ", req.files);
   console.log("UUID key from front end ======> ", req.body.listingKey);
  
  const image = req.files[0];
  const client = new S3Client({region: "us-east-2"});

  const uploadParams = {
    Bucket: "sharebnb-mo",
    Key: req.body.listingKey,
    Body: image.buffer,
    Tagging: "public=yes"
  };
  const command = new PutObjectCommand(uploadParams);
  const response = await client.send(command);
  console.log("response ===>",response);
  return res.status(201).json("image route reached!");
});


/** Handle 404 errors -- this matches everything */
app.use(function (req, res, next) {
  return next(new NotFoundError());
});

/** Generic error handler; anything unhandled goes here. */
app.use(function (err, req, res, next) {
  if (process.env.NODE_ENV !== "test") console.error(err.stack);
  const status = err.status || 500;
  const message = err.message;

  return res.status(status).json({
    error: { message, status },
  });
});

module.exports = app;
