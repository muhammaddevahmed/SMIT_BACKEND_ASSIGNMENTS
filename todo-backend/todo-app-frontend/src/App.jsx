import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const API_URL = 'http://localhost:5000/api/todos';

function App() {
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [editingTodo, setEditingTodo] = useState(null);

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      const response = await axios.get(API_URL);
      setTodos(response.data);
    } catch (error) {
      console.error('Error fetching todos:', error);
    }
  };

  const addTodo = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    try {
      const response = await axios.post(API_URL, {
        title,
        description,
      });
      setTodos([response.data, ...todos]);
      setTitle('');
      setDescription('');
    } catch (error) {
      console.error('Error adding todo:', error);
    }
  };

  const updateTodo = async (id, updates) => {
    try {
      const response = await axios.put(`${API_URL}/${id}`, updates);
      setTodos(todos.map(todo => todo._id === id ? response.data : todo));
    } catch (error) {
      console.error('Error updating todo:', error);
    }
  };

  const deleteTodo = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      setTodos(todos.filter(todo => todo._id !== id));
    } catch (error) {
      console.error('Error deleting todo:', error);
    }
  };

  const toggleComplete = async (id, completed) => {
    await updateTodo(id, { completed: !completed });
  };

  const startEdit = (todo) => {
    setEditingTodo(todo);
    setTitle(todo.title);
    setDescription(todo.description);
  };

  const cancelEdit = () => {
    setEditingTodo(null);
    setTitle('');
    setDescription('');
  };

  const submitEdit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    await updateTodo(editingTodo._id, { title, description });
    setEditingTodo(null);
    setTitle('');
    setDescription('');
  };

  return (
    <div className="App">
      <div className="container">
        <h1>Todo App</h1>
        
        {/* Todo Form */}
        <form onSubmit={editingTodo ? submitEdit : addTodo} className="todo-form">
          <input
            type="text"
            placeholder="Todo title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="form-input"
          />
          <input
            type="text"
            placeholder="Description (optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="form-input"
          />
          <div className="form-buttons">
            <button type="submit" className="btn btn-primary">
              {editingTodo ? 'Update Todo' : 'Add Todo'}
            </button>
            {editingTodo && (
              <button type="button" onClick={cancelEdit} className="btn btn-secondary">
                Cancel
              </button>
            )}
          </div>
        </form>

        {/* Todo List */}
        <div className="todo-list">
          {todos.map(todo => (
            <div key={todo._id} className={`todo-item ${todo.completed ? 'completed' : ''}`}>
              <div className="todo-content">
                <h3>{todo.title}</h3>
                {todo.description && <p>{todo.description}</p>}
                <small>{new Date(todo.createdAt).toLocaleDateString()}</small>
              </div>
              <div className="todo-actions">
                <button
                  onClick={() => toggleComplete(todo._id, todo.completed)}
                  className={`btn ${todo.completed ? 'btn-warning' : 'btn-success'}`}
                >
                  {todo.completed ? 'Undo' : 'Complete'}
                </button>
                <button
                  onClick={() => startEdit(todo)}
                  className="btn btn-info"
                >
                  Edit
                </button>
                <button
                  onClick={() => deleteTodo(todo._id)}
                  className="btn btn-danger"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;