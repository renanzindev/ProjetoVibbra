export interface TodoItem {
  id: string;
  text: string;
  parent_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface TodoList {
  id: string;
  title: string;
  items: TodoItem[];
  created_at: string;
  updated_at: string;
}

export type DragPosition = 'before' | 'after' | 'child';