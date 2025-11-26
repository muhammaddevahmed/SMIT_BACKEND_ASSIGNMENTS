const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 5000;


app.use(cors());
app.use(express.json());


let tasks = [
  { id: 1, title: 'Learn React', description: 'Study React fundamentals', completed: false },
  { id: 2, title: 'Build API', description: 'Create Express backend', completed: true }
];
let nextId = 3;



app.get('/api/tasks', (req, res) => {
  res.json(tasks);
});


app.get('/api/tasks/:id', (req, res) => {
  const task = tasks.find(t => t.id === parseInt(req.params.id));
  if (!task) return res.status(404).json({ message: 'Task not found' });
  res.json(task);
});


app.post('/api/tasks', (req, res) => {
  const { title, description } = req.body;
  
  if (!title) {
    return res.status(400).json({ message: 'Title is required' });
  }

  const newTask = {
    id: nextId++,
    title,
    description: description || '',
    completed: false
  };

  tasks.push(newTask);
  res.status(201).json(newTask);
});


app.put('/api/tasks/:id', (req, res) => {
  const taskIndex = tasks.findIndex(t => t.id === parseInt(req.params.id));
  
  if (taskIndex === -1) {
    return res.status(404).json({ message: 'Task not found' });
  }

  const { title, description, completed } = req.body;
  
  tasks[taskIndex] = {
    ...tasks[taskIndex],
    title: title || tasks[taskIndex].title,
    description: description !== undefined ? description : tasks[taskIndex].description,
    completed: completed !== undefined ? completed : tasks[taskIndex].completed
  };

  res.json(tasks[taskIndex]);
});


app.delete('/api/tasks/:id', (req, res) => {
  const taskIndex = tasks.findIndex(t => t.id === parseInt(req.params.id));
  
  if (taskIndex === -1) {
    return res.status(404).json({ message: 'Task not found' });
  }

  tasks.splice(taskIndex, 1);
  res.json({ message: 'Task deleted successfully' });
});


app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});