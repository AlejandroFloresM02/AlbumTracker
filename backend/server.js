const { default: axios } = require("axios");
const express = require("express");
const mongoose = require("mongoose");
const Album = require("./models/album.model.js");
const albumRoutes = require("./routes/album.routes.js");
const User = require("./models/user.model.js");
const userRoutes = require("./routes/user.routes.js");
const app = express();

require("dotenv").config();

//middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
//app.use(express.static("frontend"));

//routes
app.use("/api/albums", albumRoutes);
app.use("/api/users", userRoutes);

app.get("/", (req, res) => {
  res.send("This is the AlbumTracker server");
});

app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("Connected to database");
    const port = process.env.PORT || 8080;
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  })
  .catch((error) => {
    console.error("Connection failed:", error);
  });
