import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Check, LogOut, Loader2, Mail, Lock, Sparkles } from 'lucide-react';

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
  const [loading, setLoading] = useState(false);

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
    setLoading(true);
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
        setError('Account created! Now enter your credentials.');
      }
    } catch (err) {
      setError(err.response?.data?.detail || 'Something went wrong');
    } finally {
      setLoading(false);
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
    if (!newTask.trim()) return;
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
      <div className="auth-wrapper">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="auth-card"
        >
          <h1>{isLogin ? 'Welcome' : 'Join Us'}</h1>
          <p className="subtitle">{isLogin ? 'Login to manage your goals' : 'Start your AI-powered journey'}</p>

          {error && <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ color: '#f87171', marginBottom: '1.5rem', fontSize: '0.9rem' }}>{error}</motion.p>}

          <form onSubmit={handleAuth}>
            <div className="input-field">
              <label><Mail size={14} style={{ marginRight: 6 }} /> Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="adam@obsidian.com"
                required
              />
            </div>
            <div className="input-field">
              <label><Lock size={14} style={{ marginRight: 6 }} /> Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
            </div>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? <Loader2 className="animate-spin mx-auto" size={20} /> : (isLogin ? 'Login' : 'Create Account')}
            </button>
          </form>

          <div style={{ marginTop: '2rem', textAlign: 'center' }}>
            <span style={{ color: '#64748b' }}>{isLogin ? "New here?" : "Joined already?"}</span>
            <button
              className="text-btn"
              style={{ background: 'none', color: '#60a5fa', border: 'none', padding: '0 0.5rem', cursor: 'pointer', fontWeight: 600 }}
              onClick={() => setIsLogin(!isLogin)}
            >
              {isLogin ? 'Setup Account' : 'Direct Login'}
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <header className="header">
        <div className="logo-text">
          <span style={{ color: '#60a5fa' }}>AI</span> Agent.
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.9rem', fontWeight: 600 }}>{user?.email.split('@')[0]}</div>
            <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{user?.email}</div>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleLogout}
            className="delete-btn"
            style={{ opacity: 1, borderRadius: '1rem', background: 'rgba(255,255,255,0.05)' }}
          >
            <LogOut size={18} />
          </motion.button>
        </div>
      </header>

      <motion.form
        layout
        onSubmit={addTask}
        className="add-task-form"
      >
        <input
          type="text"
          placeholder="I need to..."
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
        />
        <button type="submit" className="add-btn">
          <Plus size={20} /> Add
        </button>
      </motion.form>

      <div className="task-grid">
        <AnimatePresence mode='popLayout'>
          {tasks.map(task => (
            <motion.div
              key={task.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className={`task-card ${task.is_completed ? 'completed' : ''}`}
            >
              <div className="task-main">
                <button
                  onClick={() => toggleTask(task.id, task.is_completed)}
                  className={`check-btn ${task.is_completed ? 'done' : ''}`}
                >
                  {task.is_completed && <Check size={16} color="white" />}
                </button>
                <div className="task-content">
                  <div className="title">{task.title}</div>
                  <div className="ai-meta">
                    <span className={`priority-tag ${task.priority.toLowerCase()}`}>
                      <Sparkles size={10} style={{ marginRight: 4 }} />
                      {task.priority}
                    </span>
                  </div>
                </div>
              </div>
              <button className="delete-btn" onClick={() => deleteTask(task.id)}>
                <Trash2 size={18} />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>

        {tasks.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.3 }}
            style={{ textAlign: 'center', padding: '4rem' }}
          >
            <p>Your task list is empty. Start by adding one!</p>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}

export default App;
