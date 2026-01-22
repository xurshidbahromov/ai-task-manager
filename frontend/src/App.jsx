import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Check, LogOut, Loader2, Mail, Lock, Sparkles, Wand2, X, Flame, User as UserIcon, DollarSign, TrendingUp, TrendingDown, ArrowRightLeft } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || (window.location.hostname === 'localhost' ? 'http://localhost:8000' : '/api');

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [user, setUser] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [newTask, setNewTask] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  // Finance State
  const [inputMode, setInputMode] = useState('task'); // 'task', 'income', 'expense'
  const [amount, setAmount] = useState('');
  const [financeSummary, setFinanceSummary] = useState({ total_income: 0, total_expense: 0, net_balance: 0 });

  useEffect(() => {
    if (token) {
      fetchUser();
      fetchTasks();
      fetchTransactions();
      fetchFinance();
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

  const fetchTransactions = async () => {
    try {
      const res = await axios.get(`${API_URL}/transactions/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTransactions(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchFinance = async () => {
    try {
      const res = await axios.get(`${API_URL}/transactions/summary`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setFinanceSummary(res.data);
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
    setTransactions([]);
  };

  const handleAddItem = async (e) => {
    e.preventDefault();
    if (inputMode === 'task') {
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
    } else {
      // Handle Transaction
      if (!newTask.trim() || !amount) return;
      try {
        const res = await axios.post(`${API_URL}/transactions/`,
          {
            amount: parseFloat(amount),
            type: inputMode,
            description: newTask
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setTransactions([res.data, ...transactions]);
        setNewTask('');
        setAmount('');
        setInputMode('task'); // Reset to task mode
        fetchFinance(); // Refresh summary
      } catch (err) {
        console.error(err);
      }
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

  const decomposeTask = async (id) => {
    try {
      const res = await axios.post(`${API_URL}/tasks/${id}/decompose`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTasks(tasks.map(t => t.id === id ? res.data : t));
    } catch (err) {
      console.error(err);
    }
  };

  // Combine and sort items just before rendering
  const allItems = [
    ...(Array.isArray(tasks) ? tasks : []).map(t => ({ ...t, itemType: 'task' })),
    ...transactions.map(t => ({ ...t, itemType: 'transaction' }))
  ].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

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
        <div className="logo-text" style={{ fontFamily: '"Outfit", sans-serif', letterSpacing: '0.05em' }}>
          AETHER<span style={{ color: '#60a5fa' }}>.</span>
        </div>
        <div className="user-profile">
          <motion.div
            whileHover={{ scale: 1.02 }}
            onClick={() => setShowProfile(true)}
            style={{ textAlign: 'right', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.75rem' }}
          >
            <div>
              <div style={{ fontSize: '0.9rem', fontWeight: 600 }}>{user?.email.split('@')[0]}</div>
              <div style={{ fontSize: '0.75rem', color: '#64748b', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '4px' }}>
                <Flame size={12} color="#fbbf24" fill="#fbbf24" /> {user?.streak || 0}
              </div>
            </div>
            <div className="profile-avatar header-avatar" style={{ margin: 0 }}>
              {user?.email[0].toUpperCase()}
            </div>
          </motion.div>
        </div>
      </header>

      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
        <button
          onClick={() => setInputMode('task')}
          className={`mode-btn ${inputMode === 'task' ? 'active' : ''}`}
        >
          <Check size={16} /> Task
        </button>
        <button
          onClick={() => setInputMode('income')}
          className={`mode-btn ${inputMode === 'income' ? 'active income' : ''}`}
        >
          <TrendingUp size={16} /> Income
        </button>
        <button
          onClick={() => setInputMode('expense')}
          className={`mode-btn ${inputMode === 'expense' ? 'active expense' : ''}`}
        >
          <TrendingDown size={16} /> Expense
        </button>
      </div>

      <motion.form
        layout
        onSubmit={handleAddItem}
        className={`add-task-form ${inputMode}`}
      >
        {inputMode !== 'task' && (
          <div className="finance-controls" style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <div className="custom-number-input">
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0"
              />
              <div className="spinners">
                <button type="button" onClick={() => setAmount(String(Number(amount || 0) + 10000))}>▲</button>
                <button type="button" onClick={() => setAmount(String(Math.max(0, Number(amount || 0) - 10000)))}>▼</button>
              </div>
            </div>
            <span style={{ fontSize: '0.9rem', fontWeight: 600, color: '#94a3b8' }}>SO'M</span>
          </div>
        )}
        <input
          type="text"
          placeholder={inputMode === 'task' ? "I need to..." : (inputMode === 'income' ? "Salary, Freelance..." : "Lunch, Uber, Rent...")}
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
        />
        <button type="submit" className="add-btn">
          {inputMode === 'task' ? <Plus size={20} /> : <DollarSign size={20} />}
          {inputMode === 'task' ? 'Add' : 'Save'}
        </button>
      </motion.form>

      <div className="task-grid">
        <AnimatePresence mode='popLayout'>
          {allItems.map(item => (
            item.itemType === 'task' ? (
              // TASK CARD
              <motion.div
                key={`task-${item.id}`}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className={`task-card ${item.is_completed ? 'completed' : ''}`}
                style={{ flexDirection: 'column', alignItems: 'flex-start' }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
                  <div className="task-main">
                    <button
                      onClick={() => toggleTask(item.id, item.is_completed)}
                      className={`check-btn ${item.is_completed ? 'done' : ''}`}
                    >
                      {item.is_completed && <Check size={16} color="white" />}
                    </button>
                    <div className="task-content">
                      <div className="title">{item.title}</div>
                      <div className="ai-meta">
                        <span className={`priority-tag ${item.priority.toLowerCase()}`}>
                          <Sparkles size={10} style={{ marginRight: 4 }} />
                          {item.priority}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    {!item.subtasks && (
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="magic-btn"
                        onClick={() => decomposeTask(item.id)}
                        title="AI Strategy"
                      >
                        <Wand2 size={18} />
                      </motion.button>
                    )}
                    <button className="delete-btn" onClick={() => deleteTask(item.id)}>
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>

                {item.subtasks && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="subtasks-container"
                  >
                    <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#8b5cf6', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Sparkles size={12} /> AI STRATEGY
                    </div>
                    {JSON.parse(item.subtasks).map((step, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="subtask-item"
                      >
                        <div className="subtask-dot" />
                        {step}
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </motion.div>
            ) : (
              // TRANSACTION CARD
              <motion.div
                key={`trans-${item.id}`}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="task-card transaction-card"
                style={{
                  borderLeft: `3px solid ${item.type === 'income' ? '#10b981' : '#ef4444'}`,
                  alignItems: 'center'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', width: '100%' }}>
                  <div style={{
                    width: 40, height: 40, borderRadius: '12px',
                    background: item.type === 'income' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: item.type === 'income' ? '#10b981' : '#ef4444'
                  }}>
                    {item.type === 'income' ? <TrendingUp size={20} /> : <TrendingDown size={20} />}
                  </div>

                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, fontSize: '1rem' }}>{item.description}</div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{item.category} • {new Date(item.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                  </div>

                  <div style={{ fontWeight: 700, fontSize: '1.25rem', color: item.type === 'income' ? '#10b981' : '#ef4444' }}>
                    {item.type === 'income' ? '+' : '-'}{item.amount.toLocaleString()} so'm
                  </div>
                </div>
              </motion.div>
            )
          ))}
        </AnimatePresence>

        {allItems.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.3 }}
            style={{ textAlign: 'center', padding: '4rem' }}
          >
            <p>Your timeline is empty. Start by adding a task or transaction!</p>
          </motion.div>
        )}
      </div>

      <AnimatePresence>
        {showProfile && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="profile-overlay"
            onClick={() => setShowProfile(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="profile-card"
              onClick={e => e.stopPropagation()}
            >
              <button className="close-btn" onClick={() => setShowProfile(false)}>
                <X size={20} />
              </button>

              <div className="profile-avatar">
                {user?.email[0].toUpperCase()}
              </div>

              <h2 style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>{user?.email.split('@')[0]}</h2>
              <p style={{ color: '#64748b', marginBottom: '1.5rem' }}>{user?.email}</p>

              <div className="streak-badge">
                <Flame size={20} fill="#fbbf24" />
                <span>{user?.streak || 0} DAY STREAK</span>
              </div>

              <div style={{ marginTop: '2.5rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1.5rem', borderRadius: '1.5rem', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#60a5fa' }}>{tasks.length}</div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase' }}>Active Tasks</div>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1.5rem', borderRadius: '1.5rem', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#10b981' }}>{tasks.filter(t => t.is_completed).length}</div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase' }}>Completed</div>
                </div>
              </div>

              <div style={{ marginTop: '1.5rem', background: 'rgba(0,0,0,0.2)', borderRadius: '1.5rem', padding: '1.5rem' }}>
                <h3 style={{ fontSize: '1rem', color: '#94a3b8', marginBottom: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                  <DollarSign size={16} /> FINANCE TRACKER
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.5rem', textAlign: 'center' }}>
                  <div>
                    <div style={{ color: '#10b981', fontWeight: 700 }}>+{financeSummary.total_income.toLocaleString()}</div>
                    <div style={{ fontSize: '0.65rem', color: '#64748b' }}>INCOME (UZS)</div>
                  </div>
                  <div>
                    <div style={{ color: '#ef4444', fontWeight: 700 }}>-{financeSummary.total_expense.toLocaleString()}</div>
                    <div style={{ fontSize: '0.65rem', color: '#64748b' }}>EXPENSE (UZS)</div>
                  </div>
                  <div>
                    <div style={{ color: '#60a5fa', fontWeight: 700 }}>{financeSummary.net_balance.toLocaleString()}</div>
                    <div style={{ fontSize: '0.65rem', color: '#64748b' }}>BALANCE (UZS)</div>
                  </div>
                </div>
              </div>

              <button
                onClick={handleLogout}
                className="btn-primary"
                style={{ marginTop: '2rem', background: 'rgba(239, 68, 68, 0.1)', color: '#f87171', border: '1px solid rgba(239, 68, 68, 0.2)' }}
              >
                Sign Out
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default App;
