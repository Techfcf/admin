import { useState } from 'react';
import './CreateImpact.scss';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!email || !password) {
      setError('Please fill out all fields');
    } else {
      setError('');
      console.log('Logged in successfully');
      
      // Redirect to external website
      window.location.href = 'https://adminfcf.netlify.app/';
    }
  };

  return (
    <div
      className="d-flex container-fluid align-items-center flex-column"
      style={{
        background: "url('/assets/school2.png') no-repeat center center",
        backgroundSize: "cover",
        marginBottom: "0px",
        marginTop:"0px",
        marginLeft: "0px",
        height: "80vh",
        backgroundBlendMode: "lighten"
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
        <button type="submit" className="login-btn">Login</button>
      </form>
    </div>
  );
};

export default Login;
