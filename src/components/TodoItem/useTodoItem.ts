import { useState } from 'react';
import { TodoItem } from '../../types/todo';

interface UseTodoItemProps {
  item: TodoItem;
  onUpdate: (id: string, text: string) => void;
}

export const useTodoItem = ({ item, onUpdate }: UseTodoItemProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);
  const [text, setText] = useState(item.text);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim()) {
      onUpdate(item.id, text);
      setIsEditing(false);
    }
  };

  const handleExpand = () => setIsExpanded(!isExpanded);
  const handleEdit = () => setIsEditing(!isEditing);
  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => setText(e.target.value);

  return {
    isEditing,
    isExpanded,
    text,
    handleSubmit,
    handleExpand,
    handleEdit,
    handleTextChange,
  };
};