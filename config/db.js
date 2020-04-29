const mongoose = require("mongoose");

async function connect() {
  try {
    await mongoose.connect(
      "mongodb://brittlebubbles:supertest1@ds123698.mlab.com:23698/tdd-jest",
      {
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false,
        useUnifiedTopology: true,
      }
    );
  } catch (error) {
    console.error(error);
  }
}

module.exports = { connect };
