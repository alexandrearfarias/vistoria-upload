import { GoogleLogin } from "@react-oauth/google";

function Login({ onLogin }) {

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <div className="card shadow p-4" style={{ width: "350px"}}>
        <h3 className="text-center mb-4">Organizador Drive</h3>
        <div className="d-flex justify-content-center">
            <GoogleLogin
                onSuccess={(credentialResponse) => {
                console.log(credentialResponse);
                onLogin(credentialResponse);
                }}
                onError={() => {
                alert("Erro no login");
                }}
            />
        </div>
      </div>

    </div>
  );
}

export default Login;