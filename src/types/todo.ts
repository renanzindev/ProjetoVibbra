export interface TodoItem {
    id: string;
    text: string;
    children: TodoItem[];
  }
  
  export interface Todo {
    id: string;
    items: TodoItem[];
    createdAt: string;
    updatedAt: string;
  }