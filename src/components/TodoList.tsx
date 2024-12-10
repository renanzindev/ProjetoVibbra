import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { TodoItem } from './TodoItem';
import { useTodoStore } from '../store/todoStore';

interface Props {
  todoId: string;
}

export const TodoList: React.FC<Props> = ({ todoId }) => {
  const [newItemText, setNewItemText] = useState('');
  const { todos, addItem, updateItem, deleteItem, moveItem } = useTodoStore();
  const todo = todos[todoId];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newItemText.trim()) {
      addItem(todoId, newItemText.trim());
      setNewItemText('');
    }
  };

  if (!todo) return null;

  return (
    <div className="todo-list">
      <form onSubmit={handleSubmit} className="todo-form">
        <input
          type="text"
          value={newItemText}
          onChange={(e) => setNewItemText(e.target.value)}
          placeholder="Add new item..."
          className="todo-input"
        />
        <button type="submit" className="todo-button todo-button-blue">
          <Plus className="icon" />
          Add Item
        </button>
      </form>

      <div className="todo-items">
        {todo.items.map((item) => (
          <TodoItem
            key={item.id}
            item={item}
            onUpdate={(id, text) => updateItem(todoId, id, text)}
            onDelete={(id) => deleteItem(todoId, id)}
            onMove={(id, newParentId) => moveItem(todoId, id, newParentId)}
          />
        ))}
      </div>
    </div>
  );
};