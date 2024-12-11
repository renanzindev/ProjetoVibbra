import { TodoItem } from '../../types/todo';

export interface TodoItemProps {
  item: TodoItem;
  onUpdate: (id: string, text: string) => void;
  onDelete: (id: string) => void;
  onMove: (id: string, targetId: string | null, position: 'before' | 'after' | 'child') => void;
  onAddSubtask: (parentId: string, text: string) => void;
  depth?: number;
}

export interface TodoItemContentProps {
  text: string;
  isEditing: boolean;
  isExpanded: boolean;
  hasChildren: boolean;
  onExpand: () => void;
  onSubmit: (e: React.FormEvent) => void;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export interface TodoItemActionsProps {
  onEdit: () => void;
  onDelete: () => void;
  onAddSubtask: () => void;
}

export interface TodoItemChildrenProps {
  isExpanded: boolean;
  items: TodoItem[];
  onUpdate: (id: string, text: string) => void;
  onDelete: (id: string) => void;
  onMove: (id: string, targetId: string | null, position: 'before' | 'after' | 'child') => void;
  onAddSubtask: (parentId: string, text: string) => void;
  depth: number;
}