const express = require("express");
const path = require("path");

const app = express();
const port = process.env.PORT || 3000;

// Middlewary
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

// Routy
const apiRoutes = require("./api/api");
const subjectsRoutes = require('./api/subjects');
const seatingPlansRoutes = require('./api/seating_plans');

app.use("/api", apiRoutes);
app.use("/api/subjects", subjectsRoutes);
app.use("/api/seating_plans", seatingPlansRoutes);

// Start serveru
app.listen(port, () => {
  console.log(`Server běží na http://localhost:${port}`);
});
