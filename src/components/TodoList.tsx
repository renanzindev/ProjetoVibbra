import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { TodoItem } from './TodoItem';
import { useTodoStore } from '../store/todoStore';
import { getChildItems } from '../utils/todoUtils';

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
      addItem(todoId, newItemText.trim(), null);
      setNewItemText('');
    }
  };

  const handleAddSubtask = (parentId: string, text: string) => {
    addItem(todoId, text, parentId);
  };

  if (!todo) return null;

  // Get root level items (items with no parent)
  const rootItems = getChildItems(todo.items, null);

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
        <button type="submit" className="todo-button todo-button-blue" disabled={!newItemText.trim()}>
          <Plus className="icon" />
          Add Item
        </button>
      </form>

      <div className="todo-items">
        {rootItems.map((item) => (
          <TodoItem
            key={item.id}
            item={item}
            items={todo.items}
            onUpdate={(id, text) => updateItem(todoId, id, text)}
            onDelete={(id) => deleteItem(todoId, id)}
            onAddSubtask={handleAddSubtask}
            onMove={(id, targetId, position) => moveItem(todoId, id, targetId, position)}
          />
        ))}
      </div>
    </div>
  );
};