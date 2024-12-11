import React from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';

interface Props {
  text: string;
  isEditing: boolean;
  isExpanded: boolean;
  hasChildren: boolean;
  onExpand: () => void;
  onSubmit: (e: React.FormEvent) => void;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const TodoItemContent: React.FC<Props> = ({
  text,
  isEditing,
  isExpanded,
  hasChildren,
  onExpand,
  onSubmit,
  onChange,
}) => {
  return (
    <div className="todo-item-main">
      {hasChildren && (
        <button
          onClick={onExpand}
          className="todo-item-expand"
          aria-label={isExpanded ? 'Collapse' : 'Expand'}
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
          <form onSubmit={onSubmit}>
            <input
              type="text"
              value={text}
              onChange={onChange}
              className="todo-input"
              autoFocus
            />
          </form>
        ) : (
          <span>{text}</span>
        )}
      </div>
    </div>
  );
};