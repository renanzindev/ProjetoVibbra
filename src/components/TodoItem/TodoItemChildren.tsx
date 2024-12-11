import React from 'react';
import { TodoItem } from './TodoItem';
import { TodoItem as TodoItemType } from '../../types/todo';

interface Props {
  isExpanded: boolean;
  items: TodoItemType[];
  onUpdate: (id: string, text: string) => void;
  onDelete: (id: string) => void;
  onMove: (id: string, targetId: string | null, position: 'before' | 'after' | 'child') => void;
  depth: number;
}

export const TodoItemChildren: React.FC<Props> = ({
  isExpanded,
  items,
  onUpdate,
  onDelete,
  onMove,
  depth,
}) => {
  if (!isExpanded || items.length === 0) return null;

  return (
    <div className="todo-children">
      {items.map((child) => (
        <TodoItem
          key={child.id}
          item={child}
          onUpdate={onUpdate}
          onDelete={onDelete}
          onMove={onMove}
          depth={depth}
        />
      ))}
    </div>
  );
};