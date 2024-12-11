import React from 'react';
import { Edit, Trash, Plus } from 'lucide-react';

interface Props {
  onEdit: () => void;
  onDelete: () => void;
  onAddSubtask: () => void;
}

export const TodoItemActions: React.FC<Props> = ({ onEdit, onDelete, onAddSubtask }) => {
  return (
    <div className="todo-item-actions">
      <button
        onClick={onAddSubtask}
        className="todo-item-button"
        aria-label="Add subtask"
      >
        <Plus className="icon" />
      </button>
      <button
        onClick={onEdit}
        className="todo-item-button"
        aria-label="Edit item"
      >
        <Edit className="icon" />
      </button>
      <button
        onClick={onDelete}
        className="todo-item-button delete"
        aria-label="Delete item"
      >
        <Trash className="icon" />
      </button>
    </div>
  );
};