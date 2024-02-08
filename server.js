const express = require("express");
const app = express();
const cors = require("cors");
const { connectToDb } = require("./database/db");
const dotenv = require("dotenv");
const PORT = process.env.PORT || 3000;
const path = require('path');

dotenv.config();
connectToDb(); //database connection function

app.use(
  cors({
    origin: "*",
  })
);

// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'build')));

app.use(express.json());

// Catch all routes and return the React index file
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});


//routes 1 Auth {login and signup}
app.use("/api/auth", require("./routes/Auth"));
// 2 Note
app.use("/api/note", require("./routes/NoteRoute"));

app.listen(PORT, () => {
  console.log("Example app listening on port 3000!");
});
