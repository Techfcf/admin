
import './CreateImpact.scss';
const Login = () => {
  return (
    
    <>
    <div 
      className="d-flex container-fluid align-items-center flex-column" 
      style={{
        background: "url('/assets/school2.png') no-repeat center center",
        backgroundSize: "cover",
        marginBottom: "0px",
        marginLeft:"0px",
        height: "95vh",
        backgroundBlendMode: "lighten"
      }}
    ></div>
      <section>
        <div className="auth">
          <h1>Login</h1>
          <form action="">
            <input
              type="text"
              name="username"
              id="username"
              autoComplete="off"
              placeholder="Username"
              required={true}
            />
            <input
              type="password"
              name="password"
              id="password"
              placeholder="Password"
              required={true}
            />
            <button type="submit">Login</button>
          </form>
        </div>
      </section>
    </>
  );
};

export default Login;