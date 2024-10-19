const express = require("express");
const { connectDB } = require("./connection");
const userRouter = require("./routes/user");
const { logReqRes } = require("./middleware");

const app = express();
const PORT = 8000;

// Middleware
app.use(express.urlencoded({ extended: false }));

app.use(logReqRes("log.txt"));

// Connection
connectDB("mongodb://127.0.0.1:27017/app-db").then(() =>
  console.log("Connected to MongoDB")
);

// Routes
app.use("/api/users", userRouter);

app.listen(PORT, () => {
  console.log(`Server is running on this : ${PORT}`);
});
