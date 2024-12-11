import { useState, useRef } from 'react';
import { DragPosition } from '../types/todo';

interface DragAndDropProps {
  itemId: string;
  onMove: (sourceId: string, targetId: string | null, position: DragPosition) => void;
}

export const useDragAndDrop = ({ itemId, onMove }: DragAndDropProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [dropPosition, setDropPosition] = useState<DragPosition | null>(null);
  const dragRef = useRef<HTMLDivElement>(null);
  const dropRef = useRef<HTMLDivElement>(null);

  const handleDragStart = (e: React.DragEvent) => {
    setIsDragging(true);
    e.dataTransfer.setData('text/plain', itemId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragEnd = () => {
    setIsDragging(false);
    setDropPosition(null);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';

    const rect = dropRef.current?.getBoundingClientRect();
    if (!rect) return;

    const y = e.clientY - rect.top;
    const threshold = rect.height / 3;

    let position: DragPosition;
    if (y < threshold) {
      position = 'before';
    } else if (y > rect.height - threshold) {
      position = 'after';
    } else {
      position = 'child';
    }

    setDropPosition(position);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const sourceId = e.dataTransfer.getData('text/plain');
    
    if (sourceId === itemId || !dropPosition) return;
    
    onMove(sourceId, itemId, dropPosition);
    setDropPosition(null);
  };

  const handleDragLeave = () => {
    setDropPosition(null);
  };

  return {
    isDragging,
    dropPosition,
    dragRef,
    dropRef,
    handleDragStart,
    handleDragEnd,
    handleDragOver,
    handleDragLeave,
    handleDrop,
  };
};