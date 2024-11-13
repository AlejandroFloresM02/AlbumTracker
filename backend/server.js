const { default: axios } = require("axios");
const express = require("express");
const mongoose = require("mongoose");
const Album = require("./models/album.model.js");
const app = express();

require("dotenv").config();

//middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
//app.use(express.static("frontend"));

//routes
app.use("/api/albums", albumRoutes);

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
