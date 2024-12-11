import React, { useState } from 'react';
import { Plus, X } from 'lucide-react';

interface Props {
  onSubmit: (text: string) => void;
  onCancel: () => void;
}

export const SubtaskForm: React.FC<Props> = ({ onSubmit, onCancel }) => {
  const [text, setText] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim()) {
      onSubmit(text.trim());
      setText('');
    }
  };

  return (
    <div className="subtask-form">
      <form onSubmit={handleSubmit}>
        <div className="subtask-form-content">
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Add subtask..."
            className="todo-input"
            autoFocus
          />
          <div className="subtask-form-actions">
            <button type="submit" className="todo-button todo-button-blue" disabled={!text.trim()}>
              <Plus className="icon" />
              Add
            </button>
            <button type="button" onClick={onCancel} className="todo-button todo-button-gray">
              <X className="icon" />
              Cancel
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};