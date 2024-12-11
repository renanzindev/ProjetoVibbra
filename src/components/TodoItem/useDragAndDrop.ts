import { useState, useRef } from 'react';
import { TodoItem, DragPosition } from '../../types/todo';

interface UseDragAndDropProps {
  item: TodoItem;
  onMove: (id: string, targetId: string | null, position: DragPosition) => void;
}

export const useDragAndDrop = ({ item, onMove }: UseDragAndDropProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [dropPosition, setDropPosition] = useState<DragPosition | null>(null);
  const dragRef = useRef<HTMLDivElement>(null);
  const dropRef = useRef<HTMLDivElement>(null);

  const handleDragStart = (e: React.DragEvent) => {
    setIsDragging(true);
    e.dataTransfer.setData('text/plain', item.id);
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

  const handleDragLeave = () => {
    setDropPosition(null);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const sourceId = e.dataTransfer.getData('text/plain');
    
    if (sourceId === item.id || !dropPosition) return;
    
    onMove(sourceId, item.id, dropPosition);
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