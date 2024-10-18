const express = require("express");
const fs = require("fs");
const mongoose = require("mongoose");

const app = express();
const PORT = 3000;

// Middleware
app.use(express.urlencoded({ extended: false }));

// Connection
mongoose
  .connect("mongodb://127.0.0.1:27017/app-db")
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log("MongoDB ERROR !! ", err));

// Schema
const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    gender: {
      type: String,
      required: true,
    },
    jobTitle: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// Model
const User = mongoose.model("User", userSchema);

// Routes
app.get("/users", async (req, res) => {
  const allDBUsers = await User.find({});
  const html = `
        <ul>
            ${allDBUsers
              .map((user) => `<li>${user.firstName} - ${user.email}</li>`)
              .join("")}
        </ul>
    `;
  res.send(html);
});

// REST Api
app.get("/api/users", async (req, res) => {
  const allDBUsers = await User.find({});
  return res.json(allDBUsers);
});

app
  .route("/api/users/:id")
  .get(async (req, res) => {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: "user not found!!" });
    return res.json(user);
  })
  .patch(async (req, res) => {
    // Todo : Edit existing users.
    await User.findByIdAndUpdate(req.params.id, {
      lastName: "changed",
      jobTitle: "Worker",
    });
    return res.json({ status: "Success!" });
  })
  .delete(async (req, res) => {
    // Todo :Delete this existing data. by id
    await User.findByIdAndDelete(req.params.id);
    return res.json({ status: "Success!!!" });
  });

// Created new user
app.post("/api/users", async (req, res) => {
  const body = req.body;
  if (
    !body ||
    !body.first_name ||
    !body.last_name ||
    !body.email ||
    !body.gender ||
    !body.job_title
  ) {
    return res.status(400).json({ msg: "All fields are required.." });
  }
  const resultUser = await User.create({
    firstName: body.first_name,
    lastName: body.last_name,
    email: body.email,
    gender: body.gender,
    jobTitle: body.job_title,
  });

  return res.status(201).json({ msg: "success" });
});

app.listen(PORT, () => {
  console.log(`Server is running on this : ${PORT}`);
});
