import { TodoItem } from '../types/todo';

export const getChildItems = (items: TodoItem[], parentId: string | null): TodoItem[] => {
  return items.filter(item => item.parent_id === parentId);
};

export const getAllChildren = (items: TodoItem[], parentId: string): TodoItem[] => {
  const children = items.filter(item => item.parent_id === parentId);
  return [
    ...children,
    ...children.flatMap(child => getAllChildren(items, child.id))
  ];
};

export const validateMove = (
  items: TodoItem[],
  sourceId: string,
  targetId: string | null
): boolean => {
  if (!targetId) return true;
  
  // Prevent moving item to its own descendant
  const descendants = getAllChildren(items, sourceId);
  return !descendants.some(item => item.id === targetId);
};