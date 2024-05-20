const express = require("express");
const uuid = require("uuid");
const port = process.env.PORT || 3001;
const app = express();
const cors = require("cors");

app.use(express.json());
app.use(cors());

const users = [{"id": 1, "name": "TESTE", "age": 22}];

const checkUserId = (req, res, next) => {
  const { id } = req.params;

  const index = users.findIndex((user) => user.id === id);

  if (index < 0) {
    return res.status(404).json({ error: "User not found" });
  }
  req.userIndex = index;
  req.userId = id;
  next();
};

app.get("/users", (req, res) => {
  return res.json(users);
});

app.post("/user", (req, res) => {
  const { name, age } = req.body;
  const user = { name, age, id: uuid.v4() };
  users.push(user);

  return res.status(201).json(user);
});

app.put("/user/:id", checkUserId, (req, res) => {
  const id = req.userId;
  const index = req.userIndex;

  const { name, age } = req.body;

  const updateUser = { name, age, id };

  users[index] = updateUser;

  return res.json(updateUser);
});

app.delete("/user/:id", checkUserId, (req, res) => {
  const index = req.userIndex;
  users.splice(index, 1);

  return res.status(204).json({ message: "User Deleted" });
});

app.listen(port, () => {
  console.log(`Server Started On Port ${port}`);
});
