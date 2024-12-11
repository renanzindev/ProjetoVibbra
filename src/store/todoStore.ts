import { create } from 'zustand';
import { TodoList, TodoItem } from '../types/todo';
import { TodoStorage } from '../services/storage/todoStorage';

interface TodoState {
  lists: Record<string, TodoList>;
  currentList: TodoList | null;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  loadLists: () => Promise<void>;
  createList: (title: string) => Promise<TodoList>;
  loadList: (id: string) => Promise<void>;
  deleteList: (id: string) => Promise<void>;
  addItem: (text: string, parentId: string | null) => Promise<void>;
  updateItem: (itemId: string, text: string) => Promise<void>;
  deleteItem: (itemId: string) => Promise<void>;
  moveItem: (itemId: string, targetId: string | null, position: 'before' | 'after' | 'child') => Promise<void>;
}

export const useTodoStore = create<TodoState>((set, get) => ({
  lists: {},
  currentList: null,
  isLoading: false,
  error: null,

  loadLists: async () => {
    set({ isLoading: true, error: null });
    try {
      const lists = await TodoStorage.getAllLists();
      const listsMap = lists.reduce((acc, list) => ({ ...acc, [list.id]: list }), {});
      set({ lists: listsMap, isLoading: false });
    } catch (error) {
      set({ error: 'Failed to load lists', isLoading: false });
    }
  },

  createList: async (title) => {
    set({ isLoading: true, error: null });
    try {
      const newList = await TodoStorage.createList(title);
      set(state => ({
        lists: { ...state.lists, [newList.id]: newList },
        currentList: newList,
        isLoading: false
      }));
      return newList;
    } catch (error) {
      set({ error: 'Failed to create list', isLoading: false });
      throw error;
    }
  },

  loadList: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const list = await TodoStorage.getList(id);
      if (list) {
        set({ currentList: list, isLoading: false });
      } else {
        throw new Error('List not found');
      }
    } catch (error) {
      set({ error: 'Failed to load list', isLoading: false });
    }
  },

  deleteList: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await TodoStorage.deleteList(id);
      set(state => {
        const { [id]: _, ...remainingLists } = state.lists;
        return {
          lists: remainingLists,
          currentList: state.currentList?.id === id ? null : state.currentList,
          isLoading: false
        };
      });
    } catch (error) {
      set({ error: 'Failed to delete list', isLoading: false });
    }
  },

  addItem: async (text, parentId) => {
    const { currentList } = get();
    if (!currentList) return;

    set({ isLoading: true, error: null });
    try {
      const newItem = await TodoStorage.addItem(currentList.id, text, parentId);
      set(state => ({
        currentList: state.currentList ? {
          ...state.currentList,
          items: [...state.currentList.items, newItem]
        } : null,
        isLoading: false
      }));
    } catch (error) {
      set({ error: 'Failed to add item', isLoading: false });
    }
  },

  updateItem: async (itemId, text) => {
    const { currentList } = get();
    if (!currentList) return;

    set({ isLoading: true, error: null });
    try {
      const updatedItem = await TodoStorage.updateItem(currentList.id, itemId, text);
      set(state => ({
        currentList: state.currentList ? {
          ...state.currentList,
          items: state.currentList.items.map(item =>
            item.id === itemId ? updatedItem : item
          )
        } : null,
        isLoading: false
      }));
    } catch (error) {
      set({ error: 'Failed to update item', isLoading: false });
    }
  },

  deleteItem: async (itemId) => {
    const { currentList } = get();
    if (!currentList) return;

    set({ isLoading: true, error: null });
    try {
      await TodoStorage.deleteItem(currentList.id, itemId);
      set(state => ({
        currentList: state.currentList ? {
          ...state.currentList,
          items: state.currentList.items.filter(item => item.id !== itemId)
        } : null,
        isLoading: false
      }));
    } catch (error) {
      set({ error: 'Failed to delete item', isLoading: false });
    }
  },

  moveItem: async (itemId, targetId, position) => {
    const { currentList } = get();
    if (!currentList) return;

    set({ isLoading: true, error: null });
    try {
      await TodoStorage.moveItem(currentList.id, itemId, targetId, position);
      const updatedList = await TodoStorage.getList(currentList.id);
      if (updatedList) {
        set({ currentList: updatedList, isLoading: false });
      }
    } catch (error) {
      set({ error: 'Failed to move item', isLoading: false });
    }
  }
}));