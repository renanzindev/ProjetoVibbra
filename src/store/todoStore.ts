import { create } from 'zustand';
import { Todo, TodoItem } from '../types/todo';

interface TodoStore {
  todos: Record<string, Todo>;
  currentTodo: string | null;
  addTodo: (id: string) => void;
  deleteTodo: (id: string) => void;
  addItem: (todoId: string, text: string, parentId?: string) => void;
  updateItem: (todoId: string, itemId: string, text: string) => void;
  deleteItem: (todoId: string, itemId: string) => void;
  moveItem: (todoId: string, itemId: string, newParentId: string | null) => void;
}

const createNewTodo = (id: string): Todo => ({
  id,
  items: [],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

export const useTodoStore = create<TodoStore>((set) => ({
  todos: {},
  currentTodo: null,
  
  addTodo: (id) => set((state) => ({
    todos: { ...state.todos, [id]: createNewTodo(id) },
    currentTodo: id,
  })),
  
  deleteTodo: (id) => set((state) => {
    const { [id]: _, ...rest } = state.todos;
    return { todos: rest, currentTodo: null };
  }),
  
  addItem: (todoId, text, parentId) => set((state) => {
    const todo = state.todos[todoId];
    if (!todo) return state;

    const newItem: TodoItem = { id: crypto.randomUUID(), text, children: [] };
    
    const updateItems = (items: TodoItem[]): TodoItem[] => {
      if (!parentId) return [...items, newItem];
      
      return items.map(item => {
        if (item.id === parentId) {
          return { ...item, children: [...item.children, newItem] };
        }
        return { ...item, children: updateItems(item.children) };
      });
    };

    return {
      todos: {
        ...state.todos,
        [todoId]: {
          ...todo,
          items: updateItems(todo.items),
          updatedAt: new Date().toISOString(),
        },
      },
    };
  }),

  updateItem: (todoId, itemId, text) => set((state) => {
    const todo = state.todos[todoId];
    if (!todo) return state;

    const updateItems = (items: TodoItem[]): TodoItem[] =>
      items.map(item => {
        if (item.id === itemId) {
          return { ...item, text };
        }
        return { ...item, children: updateItems(item.children) };
      });

    return {
      todos: {
        ...state.todos,
        [todoId]: {
          ...todo,
          items: updateItems(todo.items),
          updatedAt: new Date().toISOString(),
        },
      },
    };
  }),

  deleteItem: (todoId, itemId) => set((state) => {
    const todo = state.todos[todoId];
    if (!todo) return state;

    const deleteFromItems = (items: TodoItem[]): TodoItem[] =>
      items
        .filter(item => item.id !== itemId)
        .map(item => ({ ...item, children: deleteFromItems(item.children) }));

    return {
      todos: {
        ...state.todos,
        [todoId]: {
          ...todo,
          items: deleteFromItems(todo.items),
          updatedAt: new Date().toISOString(),
        },
      },
    };
  }),

  moveItem: (todoId, itemId, newParentId) => set((state) => {
    const todo = state.todos[todoId];
    if (!todo) return state;

    let movedItem: TodoItem | null = null;

    const removeFromItems = (items: TodoItem[]): TodoItem[] =>
      items
        .filter(item => {
          if (item.id === itemId) {
            movedItem = item;
            return false;
          }
          return true;
        })
        .map(item => ({ ...item, children: removeFromItems(item.children) }));

    const addToNewParent = (items: TodoItem[]): TodoItem[] => {
      if (!movedItem) return items;
      
      if (!newParentId) return [...items, movedItem];

      return items.map(item => {
        if (item.id === newParentId) {
          return { ...item, children: [...item.children, movedItem!] };
        }
        return { ...item, children: addToNewParent(item.children) };
      });
    };

    const updatedItems = removeFromItems(todo.items);
    
    return {
      todos: {
        ...state.todos,
        [todoId]: {
          ...todo,
          items: addToNewParent(updatedItems),
          updatedAt: new Date().toISOString(),
        },
      },
    };
  }),
}));