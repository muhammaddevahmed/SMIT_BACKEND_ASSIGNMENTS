import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const API_URL = 'http://localhost:5000/api/tasks';

function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [editingTask, setEditingTask] = useState(null);

  
  const fetchTasks = async () => {
    try {
      const response = await axios.get(API_URL);
      setTasks(response.data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  
  const addTask = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    try {
      const response = await axios.post(API_URL, {
        title: title.trim(),
        description: description.trim()
      });
      setTasks([...tasks, response.data]);
      setTitle('');
      setDescription('');
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  
  const updateTask = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    try {
      const response = await axios.put(`${API_URL}/${editingTask.id}`, {
        title: title.trim(),
        description: description.trim(),
        completed: editingTask.completed
      });
      
      setTasks(tasks.map(task => 
        task.id === editingTask.id ? response.data : task
      ));
      cancelEdit();
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  
  const deleteTask = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      setTasks(tasks.filter(task => task.id !== id));
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  
  const toggleComplete = async (task) => {
    try {
      const response = await axios.put(`${API_URL}/${task.id}`, {
        ...task,
        completed: !task.completed
      });
      
      setTasks(tasks.map(t => 
        t.id === task.id ? response.data : t
      ));
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  
  const startEdit = (task) => {
    setEditingTask(task);
    setTitle(task.title);
    setDescription(task.description);
  };

  
  const cancelEdit = () => {
    setEditingTask(null);
    setTitle('');
    setDescription('');
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>Task Manager</h1>
        <p>Organize your tasks efficiently</p>
      </header>

      <div className="container">
        
        <div className="form-section">
          <h2>{editingTask ? 'Edit Task' : 'Add New Task'}</h2>
          <form onSubmit={editingTask ? updateTask : addTask} className="task-form">
            <input
              type="text"
              placeholder="Task title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="form-input"
            />
            <textarea
              placeholder="Task description (optional)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="form-textarea"
            />
            <div className="form-buttons">
              <button type="submit" className="btn btn-primary">
                {editingTask ? 'Update Task' : 'Add Task'}
              </button>
              {editingTask && (
                <button type="button" onClick={cancelEdit} className="btn btn-secondary">
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

      
        <div className="tasks-section">
          <h2>Your Tasks ({tasks.length})</h2>
          {tasks.length === 0 ? (
            <p className="no-tasks">No tasks yet. Add your first task above!</p>
          ) : (
            <div className="tasks-grid">
              {tasks.map(task => (
                <div key={task.id} className={`task-card ${task.completed ? 'completed' : ''}`}>
                  <div className="task-header">
                    <h3 
                      className={`task-title ${task.completed ? 'completed' : ''}`}
                      onClick={() => toggleComplete(task)}
                    >
                      {task.title}
                    </h3>
                    <div className="task-actions">
                      <button 
                        onClick={() => toggleComplete(task)}
                        className={`btn btn-sm ${task.completed ? 'btn-warning' : 'btn-success'}`}
                      >
                        {task.completed ? 'Undo' : 'Complete'}
                      </button>
                      <button 
                        onClick={() => startEdit(task)}
                        className="btn btn-sm btn-info"
                      >
                        Edit
                      </button>
                      <button 
                        onClick={() => deleteTask(task.id)}
                        className="btn btn-sm btn-danger"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                  {task.description && (
                    <p className="task-description">{task.description}</p>
                  )}
                  <div className="task-status">
                    <span className={`status ${task.completed ? 'completed' : 'pending'}`}>
                      {task.completed ? 'Completed' : 'Pending'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;