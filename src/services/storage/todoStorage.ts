import { get, set, del, keys } from 'idb-keyval';
import { TodoList, TodoItem } from '../../types/todo';

const STORAGE_KEY = 'todo_lists';

export class TodoStorage {
  private static async getStore(): Promise<Record<string, TodoList>> {
    try {
      const store = await get(STORAGE_KEY);
      return store || {};
    } catch (error) {
      console.error('Error accessing storage:', error);
      return {};
    }
  }

  private static async saveStore(store: Record<string, TodoList>): Promise<void> {
    try {
      await set(STORAGE_KEY, store);
    } catch (error) {
      console.error('Error saving to storage:', error);
      throw new Error('Failed to save to storage');
    }
  }

  static async getAllLists(): Promise<TodoList[]> {
    const store = await this.getStore();
    return Object.values(store);
  }

  static async getList(id: string): Promise<TodoList | null> {
    const store = await this.getStore();
    return store[id] || null;
  }

  static async createList(title: string): Promise<TodoList> {
    const store = await this.getStore();
    const newList: TodoList = {
      id: crypto.randomUUID(),
      title,
      items: [],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    store[newList.id] = newList;
    await this.saveStore(store);
    return newList;
  }

  static async updateList(id: string, updates: Partial<TodoList>): Promise<TodoList> {
    const store = await this.getStore();
    const list = store[id];
    
    if (!list) {
      throw new Error('List not found');
    }

    store[id] = {
      ...list,
      ...updates,
      updated_at: new Date().toISOString()
    };

    await this.saveStore(store);
    return store[id];
  }

  static async deleteList(id: string): Promise<void> {
    const store = await this.getStore();
    delete store[id];
    await this.saveStore(store);
  }

  static async addItem(listId: string, text: string, parentId: string | null): Promise<TodoItem> {
    const store = await this.getStore();
    const list = store[listId];
    
    if (!list) {
      throw new Error('List not found');
    }

    const newItem: TodoItem = {
      id: crypto.randomUUID(),
      text,
      parent_id: parentId,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    list.items.push(newItem);
    list.updated_at = new Date().toISOString();
    
    await this.saveStore(store);
    return newItem;
  }

  static async updateItem(listId: string, itemId: string, text: string): Promise<TodoItem> {
    const store = await this.getStore();
    const list = store[listId];
    
    if (!list) {
      throw new Error('List not found');
    }

    const itemIndex = list.items.findIndex(item => item.id === itemId);
    if (itemIndex === -1) {
      throw new Error('Item not found');
    }

    list.items[itemIndex] = {
      ...list.items[itemIndex],
      text,
      updated_at: new Date().toISOString()
    };

    list.updated_at = new Date().toISOString();
    await this.saveStore(store);
    return list.items[itemIndex];
  }

  static async deleteItem(listId: string, itemId: string): Promise<void> {
    const store = await this.getStore();
    const list = store[listId];
    
    if (!list) {
      throw new Error('List not found');
    }

    // Remove o item e todos os seus subitens
    list.items = list.items.filter(item => {
      const isTarget = item.id === itemId;
      const isChild = this.isDescendantOf(item, itemId, list.items);
      return !isTarget && !isChild;
    });

    list.updated_at = new Date().toISOString();
    await this.saveStore(store);
  }

  static async moveItem(
    listId: string, 
    itemId: string, 
    targetId: string | null, 
    position: 'before' | 'after' | 'child'
  ): Promise<void> {
    const store = await this.getStore();
    const list = store[listId];
    
    if (!list) {
      throw new Error('List not found');
    }

    const sourceItem = list.items.find(item => item.id === itemId);
    if (!sourceItem) {
      throw new Error('Source item not found');
    }

    // Verifica se o movimento é válido (evita ciclos)
    if (targetId && this.isDescendantOf(sourceItem, targetId, list.items)) {
      throw new Error('Cannot move item to its own descendant');
    }

    // Atualiza o parent_id baseado na posição
    sourceItem.parent_id = position === 'child' ? targetId : 
                          targetId ? list.items.find(item => item.id === targetId)?.parent_id || null : 
                          null;

    list.updated_at = new Date().toISOString();
    await this.saveStore(store);
  }

  private static isDescendantOf(item: TodoItem, ancestorId: string, items: TodoItem[]): boolean {
    if (item.parent_id === ancestorId) return true;
    if (!item.parent_id) return false;
    
    const parent = items.find(i => i.id === item.parent_id);
    return parent ? this.isDescendantOf(parent, ancestorId, items) : false;
  }
}