import { Injectable } from '@angular/core';

interface Item {
  name: string;
  preco: number;
  quantity: number;
}

interface List {
  id: string;
  name: string;
  items: Item[];
}

@Injectable({
  providedIn: 'root'
})
export class ListService {
  private lists: List[] = [];

  constructor() {}

  getLists(): List[] {
    return this.lists;
  }

  getListById(id: string): List | undefined {
    return this.lists.find(list => list.id === id);
  }

  createList(name: string): List {
    const newList: List = { id: (this.lists.length + 1).toString(), name, items: [] };
    this.lists.push(newList);
    return newList;
  }

  renameList(id: string, newName: string) {
    const list = this.getListById(id);
    if (list) {
      list.name = newName;
    }
  }

  addItemToList(listId: string, item: Item) {
    const list = this.getListById(listId);
    if (list) {
      list.items.push(item);
    }
  }

  updateLists(lists: List[]) {
    this.lists = lists;
  }

  deleteList(id: string) {
    this.lists = this.lists.filter(list => list.id !== id);
  }
}
