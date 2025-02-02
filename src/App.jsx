import { useState, useEffect } from 'react'
import LoginForm from './components/LoginForm'
import PetForm from './components/PetForm'
import './App.css'
import { getAccessToken, clearTokens, fetchWithAuth, getProfile, refreshAccessToken } from './services/authService'

function App() {
  const API_URL = "http://localhost:3000";
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = getAccessToken();
    if (token) {
      getProfile();
    }
  }, []);


  const getProfile = async () => {
    try {
      const response = await fetchWithAuth(`${API_URL}/users/profile`);
      if (response.status === 200) {
        const data = await response.json();
        setUser({ username: data.username });
      } else {
        refreshAccessToken();
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
      clearTokens();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      {!user ? (
        <LoginForm onLogin={setUser} />
      ) : (
        <div className="w-full max-w-2xl">
          <h2 className="text-xl font-bold mb-4">Welcome, {user.username}!</h2>
          <PetForm />
        </div>
      )}
    </div>
  );
}

export default App
