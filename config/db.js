const mongoose = require("mongoose");

async function connect() {
  try {
    await mongoose.connect("mongodb://localhost:27017/tdd-jest-local", {
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false,
      useUnifiedTopology: true,
    });
  } catch (error) {
    console.error(error);
  }
}

module.exports = { connect };

//mongodb://brittlebubbles:supertest1@ds123698.mlab.com:23698/tdd-jest
//mongodb://localhost:27017/
