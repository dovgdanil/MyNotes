import React, { useState, useEffect } from 'react';
import { createNote, updateNote } from '../api';

function NoteForm({ onSave, editing, onCancel }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (editing) {
      setTitle(editing.title);
      setContent(editing.content);
    } else {
      setTitle('');
      setContent('');
    }
  }, [editing]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let response;
      if (editing) {
        response = await updateNote(editing.id, title, content);
        onSave(response.data);
      } else {
        response = await createNote(title, content);
        onSave(response.data);
      }
      setTitle('');
      setContent('');
    } catch (err) {
      setError('❌ Ошибка сохранения заметки');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>{editing ? '✏️ Редактировать заметку' : '✨ Новая заметка'}</h3>
      {error && <div className="error">{error}</div>}
      <div>
        <label>Заголовок</label>
        <input type="text" value={title} onChange={e => setTitle(e.target.value)} required placeholder="Введите заголовок" />
      </div>
      <div>
        <label>Содержание</label>
        <textarea value={content} onChange={e => setContent(e.target.value)} rows="4" required placeholder="Введите текст заметки..." />
      </div>
      <button type="submit">{editing ? '💾 Сохранить' : '➕ Создать'}</button>
      {editing && <button type="button" onClick={onCancel} className="secondary">❌ Отмена</button>}
    </form>
  );
}

export default NoteForm;