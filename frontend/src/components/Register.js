import React, { useState } from 'react';
import { register } from '../api';

function Register({ onRegister }) {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(username, email, password);
      setSuccess('✅ Регистрация успешна! Перенаправляем на вход...');
      setError('');
      setTimeout(onRegister, 1500);
    } catch (err) {
      setError('❌ Ошибка регистрации: ' + (err.response?.data?.detail || err.message));
      setSuccess('');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>📝 Регистрация</h2>
      {error && <div className="error">{error}</div>}
      {success && <div className="success">{success}</div>}
      <div>
        <label>Имя пользователя</label>
        <input type="text" value={username} onChange={e => setUsername(e.target.value)} required placeholder="Придумайте имя" />
      </div>
      <div>
        <label>Email</label>
        <input type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="example@mail.com" />
      </div>
      <div>
        <label>Пароль</label>
        <input type="password" value={password} onChange={e => setPassword(e.target.value)} required placeholder="Придумайте пароль" />
      </div>
      <button type="submit">Зарегистрироваться</button>
    </form>
  );
}

export default Register;