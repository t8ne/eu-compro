import { Injectable, EventEmitter } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class ListService {
  listUpdated: EventEmitter<void> = new EventEmitter<void>();

  constructor(private firestore: AngularFirestore, private authService: AuthService) {}

  async getLists(): Promise<any[]> {
    const userId = await this.authService.getCurrentUserId();
    if (!userId) {
      throw new Error('User not authenticated');
    }
    const listsSnapshot = await this.firestore.collection(`users/${userId}/lists`).ref.get();
    const lists = listsSnapshot.docs.map(doc => ({ id: doc.id, ...(doc.data() as object) }));
    return lists;
  }

  async getListById(listId: string): Promise<any> {
    const userId = await this.authService.getCurrentUserId();
    if (!userId) {
      throw new Error('User not authenticated');
    }
    const listDoc = await this.firestore.doc(`users/${userId}/lists/${listId}`).ref.get();
    return listDoc.exists ? { id: listDoc.id, ...(listDoc.data() as object) } : null;
  }

  async createList(name: string): Promise<void> {
    const userId = await this.authService.getCurrentUserId();
    if (!userId) {
      throw new Error('User not authenticated');
    }
    const id = this.firestore.createId();
    await this.firestore.collection(`users/${userId}/lists`).doc(id).set({ id, name, items: [] });
    this.listUpdated.emit(); // Emit event
  }

  async renameList(listId: string, newName: string): Promise<void> {
    const userId = await this.authService.getCurrentUserId();
    if (!userId) {
      throw new Error('User not authenticated');
    }
    await this.firestore.collection(`users/${userId}/lists`).doc(listId).update({ name: newName });
    this.listUpdated.emit(); // Emit event
  }

  async addItemToList(listId: string, item: any): Promise<void> {
    const userId = await this.authService.getCurrentUserId();
    if (!userId) {
      throw new Error('User not authenticated');
    }
    const listRef = this.firestore.collection(`users/${userId}/lists`).doc(listId);
    const listDoc = await listRef.get().toPromise();

    if (listDoc && listDoc.exists) {
      const listData = listDoc.data() as any;
      if (listData.items) {
        // Check if item already exists
        const existingItem = listData.items.find((i: any) => i.name === item.name);
        if (existingItem) {
          existingItem.quantity += item.quantity; // Add quantity
        } else {
          listData.items.push(item);
        }
      } else {
        listData.items = [item];
      }
      await listRef.update({ items: listData.items });
      this.listUpdated.emit(); // Emit event
    } else {
      await listRef.set({ items: [item] }, { merge: true });
      this.listUpdated.emit(); // Emit event
    }
  }

  async deleteList(listId: string): Promise<void> {
    const userId = await this.authService.getCurrentUserId();
    if (!userId) {
      throw new Error('User not authenticated');
    }
    await this.firestore.collection(`users/${userId}/lists`).doc(listId).delete();
    this.listUpdated.emit(); // Emit event
  }

  async updateLists(lists: any[]): Promise<void> {
    const userId = await this.authService.getCurrentUserId();
    if (!userId) {
      throw new Error('User not authenticated');
    }
    const batch = this.firestore.firestore.batch();
    lists.forEach(list => {
      const listRef = this.firestore.collection(`users/${userId}/lists`).doc(list.id).ref;
      batch.set(listRef, list);
    });
    await batch.commit();
    this.listUpdated.emit(); // Emit event
  }


  async getNotificacoes(): Promise<any[]> {
    const userId = await this.authService.getCurrentUserId();
    if (!userId) {
      throw new Error('User not authenticated');
    }
    const notificacoesSnapshot = await this.firestore.collection(`users/${userId}/notificacoes`, ref => ref.orderBy('timestamp', 'desc')).get().toPromise();
    if (!notificacoesSnapshot) {
      return [];
    }
    return notificacoesSnapshot.docs.map(doc => {
      const data = doc.data() as Record<string, any>; // Ensure data is treated as an object
      return { id: doc.id, ...data };
    });
  }

  async createNotificacao(message: string): Promise<void> {
    const userId = await this.authService.getCurrentUserId();
    if (!userId) {
      throw new Error('User not authenticated');
    }
    const timestamp = new Date();
    await this.firestore.collection(`users/${userId}/notificacoes`).add({ message, timestamp });
  }
}
