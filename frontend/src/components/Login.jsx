import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignup, setIsSignup] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async () => {
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    const endpoint = isSignup ? '/signup' : '/login';
    try {
      const response = await axios.post(`http://localhost:8000${endpoint}`, {
        email,
        password,
      });
      if (isSignup) {
        alert('Signup successful! Please login.');
        setIsSignup(false);
      } else {
        localStorage.setItem('token', response.data.token);
        navigate('/upload');
      }
      setError('');
      setEmail('');
      setPassword('');
    } catch (error) {
      setError(error.response?.data?.detail || 'Operation failed');
    }
  };

  return (
    <div className="card">
      <h2 className="card-title">{isSignup ? 'Sign Up' : 'Login'}</h2>
      <div className="mb-4">
        <label htmlFor="email" className="label">
          Email
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          className="input"
        />
      </div>
      <div className="mb-6">
        <label htmlFor="password" className="label">
          Password
        </label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter your password"
          className="input"
        />
      </div>
      <button
        onClick={handleSubmit}
        className="button"
        disabled={!email || !password}
      >
        {isSignup ? 'Sign Up' : 'Login'}
      </button>
      {error && <p className="error">{error}</p>}
      <p className="text-sm">
        {isSignup ? 'Already have an account?' : 'Need an account?'}
        <span
          className="link"
          onClick={() => setIsSignup(!isSignup)}
        >
          {isSignup ? 'Login' : 'Sign Up'}
        </span>
      </p>
    </div>
  );
}

export default Login;