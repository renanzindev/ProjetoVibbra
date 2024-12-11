import React from 'react';
import { DragPosition } from '../../types/todo';

interface Props {
  position: DragPosition | null;
  depth: number;
}

export const DragPreview: React.FC<Props> = ({ position, depth }) => {
  if (!position) return null;

  return (
    <div 
      className={`drag-preview drag-preview-${position}`}
      style={{ marginLeft: position === 'child' ? `${(depth + 1) * 20}px` : `${depth * 20}px` }}
    >
      <div className="drag-preview-line" />
    </div>
  );
};