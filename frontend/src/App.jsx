import { useState } from 'react';
import Login from "./Login";
import Upload from "./Upload";
import './App.css';

function App() {
  const [user, setUser] = useState(null);
  const DEV_MODE = false;

  const handleLogout = () => {
    setUser(null);
  };

  if (!user && !DEV_MODE) {
    return <Login onLogin={setUser} />;
  }

  return <Upload user={user} onLogout={handleLogout} />;
}

export default App;
