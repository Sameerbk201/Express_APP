const mongoose = require("mongoose");

module.exports.connectToDb = () => {
  try {
    mongoose.set("strictQuery", true);
    mongoose.connect("mongodb://127.0.0.1:27017/android1", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    const db = mongoose.connection;
    db.on("error", console.error.bind(console, "connection error:"));
    db.once("open", function () {
      console.log("Successfully connected to MongoDB");
    });
  } catch (error) {
    console.log(error);
  }
};
