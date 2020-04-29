const express = require("express");
const app = express();
const db = require("./config/db");
const todoRoutes = require("./routes/todo.routes");

//Databaase Connection
db.connect();

app.use(express.json());

app.use("/todos", todoRoutes);

app.use((error, req, res, next) => {
  //   console.log(error);
  res.status(500).json({
    message: error.message,
  });
});

// app.get("/", (req, res) => {
//   res.json("Jest Node Testing");
// });

// app.listen(5000, () => {
//   console.log("Server running on port 5000");
// });

module.exports = app;
