const express = require("express");
const fs = require("fs");
const users = require("./MOCK_DATA.json");

const app = express();
const PORT = 3000;

// Middleware
app.use(express.urlencoded({ extended: false }));

// Routes

app.get("/users", (req, res) => {
  const html = `
        <ul>
            ${users.map((user) => `<li>${user.first_name}</li>`).join("")}
        </ul>
    `;
  res.send(html);
});

// REST Api
app.get("/api/users", (req, res) => {
  return res.json(users);
});

app.get("/api/users/:id", (req, res) => {
  const id = req.params.id;
  const user = users.find((user) => user.id === parseInt(id));
  return res.json(user);
});

app.post("/api/users", (req, res) => {
  const body = req.body;
  users.push({ ...body, id: users.length + 1 });
  fs.writeFile("./MOCK_DATA.json", JSON.stringify(users), (err, data) => {
    return res.json({ status: "success", id: users.length });
  });
});

app.patch("/api/users/:id", (req, res) => {
  // Todo : Edit existing users.
  return res.json({ status: "pending" });
});

app.delete("/api/users/:id", (req, res) => {
  const id = req.params.id;

  // Use the filter method to create a new array without the user to delete
  users = users.filter((user) => user.id !== id);
  return res.json({ status: "deleted", id });
});

app.listen(PORT, () => {
  console.log(`Server is running on this : ${PORT}`);
});

/*  Good Practice but i use old for practice 

//  [  /api/users/:id  ]  -> I can see that this route is use for many time. I can directly create a app.route method and use chaining for particular HTTP requests is easy to handle and understand.

app
  .route("/api/users/:id")
  .get((req, res) => {
    const id = req.params.id;
    const user = users.find((user) => user.id === parseInt(id));
    return res.json(user);
  })
  .patch((req, res) => {
    // Todo : Edit existing users.
    return res.json({ status: "pending" });
  })
  .delete((req, res) => {
    // Todo :Delete this existing data. by id
    return res.json({ status: "pending" });
  });


  */
