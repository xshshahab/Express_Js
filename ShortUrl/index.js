const express = require("express");
const { connectMongoDB } = require("./connection");
const path = require("path");

const urlRoute = require("./routes/url");
const staticRoute = require("./routes/staticRouter");

const URL = require("./models/url");

const app = express();
const PORT = 8080;

connectMongoDB("mongodb://localhost:27017/shorturl").then(() =>
  console.log("MongoDB is connected!!")
);

// ejs start
app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

// ejs end

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/", staticRoute);

app.use("/url", urlRoute);

app.get("/url/:shortId", async (req, res) => {
  const shortId = req.params.shortId;
  const entry = await URL.findOneAndUpdate(
    { shortId },
    {
      $push: {
        visitHistory: {
          timeStamp: Date.now(),
        },
      },
    },
    { new: true } // To return the updated document
  );

  if (!entry) {
    return res.status(404).send("URL not found");
  }

  res.redirect(entry.redirectURL);
});

app.listen(PORT, () => {
  console.log(`Server Started at PORT : ${PORT}`);
});
