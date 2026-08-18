import React, { useState, useEffect } from 'react';
import Login from './components/Login';
import Register from './components/Register';
import NotesList from './components/NotesList';
import { getNotes } from './api';

function App() {
  const [token, setToken] = useState(localStorage.getItem('access_token') || '');
  const [user, setUser] = useState(null);
  const [view, setView] = useState('login');

  useEffect(() => {
    if (token) {
      // Можно декодировать токен (простейший способ – извлечь sub)
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setUser(payload.sub);
      } catch {
        setUser('Пользователь');
      }
      setView('notes');
    } else {
      setView('login');
    }
  }, [token]);

  const handleLogin = (newToken) => {
    localStorage.setItem('access_token', newToken);
    setToken(newToken);
  };

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    setToken('');
    setUser(null);
    setView('login');
  };

  return (
    <div className="container">
      <h1>📝 Мои заметки</h1>
      {view === 'login' && (
        <>
          <Login onLogin={handleLogin} />
          <p style={{ textAlign: 'center', marginTop: '15px' }}>
            Нет аккаунта? <button className="link-button" onClick={() => setView('register')}>Зарегистрироваться</button>
          </p>
        </>
      )}
      {view === 'register' && (
        <>
          <Register onRegister={() => setView('login')} />
          <p style={{ textAlign: 'center', marginTop: '15px' }}>
            Уже есть аккаунт? <button className="link-button" onClick={() => setView('login')}>Войти</button>
          </p>
        </>
      )}
      {view === 'notes' && (
        <>
          <div className="header">
            <div className="user-info">
              <span>👋 {user || 'Пользователь'}</span>
            </div>
            <button onClick={handleLogout} className="secondary">Выйти</button>
          </div>
          <NotesList token={token} />
        </>
      )}
    </div>
  );
}

export default App;