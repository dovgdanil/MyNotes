import React, { useState, useEffect } from 'react';
import { getNotes, deleteNote } from '../api';
import NoteForm from './NoteForm';

function NotesList({ token }) {
  const [notes, setNotes] = useState([]);
  const [editing, setEditing] = useState(null);
  const [error, setError] = useState('');

  const loadNotes = async () => {
    try {
      const response = await getNotes();
      setNotes(response.data);
    } catch (err) {
      setError('❌ Не удалось загрузить заметки');
    }
  };

  useEffect(() => {
    loadNotes();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Удалить заметку?')) return;
    try {
      await deleteNote(id);
      setNotes(notes.filter(n => n.id !== id));
    } catch (err) {
      setError('❌ Ошибка удаления');
    }
  };

  const handleEdit = (note) => {
    setEditing(note);
  };

  const handleSave = (savedNote) => {
    if (editing) {
      setNotes(notes.map(n => n.id === savedNote.id ? savedNote : n));
      setEditing(null);
    } else {
      setNotes([savedNote, ...notes]);
    }
  };

  const handleCancelEdit = () => setEditing(null);

  return (
    <div>
      <h2>📋 Ваши заметки</h2>
      {error && <div className="error">{error}</div>}
      <NoteForm onSave={handleSave} editing={editing} onCancel={handleCancelEdit} />
      <div>
        {notes.length === 0 && <p style={{ textAlign: 'center', color: '#718096', marginTop: '30px' }}>📭 Нет заметок. Создайте первую!</p>}
        {notes.map(note => (
          <div key={note.id} className="note-item">
            <h3>📄 {note.title}</h3>
            <p>{note.content}</p>
            <small>🕒 {new Date(note.created_at).toLocaleString()}</small>
            <div className="actions">
              <button onClick={() => handleEdit(note)}>✏️ Редактировать</button>
              <button onClick={() => handleDelete(note.id)} className="danger">🗑️ Удалить</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default NotesList;