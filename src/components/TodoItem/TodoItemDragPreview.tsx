import React from 'react';
import { DragPosition } from '../../types/todo';

interface Props {
  dropPosition: DragPosition | null;
}

export const TodoItemDragPreview: React.FC<Props> = ({ dropPosition }) => {
  if (!dropPosition) return null;

  return (
    <div className={`todo-item-preview todo-item-preview-${dropPosition}`}>
      <div className="todo-item-preview-line" />
      {dropPosition === 'child' && (
        <div className="todo-item-preview-indent" />
      )}
    </div>
  );
};