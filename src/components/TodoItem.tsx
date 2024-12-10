import React, { useState } from 'react';
import { ChevronDown, ChevronRight, Trash, Edit, MoveVertical } from 'lucide-react';
import { TodoItem as TodoItemType } from '../types/todo';

interface Props {
  item: TodoItemType;
  onUpdate: (id: string, text: string) => void;
  onDelete: (id: string) => void;
  onMove: (id: string, newParentId: string | null) => void;
  depth?: number;
}

export const TodoItem: React.FC<Props> = ({
  item,
  onUpdate,
  onDelete,
  onMove,
  depth = 0,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);
  const [text, setText] = useState(item.text);
  const [isMoving, setIsMoving] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate(item.id, text);
    setIsEditing(false);
  };

  const handleMove = (newParentId: string | null) => {
    onMove(item.id, newParentId);
    setIsMoving(false);
  };

  return (
    <div className="todo-item">
      <div className="todo-item-content">
        {item.children.length > 0 && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="todo-item-button"
          >
            {isExpanded ? (
              <ChevronDown className="icon" />
            ) : (
              <ChevronRight className="icon" />
            )}
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
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="todo-item-button"
          >
            <Edit className="icon" />
          </button>
          <button
            onClick={() => setIsMoving(!isMoving)}
            className="todo-item-button"
          >
            <MoveVertical className="icon" />
          </button>
          <button
            onClick={() => onDelete(item.id)}
            className="todo-item-button delete"
          >
            <Trash className="icon" />
          </button>
        </div>
      </div>

      {isMoving && (
        <div className="todo-move-options">
          <button
            onClick={() => handleMove(null)}
            className="todo-move-option"
          >
            Move to root
          </button>
        </div>
      )}

      {isExpanded && item.children.length > 0 && (
        <div className="todo-children">
          {item.children.map((child) => (
            <TodoItem
              key={child.id}
              item={child}
              onUpdate={onUpdate}
              onDelete={onDelete}
              onMove={onMove}
              depth={depth + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
};