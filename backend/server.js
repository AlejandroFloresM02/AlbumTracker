const { default: axios } = require("axios");
const express = require("express");
const mongoose = require("mongoose");
const qs = require("qs");
require("dotenv").config();

const app = express();




//middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
//app.use(express.static("frontend"));

//routes TODO





app.get("/", (req, res) => {
  res.send("This is AlbumTracker server");
});





mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("Connected to database");
    app.listen(8080, () => {
      console.log("Server is running on port 8080");
    });
  })
  .catch((error) => {
    console.error("Conection failed: ", error);
  });
