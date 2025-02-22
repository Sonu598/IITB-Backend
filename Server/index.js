const express = require("express");
const app = express();
const { bookRouter } = require("./routes/bookRoute");
const { userRouter } = require("./routes/userRoute");
const { Connect } = require("./config/db");
// const cors = require("cors");
require("dotenv").config();
app.use(express.json());
// app.use(cors);
app.use("/user", userRouter);
app.use("/book", bookRouter);

app.listen(process.env.Port, async () => {
  await Connect;
  console.log("Connected to database");
  console.log(`Server is running on ${process.env.Port}`);
});
