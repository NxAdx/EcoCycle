const express = require("express");
const dotenv = require("dotenv").config();
const cors = require("cors");
const { mongoose } = require("mongoose");
const cookieParser = require('cookie-parser')
const app = express();

// database
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("DB Connected"))
  .catch((err) => console.log("DB is not! Connected", err))

// middleware
app.use(express.json())
app.use(cookieParser())
app.use(express.urlencoded({extended: false}))
app.use("/", require('./routes/authRoute'))


const port = 8000;
app.listen(port, () => console.log(`Server is started running at ${port}`))
