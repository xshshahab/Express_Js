const express = require("express");
const users = require("./MOCK_DATA.json");

const app = express();
const PORT = 3000;

// Routes

app.get("/users", (req, res) => {
  const html = `
        <ul>
            ${users.map((user) => `<li>${user.first_name}</li></li> `).join("")}
        </ul>
    `;
  res.send(html);
});

// REST Api
app.get("/api/users", (req, res) => {
  return res.json(users);
});

app.listen(PORT, () => {
  console.log(`Server is running on this : ${PORT}`);
});
