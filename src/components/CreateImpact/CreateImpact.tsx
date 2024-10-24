import { useState } from 'react';
import './CreateImpact.scss';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validate input fields
    if (!email || !password) {
      setError('Please fill out all fields');
      return;
    }

    setError('');
    setLoading(true);

    // Prepare the request payload
    const payload = {
      email,
      password,
    };

    try {
      // Make the login request
      const response = await fetch('https://backend.fitclimate.com/auth/login', {
        method: 'POST',
        headers: {
          'Accept': '*/*',
          'Accept-Language': 'en-GB,en-US;q=0.9,en;q=0.8',
          'Content-Type': 'application/json',
          'Origin': 'https://fitclimate.com',
          'Referer': 'https://fitclimate.com/',
          'User-Agent': 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Mobile Safari/537.36',
        },
        body: JSON.stringify(payload),
      });

      // Check if the response is ok
      if (response.ok) {
        const data = await response.json();
        console.log('Logged in successfully', data);
        // Redirect to the external admin website
        window.location.href = 'https://admin.fitclimate.com/';
      } else {
        // Handle API error
        const data = await response.json();
        setError(data.message || 'Invalid login credentials');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Please check your user credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="d-flex container-fluid align-items-center flex-column"
      style={{
        background: "url('/assets/school2.png') no-repeat center center",
        backgroundSize: "cover",
        height: "85vh",
        backgroundBlendMode: "lighten",
      }}
    >
      <form className="login-form" onSubmit={handleLogin}>
        <h2>Login</h2>
        {error && <p className="error-message">{error}</p>}
        <div className="input-group">
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
          />
        </div>
        <div className="input-group">
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            required
          />
        </div>
        <button type="submit" className="login-btn" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </div>
  );
};

export default Login;
