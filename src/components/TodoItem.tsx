import React, { useState } from 'react';
import { ChevronDown, ChevronRight, Trash, Edit, Plus } from 'lucide-react';
import { TodoItem as TodoItemType } from '../types/todo';
import { getChildItems } from '../utils/todoUtils';

interface Props {
  item: TodoItemType;
  items: TodoItemType[];
  onUpdate: (id: string, text: string) => void;
  onDelete: (id: string) => void;
  onAddSubtask: (parentId: string, text: string) => void;
  onMove: (id: string, targetId: string | null, position: 'before' | 'after' | 'child') => void;
  depth?: number;
}

export const TodoItem: React.FC<Props> = ({
  item,
  items,
  onUpdate,
  onDelete,
  onAddSubtask,
  onMove,
  depth = 0,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);
  const [text, setText] = useState(item.text);
  const [showSubtaskForm, setShowSubtaskForm] = useState(false);
  const [newSubtaskText, setNewSubtaskText] = useState('');

  const childItems = getChildItems(items, item.id);
  const hasChildren = childItems.length > 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim()) {
      onUpdate(item.id, text);
      setIsEditing(false);
    }
  };

  const handleAddSubtask = (e: React.FormEvent) => {
    e.preventDefault();
    if (newSubtaskText.trim()) {
      onAddSubtask(item.id, newSubtaskText.trim());
      setNewSubtaskText('');
      setShowSubtaskForm(false);
    }
  };

  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData('text/plain', item.id);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const sourceId = e.dataTransfer.getData('text/plain');
    if (sourceId === item.id) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const y = e.clientY - rect.top;
    const position = y < rect.height / 3 ? 'before' : 
                    y > (rect.height * 2) / 3 ? 'after' : 
                    'child';

    onMove(sourceId, item.id, position);
  };

  return (
    <div className="todo-item" style={{ marginLeft: `${depth * 20}px` }}>
      <div 
        className="todo-item-content"
        draggable
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        {hasChildren && (
          <button onClick={() => setIsExpanded(!isExpanded)} className="todo-item-button">
            {isExpanded ? <ChevronDown className="icon" /> : <ChevronRight className="icon" />}
          </button>
        )}
        
        <div className="todo-item-text">
          {isEditing ? (
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="todo-input"
                autoFocus
              />
            </form>
          ) : (
            <span>{item.text}</span>
          )}
        </div>

        <div className="todo-item-actions">
          <button onClick={() => setShowSubtaskForm(true)} className="todo-item-button">
            <Plus className="icon" />
          </button>
          <button onClick={() => setIsEditing(!isEditing)} className="todo-item-button">
            <Edit className="icon" />
          </button>
          <button onClick={() => onDelete(item.id)} className="todo-item-button delete">
            <Trash className="icon" />
          </button>
        </div>
      </div>

      {showSubtaskForm && (
        <form onSubmit={handleAddSubtask} className="subtask-form">
          <input
            type="text"
            value={newSubtaskText}
            onChange={(e) => setNewSubtaskText(e.target.value)}
            placeholder="Add subtask..."
            className="todo-input"
            autoFocus
          />
          <div className="subtask-form-actions">
            <button type="submit" className="todo-button todo-button-blue" disabled={!newSubtaskText.trim()}>
              <Plus className="icon" />
              Add
            </button>
            <button 
              type="button" 
              onClick={() => setShowSubtaskForm(false)} 
              className="todo-button todo-button-gray"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {isExpanded && hasChildren && (
        <div className="todo-children">
          {childItems.map((child) => (
            <TodoItem
              key={child.id}
              item={child}
              items={items}
              onUpdate={onUpdate}
              onDelete={onDelete}
              onAddSubtask={onAddSubtask}
              onMove={onMove}
              depth={depth + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
};