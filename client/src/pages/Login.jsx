import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Shield, Lock, Mail, User as UserIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    medicalId: '',
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
    try {
      const { data } = await axios.post(`http://localhost:5000${endpoint}`, formData);
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data));
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    }
  };

  return (
    <div className="login-container" style={{
      height: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'radial-gradient(circle at center, #121212 0%, #080808 100%)'
    }}>
      <motion.div 
        className="glass-panel"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        style={{
          padding: '40px',
          width: '100%',
          maxWidth: '450px',
          display: 'flex',
          flexDirection: 'column',
          gap: '24px',
          position: 'relative'
        }}
      >
        {/* DNA Helix Visualization Placeholder */}
        <motion.div 
          animate={{ 
            rotate: [0, 5, 0, -5, 0],
            scale: [1, 1.05, 1]
          }}
          transition={{ 
            duration: 8, 
            repeat: Infinity, 
            ease: "linear" 
          }}
          style={{
            position: 'absolute',
            top: '-30px',
            right: '-30px',
            color: 'var(--primary-mint)',
            opacity: 0.2
          }}
        >
          <Shield size={120} />
        </motion.div>

        <div style={{ textAlign: 'center' }}>
          <h1 className="glowing-text" style={{ fontSize: '2rem', marginBottom: '8px' }}>
            {isLogin ? 'Access Vault' : 'Create Identity'}
          </h1>
          <p style={{ color: 'var(--text-muted)' }}>
            Institutional Grade Encryption Active
          </p>
        </div>

        {error && (
          <div style={{
            background: 'rgba(255, 113, 108, 0.1)',
            color: '#ff716c',
            padding: '12px',
            borderRadius: '8px',
            border: '1px solid rgba(255, 113, 108, 0.3)',
            fontSize: '0.9rem'
          }}>
            {error}
          </div>
        )}

        <AnimatePresence mode="wait">
          <motion.form 
            key={isLogin ? 'login' : 'register'}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            onSubmit={handleSubmit} 
            style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}
          >
            {!isLogin && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="input-group"
              >
                <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-grey)' }}>Full Name</label>
                <div className="glowing-border" style={{
                  display: 'flex',
                  alignItems: 'center',
                  background: 'rgba(255, 255, 255, 0.05)',
                  borderRadius: '8px',
                  padding: '0 12px'
                }}>
                  <UserIcon size={18} color="var(--primary-mint)" />
                  <input
                    type="text"
                    name="name"
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    style={{
                      background: 'transparent',
                      border: 'none',
                      padding: '12px',
                      color: 'white',
                      width: '100%',
                      outline: 'none'
                    }}
                  />
                </div>
              </motion.div>
            )}

            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="input-group"
            >
              <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-grey)' }}>Email Address</label>
              <div className="glowing-border" style={{
                display: 'flex',
                alignItems: 'center',
                background: 'rgba(255, 255, 255, 0.05)',
                borderRadius: '8px',
                padding: '0 12px'
              }}>
                <Mail size={18} color="var(--primary-mint)" />
                <input
                  type="email"
                  name="email"
                  placeholder="doctor@vault.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  style={{
                    background: 'transparent',
                    border: 'none',
                    padding: '12px',
                    color: 'white',
                    width: '100%',
                    outline: 'none'
                  }}
                />
              </div>
            </motion.div>

            {!isLogin && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="input-group"
              >
                <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-grey)' }}>Medical ID</label>
                <div className="glowing-border" style={{
                  display: 'flex',
                  alignItems: 'center',
                  background: 'rgba(255, 255, 255, 0.05)',
                  borderRadius: '8px',
                  padding: '0 12px'
                }}>
                  <Shield size={18} color="var(--primary-mint)" />
                  <input
                    type="text"
                    name="medicalId"
                    placeholder="DHV-8829-X"
                    value={formData.medicalId}
                    onChange={handleChange}
                    required
                    style={{
                      background: 'transparent',
                      border: 'none',
                      padding: '12px',
                      color: 'white',
                      width: '100%',
                      outline: 'none'
                    }}
                  />
                </div>
              </motion.div>
            )}

            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="input-group"
            >
              <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-grey)' }}>Cipher Key (Password)</label>
              <div className="glowing-border" style={{
                display: 'flex',
                alignItems: 'center',
                background: 'rgba(255, 255, 255, 0.05)',
                borderRadius: '8px',
                padding: '0 12px'
              }}>
                <Lock size={18} color="var(--primary-mint)" />
                <input
                  type="password"
                  name="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  style={{
                    background: 'transparent',
                    border: 'none',
                    padding: '12px',
                    color: 'white',
                    width: '100%',
                    outline: 'none'
                  }}
                />
              </div>
            </motion.div>

            <motion.button 
              className="btn-primary" 
              type="submit" 
              style={{ marginTop: '12px', justifyContent: 'center' }}
              whileHover={{ scale: 1.02, boxShadow: '0 0 20px var(--primary-glow)' }}
              whileTap={{ scale: 0.98 }}
            >
              {isLogin ? 'Engage Vault' : 'Initialize Vault'}
            </motion.button>
          </motion.form>
        </AnimatePresence>

        <div style={{ textAlign: 'center', marginTop: '8px' }}>
          <button 
            onClick={() => setIsLogin(!isLogin)}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--primary-mint)',
              cursor: 'pointer',
              fontSize: '0.9rem'
            }}
          >
            {isLogin ? 'Need clearance? Register Identity' : 'Already verified? Access Vault'}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
