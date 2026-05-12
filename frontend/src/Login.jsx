import { useGoogleLogin } from "@react-oauth/google";

function Login({ onLogin }) {
  const login = useGoogleLogin({
    scope: "https://www.googleapis.com/auth/drive https://www.googleapis.com/auth/userinfo.email",

    onSuccess: tokenResponse => {
      onLogin(tokenResponse);
    },

    onError: () => {
      alert("Erro ao fazer login");
    }
  });

  const backgroundStyle = {
    minHeight: "100vh",
    background: "linear-gradient(180deg, #ffffff 0%, #88b1fd 60%, #2e77ff 100%)",
    display: "flex",
    alignItems: "center"
  };

  return (
    <div style={backgroundStyle}>
      <div className="container">
        <div className="d-flex justify-content-center align-items-center vh-100">
          <div className="card shadow p-4" style={{ width: "350px" }}>
            <h3 className="text-center mb-4">Organizador Drive</h3>
            <div className="d-flex justify-content-center">
              <button className="btn btn-primary btn-lg" onClick={() => login()}> Entrar com o Google</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
