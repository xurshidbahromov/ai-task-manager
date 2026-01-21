import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Trash2, CheckCircle, Circle, LogOut } from 'lucide-react';

const API_URL = 'http://localhost:8000';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [user, setUser] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [newTask, setNewTask] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (token) {
      fetchUser();
      fetchTasks();
    }
  }, [token]);

  const fetchUser = async () => {
    try {
      const res = await axios.get(`${API_URL}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUser(res.data);
    } catch (err) {
      handleLogout();
    }
  };

  const fetchTasks = async () => {
    try {
      const res = await axios.get(`${API_URL}/tasks/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTasks(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAuth = async (e) => {
    e.preventDefault();
    setError('');
    const endpoint = isLogin ? '/auth/login' : '/auth/signup';

    try {
      if (isLogin) {
        const formData = new FormData();
        formData.append('username', email);
        formData.append('password', password);
        const res = await axios.post(`${API_URL}${endpoint}`, formData);
        const newToken = res.data.access_token;
        localStorage.setItem('token', newToken);
        setToken(newToken);
      } else {
        await axios.post(`${API_URL}${endpoint}`, { email, password });
        setIsLogin(true);
        setError('Account created! Please login.');
      }
    } catch (err) {
      setError(err.response?.data?.detail || 'Authentication failed');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    setTasks([]);
  };

  const addTask = async (e) => {
    e.preventDefault();
    if (!newTask) return;
    try {
      const res = await axios.post(`${API_URL}/tasks/`,
        { title: newTask },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setTasks([res.data, ...tasks]);
      setNewTask('');
    } catch (err) {
      console.error(err);
    }
  };

  const toggleTask = async (id, currentStatus) => {
    try {
      const res = await axios.patch(`${API_URL}/tasks/${id}`,
        { is_completed: !currentStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setTasks(tasks.map(t => t.id === id ? res.data : t));
    } catch (err) {
      console.error(err);
    }
  };

  const deleteTask = async (id) => {
    try {
      await axios.delete(`${API_URL}/tasks/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTasks(tasks.filter(t => t.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  if (!token) {
    return (
      <div className="auth-container">
        <h1>{isLogin ? 'Login' : 'Sign Up'}</h1>
        {error && <p style={{ color: '#ef4444', marginBottom: '1rem' }}>{error}</p>}
        <form onSubmit={handleAuth}>
          <div className="input-group">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit">{isLogin ? 'Enter' : 'Create Account'}</button>
        </form>
        <p style={{ marginTop: '1.5rem', fontSize: '0.875rem' }}>
          {isLogin ? "Don't have an account?" : "Already have an account?"}
          <button
            style={{ background: 'none', color: '#3b82f6', width: 'auto', padding: '0 0.5rem' }}
            onClick={() => setIsLogin(!isLogin)}
          >
            {isLogin ? 'Sign Up' : 'Login'}
          </button>
        </p>
      </div>
    );
  }

  return (
    <div style={{ paddingBottom: '5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ margin: 0 }}>AI Task Manager</h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <span style={{ color: '#94a3b8' }}>{user?.email}</span>
          <button onClick={handleLogout} style={{ width: 'auto', background: '#334155' }}>
            <LogOut size={20} />
          </button>
        </div>
      </div>

      <form onSubmit={addTask} style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
        <input
          style={{ flex: 1, padding: '0.75rem', borderRadius: '0.5rem', background: '#1e293b', border: '1px solid #334155', color: 'white' }}
          type="text"
          placeholder="What needs to be done?"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
        />
        <button type="submit" style={{ width: 'auto', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Plus size={20} /> Add Task
        </button>
      </form>

      <div className="task-list">
        {tasks.map(task => (
          <div key={task.id} className={`task-item ${task.is_completed ? 'completed' : ''}`}>
            <div className="task-info">
              <button
                onClick={() => toggleTask(task.id, task.is_completed)}
                style={{ background: 'none', width: 'auto', padding: 0 }}
              >
                {task.is_completed ? <CheckCircle color="#10b981" /> : <Circle color="#94a3b8" />}
              </button>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                <span className="task-title">{task.title}</span>
                <span className={`priority-badge ${task.priority.toLowerCase()}`}>
                  AI: {task.priority}
                </span>
              </div>
            </div>
            <div className="task-actions">
              <button className="delete" onClick={() => deleteTask(task.id)}>
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
