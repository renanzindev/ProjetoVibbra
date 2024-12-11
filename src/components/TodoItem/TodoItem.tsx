import React, { useState, useRef } from 'react';
import { ChevronDown, ChevronRight, Trash, Edit, Plus } from 'lucide-react';
import { TodoItem as TodoItemType, DragPosition } from '../../types/todo';
import { getChildItems } from '../../utils/todoUtils';
import { DragPreview } from './DragPreview';
import { SubtaskForm } from './SubtaskForm';

interface Props {
  item: TodoItemType;
  items: TodoItemType[];
  onUpdate: (id: string, text: string) => void;
  onDelete: (id: string) => void;
  onAddSubtask: (parentId: string, text: string) => void;
  onMove: (id: string, targetId: string | null, position: DragPosition) => void;
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
  const [dragPosition, setDragPosition] = useState<DragPosition | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);

  const itemRef = useRef<HTMLDivElement>(null);
  const childItems = getChildItems(items, item.id);
  const hasChildren = childItems.length > 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim()) {
      onUpdate(item.id, text);
      setIsEditing(false);
    }
  };

  const handleDragStart = (e: React.DragEvent) => {
    setIsDragging(true);
    e.dataTransfer.setData('text/plain', item.id);
    e.dataTransfer.effectAllowed = 'move';

    // Hide drag preview
    const dragPreview = new Image();
    dragPreview.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
    e.dataTransfer.setDragImage(dragPreview, 0, 0);
  };

  const handleDragEnd = () => {
    setIsDragging(false);
    setDragPosition(null);
    setIsDragOver(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!itemRef.current) return;
    
    setIsDragOver(true);
    e.dataTransfer.dropEffect = 'move';

    const rect = itemRef.current.getBoundingClientRect();
    const y = e.clientY - rect.top;
    const relativeY = y / rect.height;

    let position: DragPosition;
    if (relativeY < 0.25) {
      position = 'before';
    } else if (relativeY > 0.75) {
      position = 'after';
    } else {
      position = 'child';
    }

    setDragPosition(position);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    setDragPosition(null);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const sourceId = e.dataTransfer.getData('text/plain');
    if (sourceId === item.id || !dragPosition) return;

    onMove(sourceId, item.id, dragPosition);
    setDragPosition(null);
    setIsDragOver(false);
  };

  return (
    <div 
      className={`todo-item ${isDragging ? 'dragging' : ''} ${isDragOver ? 'drag-over' : ''}`}
      style={{ marginLeft: `${depth * 20}px` }}
      ref={itemRef}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <DragPreview position={dragPosition} depth={depth} />

      <div 
        className="todo-item-content"
        draggable
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        {hasChildren && (
          <button 
            onClick={() => setIsExpanded(!isExpanded)} 
            className="todo-item-button expand"
          >
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
        <SubtaskForm
          onSubmit={(text) => {
            onAddSubtask(item.id, text);
            setShowSubtaskForm(false);
          }}
          onCancel={() => setShowSubtaskForm(false)}
        />
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