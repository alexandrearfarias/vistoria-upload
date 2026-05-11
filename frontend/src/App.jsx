import { useState } from 'react';
import Login from "./Login";
import Upload from "./Upload";
import './App.css';

function App() {
  const [user, setUser] = useState(null);
  const DEV_MODE = false;

  if (!user && !DEV_MODE) {
    return <Login onLogin={setUser} />;
  }

  return <Upload user={user} />
}

export default App;
