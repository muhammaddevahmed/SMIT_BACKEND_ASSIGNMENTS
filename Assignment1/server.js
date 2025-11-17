const express = require('express');
const app = express();
const PORT = 3000;

app.use(express.json());

let users = [
  {id: 1, name: "John", email: "john@test.com"},
  {id: 2, name: "Jane", email: "jane@test.com"}
];

// GET all users
app.get('/users', (req, res) => {
  res.json(users);
});

// GET user by ID
app.get('/users/:id', (req, res) => {
  const user = users.find(u => u.id === parseInt(req.params.id));
  res.json(user || {error: 'User not found'});
});

// POST new user
app.post('/users', (req, res) => {
  const newUser = {
    id: users.length + 1,
    name: req.body.name,
    email: req.body.email
  };
  users.push(newUser);
  res.json(newUser);
});

// DELETE user
app.delete('/users/:id', (req, res) => {
  users = users.filter(u => u.id !== parseInt(req.params.id));
  res.json({message: 'User deleted'});
});

//edit user
app.patch('/users/:id', (req, res) => {
  const userId = parseInt(req.params.id);
  const userIndex = users.findIndex(u => u.id === userId);
  
  if (userIndex === -1) {
    return res.status(404).json({error: 'User not found'});
  }
  
  users[userIndex] = { ...users[userIndex], ...req.body };
  res.json(users[userIndex]);
});


app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);

});