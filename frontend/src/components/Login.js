import React, { useState } from 'react';
import { login } from '../api';

function Login({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await login(username, password);
      onLogin(response.data.access_token);
    } catch (err) {
      setError('❌ Ошибка входа: ' + (err.response?.data?.detail || err.message));
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>🔐 Вход</h2>
      {error && <div className="error">{error}</div>}
      <div>
        <label>Имя пользователя</label>
        <input type="text" value={username} onChange={e => setUsername(e.target.value)} required placeholder="Введите имя" />
      </div>
      <div>
        <label>Пароль</label>
        <input type="password" value={password} onChange={e => setPassword(e.target.value)} required placeholder="Введите пароль" />
      </div>
      <button type="submit">Войти</button>
    </form>
  );
}

export default Login;