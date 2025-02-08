const express = require("express");
const app = express();
const { bookRouter } = require("./routes/bookRoute");
const { userRouter } = require("./routes/userRoute");
const { Connect } = require("./config/db");
require("dotenv").config();
app.use(express.json());
app.use("/book", bookRouter);
app.use("/user", userRouter);

app.listen(process.env.Port, async () => {
  await Connect;
  console.log("Connected to database");
  console.log(`Server is running on ${process.env.Port}`);
});
