const express = require("express");
const path = require("path");

const apiRoutes = require("./api/api"); // obecné API routery
const subjectsRoutes = require('./api/subjects'); // subjects router
const seatingPlansRouter = require('./routes/seatingPlans'); // seatingPlans router

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

// Připojení routerů s odpovídajícími cestami
app.use("/api", apiRoutes);
app.use("/api/subjects", subjectsRoutes);
app.use("/api/seating_plans", seatingPlansRouter);

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server běží na http://localhost:${port}`);
});
